const { exec } = require("child_process");
const util = require("util");

const execPromise = util.promisify(exec);

const createNetwork = async (name) => {
  try {
    const { stdout } = await execPromise(`docker network ls --filter name=${name} --format "{{.Name}}"`);
    
    if (stdout.trim() === name) {
      console.log(`⚠️ La red ${name} ya existe en Docker.`);
      return;
    }

    console.log(`🔄 Creando la red ${name} en Docker...`);
    await execPromise(`docker network create ${name}`);
    console.log(`✅ Red ${name} creada correctamente.`);
  } catch (error) {
    console.error(`❌ Error al crear la red ${name}:`, error);
  }
};

// 🔥 Prueba de la función
(async () => {
  await createNetwork("MiRedBesu");
})();
