const { exec } = require("child_process");
const util = require("util");

const execPromise = util.promisify(exec);

const createNetwork = async () => {
    console.log("🌐 Verificando si la red Besu existe...");

    try {
        // 🔍 Verificar si la red ya existe
        const { stdout: networkExists } = await execPromise(`docker network ls --filter name=besu-network1 --format "{{.Name}}"`);
        
        if (networkExists.trim()) {
            console.log("⚠️ La red Besu ya existe. No es necesario crearla.");
            return;
        }

        // 🔥 Crear la red solo si no existe
        console.log("🌐 Creando red Besu en Docker...");
        await execPromise(`docker network create besu-network1 --label network=besu-network --label type=besu`);
        console.log("✅ Red Besu creada en Docker.");

    } catch (err) {
        console.error("❌ Error al crear la red Besu en Docker:", err);
    }
};

// ✅ Exportamos la función
module.exports = { createNetwork };
