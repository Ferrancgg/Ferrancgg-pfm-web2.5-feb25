const { exec } = require("child_process");

const networkExists = (networkName, callback) => {
  exec(`docker network ls --filter name=${networkName} --format "{{.Name}}"`, (err, stdout) => {
    if (err) {
      console.error("⚠️ Error al comprobar la red Docker:", err);
      return callback(false);
    }
    
    const exists = stdout.trim() === networkName;

    if (exists) {
      console.log(`🔴 La red ${networkName} existe. Eliminándola...`);
      
      exec(`docker network rm ${networkName}`, (rmErr) => {
        if (rmErr) {
          console.error("❌ Error al borrar la red:", rmErr);
        } else {
          console.log(`✅ Red ${networkName} eliminada correctamente.`);
          checkDockerVolumes();
        }
        callback(exists);
      });
    } else {
      console.log("⚠️ La red no existe, no hay nada que eliminar.");
      callback(exists);
      checkDockerVolumes(); // 🔥 Ahora listamos los volúmenes incluso si la red no existía
    }
  });
};

// ✅ Nueva función para listar y eliminar volúmenes huérfanos
const checkDockerVolumes = () => {
  exec("docker volume ls --format '{{.Name}}'", (err, stdout) => {
    if (err) {
      console.error("❌ Error al obtener la lista de volúmenes:", err);
      return;
    }

    const volumes = stdout.trim().split("\n").filter(Boolean);

    if (volumes.length === 0) {
      console.log("📦 No hay volúmenes en Docker.");
      return;
    }

    console.log("📦 Volúmenes detectados:", volumes);

    volumes.forEach(volume => {
      exec(`docker ps -a --filter volume=${volume} --format '{{.Names}}'`, (err, stdout) => {
        if (err) {
          console.error(`❌ Error al verificar el volumen ${volume}:`, err);
          return;
        }

        if (stdout.trim()) {
          console.log(`✅ El volumen ${volume} está en uso por el contenedor: ${stdout.trim()}`);
        } else {
          console.log(`⚠️ El volumen ${volume} está huérfano (no asociado a ningún contenedor).`);

          // 🔥 Eliminar volúmenes huérfanos automáticamente (descomenta si lo quieres activo)
          exec(`docker volume rm ${volume}`, () => console.log(`🗑️ Volumen ${volume} eliminado.`));
        }
      });
    });
  });
};

// 🔥 Prueba de las funciones
networkExists("MiRedBesu", (exists) => {
  if (exists) {
    console.log("✅ La red Docker ha sido eliminada.");
  } else {
    console.log("❌ La red Docker no existía.");
  }
});
