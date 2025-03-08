

const { exec } = require("child_process");
const util=require("util")

const execPromise=util.promisify(exec)



const delete_networkFolder = async() => {
    try{
        await execPromise("rm -rf lib/src/networks")
        console.log("✅ Carpeta networks borrada correctamente.");

    }
    catch(err){
        console.error("❌ Error al borrar la carpeta:", err);

    }

};
const delete_docker_network = async () => {
    console.log("🛑 Eliminando todos los contenedores en la red...");

    try {
        // 🔍 Verificar si la red existe
        const { stdout: networkExists } = await execPromise(`docker network ls --filter name=besu-network --format "{{.Name}}"`);

        if (!networkExists.trim()) {
            console.log("⚠️ La red Docker no existe. No hay nada que eliminar.");
            return;
        }

        // 🔍 Verificar si hay contenedores en la red
        const { stdout: containers } = await execPromise(`docker ps -aq --filter "network=besu-network"`);
        
        if (containers.trim()) {
            console.log("🛑 Eliminando contenedores...");
            await execPromise(`docker rm -f $(docker ps -aq --filter "network=besu-network")`);
            console.log("✅ Contenedores eliminados.");
        } else {
            console.log("✅ No hay contenedores en la red.");
        }

        // 🔥 Ahora eliminamos la red Docker
        console.log("🌐 Eliminando red Docker...");
        await execPromise(`docker network rm besu-network`);
        console.log("✅ Red Docker eliminada correctamente.");

    } catch (err) {
        console.error("❌ Error al eliminar los contenedores o la red Docker:", err);
    }
};

// const delete_docker_network = async () => {
//     console.log("🛑 Eliminando todos los contenedores en la red...");

//     try {
//         // 🔍 Verificar si hay contenedores en la red
//         const { stdout } = await execPromise(`docker ps -aq --filter "network=besu-network"`);
        
//         if (!stdout.trim()) {
//             console.log("✅ No hay contenedores en la red.");
//             await removeNetwork(); // Llamamos a removeNetwork() solo si no hay contenedores
//             return;
//         }

//         // 🔥 Detener y eliminar los contenedores de la red
//         await execPromise(`docker rm -f $(docker ps -aq --filter "network=besu-network")`);
//         console.log("✅ Contenedores eliminados.");

//         // 🔥 Eliminar la red después de borrar los contenedores
//         await removeNetwork();

//     } catch (err) {
//         console.error("❌ Error al eliminar los contenedores o la red Docker:", err);
//     }
// };

// ✅ Función para eliminar la red

const removeNetwork = async () => {
    console.log("🌐 Eliminando red Docker...");
    try {
        await execPromise(`docker network rm besu-network`);
        console.log("✅ Red Docker eliminada correctamente.");
    } catch (err) {
        console.error("❌ Error al eliminar la red Docker:", err);
    }
};


const createNetworkFolder = async () => {
    console.log("📂 Creando carpeta networks...");

    try {
        await execPromise("mkdir -p lib/src/networks");
        console.log("✅ Carpeta networks creada.");
    } catch (err) {
        console.error("❌ Error al crear la carpeta:", err);
    }
};

module.exports = { delete_networkFolder,delete_docker_network,createNetworkFolder ,removeNetwork};