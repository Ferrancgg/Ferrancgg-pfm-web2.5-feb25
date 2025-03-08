// const fs = require("fs");
// const path = require("path");

// const getNodeAddress = () => {
//     try {
//         const addressPath = path.join(__dirname, "../networks/nodo1/address"); 
//         if (!fs.existsSync(addressPath)) {
//             throw new Error("❌ No se encontró el archivo de dirección del nodo1.");
//         }
//         const address = fs.readFileSync(addressPath, "utf8").trim();
//         const addressExtraData = address.slice(2); // 🔥 Quita los dos primeros caracteres (0x)
        
//         console.log(`📌 Dirección del nodo1 obtenida: ${address}`);
//         console.log(`📌 Dirección sin '0x': ${addressExtraData}`);

//         return { address, addressExtraData };
//     } catch (error) {
//         console.error(error.message);
//         return null;
//     }
// };

// const createGenesisFile = () => {
//     const nodeData = getNodeAddress();
//     if (!nodeData) {
//         console.error("⚠️ No se pudo obtener la dirección del nodo1. Abortando.");
//         return;
//     }

//     const { address, addressExtraData } = nodeData;

//     // / ✅ Extraemos ambas variables correctamente

//     const generateExtraData = (validatorAddress) => {
//         const prefix = "0x" + "00".repeat(32); // 32 bytes de ceros
//         const suffix = "00".repeat(65); // 65 bytes de ceros
//         return `${prefix}${validatorAddress}${suffix}`;
//     };
    
    
//     const extraData = generateExtraData(addressExtraData);
//     console.log("ExtraData generado:", extraData);
    
//     const genesisData = {
//         "config": {
//             "chainId": 13371337,
//             "londonBlock": 0,
//             "clique": {
//                 "blockpersecond": 4,
//                 "epochlength": 3000,
//                 "createemptyblocks": true
//             }
//         },
//         // "extraData": `0x0000000000000000000000000000000000000000000000000000000000000000${addressExtraData}00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`,
//         "extraData": extraData,
//         "gasLimit": "0x1ffffffffffff",
//         "difficulty": "0x1",
//         "alloc": {
//             [address]: { "balance": "0x200000000000000000000000000000000000000000000000" }
//         }
//     };

//     const configPath = path.join(__dirname, "../networks/genesis.json");

//     try {
//         fs.writeFileSync(configPath, JSON.stringify(genesisData, null, 2));
//         console.log("✅ Archivo genesis.json creado en la carpeta networks.");
//     } catch (error) {
//         console.error("❌ Error al crear genesis.json:", error);
//     }
// };

// // **Exportar la función**
// module.exports = { createGenesisFile };
const fs = require("fs");
const path = require("path");

// ✅ Obtiene la dirección del nodo desde el archivo en networks/nodo1/address
const getNodeAddress = () => {
    try {
        const addressPath = path.join(__dirname, "../networks/nodo1/address");
        if (!fs.existsSync(addressPath)) {
            throw new Error("❌ No se encontró el archivo de dirección del nodo1.");
        }
        const address = fs.readFileSync(addressPath, "utf8").trim();
        if (!address.startsWith("0x") || address.length !== 42) {
            throw new Error("❌ La dirección obtenida no es válida.");
        }
        const addressExtraData = address.slice(2); // 🔥 Quita '0x'
        
        console.log(`📌 Dirección del nodo1 obtenida: ${address}`);
        console.log(`📌 Dirección sin '0x': ${addressExtraData}`);

        return { address, addressExtraData };
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

// ✅ Genera el `extraData` en formato correcto para Clique
const generateExtraData = (validatorAddress) => {
    const prefix = "0x" + "00".repeat(32); // 32 bytes de ceros
    const suffix = "00".repeat(65); // 65 bytes de ceros
    return `${prefix}${validatorAddress}${suffix}`;
};

// ✅ Crea el archivo `genesis.json`
const createGenesisFile = () => {
    const nodeData = getNodeAddress();
    if (!nodeData) {
        console.error("⚠️ No se pudo obtener la dirección del nodo1. Abortando.");
        return;
    }

    const { address, addressExtraData } = nodeData;
    const extraData = generateExtraData(addressExtraData);

    console.log("📌 ExtraData generado:", extraData);

    const genesisData = {
        "config": {
            "chainId": 13371337,
            "londonBlock": 0,
            "clique": {
                "blockperiod": 4, // ⬅️ CORRECCIÓN: `blockpersecond` no es válido en Clique
                "epochlength": 3000,
                "createemptyblocks": true
            }
        },
        "extraData": extraData,
        "gasLimit": "0x1ffffffffffff",
        "difficulty": "0x1",
        "alloc": {
            [address]: { "balance": "0x200000000000000000000000000000000000000000000000" }
        }
    };

    const configPath = path.join(__dirname, "../networks/genesis.json");

    try {
        fs.writeFileSync(configPath, JSON.stringify(genesisData, null, 2));
        console.log("✅ Archivo genesis.json creado en la carpeta networks.");
    } catch (error) {
        console.error("❌ Error al crear genesis.json:", error);
    }
};

// ✅ Exportar la función
module.exports = { createGenesisFile };
