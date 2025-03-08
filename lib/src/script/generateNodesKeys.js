const { exec } = require("child_process");
const util = require("util");

const execPromise = util.promisify(exec);

const generateNodeKeys = async (nodeName) => {
    console.log(`🔑 Generando claves para ${nodeName}...`);
    try {
        // Crear carpeta para el nodo si no existe
        await execPromise(`mkdir -p lib/src/networks/${nodeName}`);

        // Generar claves del nodo (esto crea private key y public key)
        await execPromise(`besu --data-path=lib/src/networks/${nodeName} public-key export --to=lib/src/networks/${nodeName}/nodeKey`);

        // Exportar dirección pública
        await execPromise(`besu --data-path=lib/src/networks/${nodeName} public-key export-address --to=lib/src/networks/${nodeName}/address`);
        
        console.log(`✅ Claves generadas y guardadas en lib/src/networks/${nodeName}/`);
    } catch (err) {
        console.error("❌ Error al generar claves:", err);
    }
};

// ✅ Ejecutar para "nodo1"


// ✅ Exportar la función para otros nodos
module.exports = { generateNodeKeys };
