const fs = require("fs");
const path = require("path");

// 🔹 Función para obtener la clave pública del nodo
const getNodePublicKey = () => {
    console.log("🟢 Entrando en la función getNodePublicKey()");
    const publicKeyPath = path.join(__dirname, "../networks/nodo1/nodeKey"); // Ruta corregida
    console.log(`🔍 Buscando clave pública en: ${publicKeyPath}`);

    if (!fs.existsSync(publicKeyPath)) {
        console.error("❌ No se encontró la clave pública del nodo.");
        return null;
    }

    const publicKey = fs.readFileSync(publicKeyPath, "utf8").trim();
    console.log(`📌 Clave pública obtenida: ${publicKey}`);
    return publicKey;
};

// 🔹 Función para obtener la IP del nodo
const getNodeIP = () => {
    console.log("🌐 Obteniendo IP del nodo...");
    return "192.168.1.100"; // ⚠️ Cambia esto si usas Docker o IP dinámica
};

// 🔹 Función para crear `config.toml`
const createConfigToml = () => {
    console.log("🟢 Entrando en la función createConfigToml()");
    console.log("📝 Iniciando creación de config.toml...");

    const publicKey = getNodePublicKey();
    if (!publicKey) {
        console.error("⚠️ No se pudo obtener la clave pública. Abortando.");
        return;
    }

    const ip = getNodeIP();
    console.log(`📌 IP del nodo: ${ip}`);

    const publicKeyFormat = publicKey.slice(2); // 🔥 Quita "0x"
    const enode = `enode://${publicKeyFormat}@${ip}:30303`;
    console.log(`📌 Enode generado: ${enode}`);

    // 📝 Contenido de `config.toml`
    const configContent = `
genesis-file="../genesis.json"

# Configuración de red entre los nodos
p2p-host="0.0.0.0"
p2p-port=30303
p2p-enable=true

bootnodes=["${enode}"]  # Enode del nodo bootnode

# JSON-RPC
rpc-http-enable=true
rpc-http-host="0.0.0.0"
rpc-http-port=8545
rpc-http-cors-origins=["*"]
rpc-http-api=["ETH","NET","CLIQUE","ADMIN","TRACE","DEBUG","TXPOOL","PERM"]
host-allowlist=["*"]
`.trim();

    // 📂 Asegurar que la carpeta `networks` existe
    const networksPath = path.join(__dirname, "../networks");
    console.log(`📂 Verificando si existe la carpeta networks: ${networksPath}`);

    if (!fs.existsSync(networksPath)) {
        console.log("📂 La carpeta networks no existe. Creándola...");
        fs.mkdirSync(networksPath, { recursive: true });
    } else {
        console.log("✅ La carpeta networks ya existe.");
    }

    // 📄 Guardar el archivo `config.toml` en `networks/`
    const configFilePath = path.join(networksPath, "config.toml");
    console.log(`💾 Guardando archivo en: ${configFilePath}`);

    try {
        fs.writeFileSync(configFilePath, configContent);
        console.log("✅ Archivo config.toml creado correctamente en networks/");
    } catch (error) {
        console.error("❌ Error al crear config.toml:", error);
    }
};

// **📤 Exportar la función**
module.exports = { createConfigToml };
