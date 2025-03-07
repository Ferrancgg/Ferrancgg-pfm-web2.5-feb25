// import pkg from "elliptic";
// const { ec: EC } = pkg;

// // import {ethers} from 'ethers'

// import { Buffer } from "buffer";
// import { keccak256 } from "keccak256";
// // import fs from 'fs'

// const callApi = async (url, method, params) => {
//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         jsonrpc: "2.0",
//         method: method,
//         params: params,
//         id: 1,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(
//         `HTTP Error: ${response.status} - ${response.statusText}`
//       );
//     }

//     const json = await response.json();

//     if (json.error) {
//       throw new Error(`API Error: ${json.error.message || "Unknown error"}`);
//     }

//     return json.result;
//   } catch (error) {
//     console.error("callApi Error:", error.message);
//     return null;
//   }
// };

// const createKeys = (ip) => {
//   // curva eth,btc

//   const ec = new EC("secp256k1");

//   // genera un par de claves
//   const keyPair = ec.genKeyPair();
//   const privateKey = keyPair.getPrivate("hex");
//   const publicKey = keyPair.getPublic("hex");

//   // formateamos para quiera dos caracteres
//   const pubKeyBuffer = keccak256(Buffer.from(publicKey.slice(2), "hex"));

//   // tomamos los ultimos 40 caracteres
//   const address = pubKeyBuffer.toString("hex").slice(-40);

//   // get enode

//   const enode = `enode://${publicKey.slice(2)}@${ip}:30303`;

//   return {
//     privateKey,
//     publicKey,
//     address,
//     enode,
//   };
// };


import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Función para calcular Keccak256
const keccak256 = (data) => {
    return crypto.createHash('sha3-256').update(data).digest('hex');
};

// Función para generar claves
const createKeys = (ip) => {
    // Generamos un par de claves usando secp256k1
    const ecdh = crypto.createECDH('secp256k1');
    ecdh.generateKeys();
    
    const privateKey = ecdh.getPrivateKey('hex');
    const publicKey = ecdh.getPublicKey('hex').slice(2); // Eliminamos el prefijo '04'

    // Calculamos la dirección Ethereum (últimos 40 caracteres del hash Keccak256)
    const address = `0x${keccak256(Buffer.from(publicKey, 'hex')).slice(-40)}`;

    // Generamos el enode
    const enode = `enode://${publicKey}@${ip}:30303`;

    // Definimos la ruta de almacenamiento correctamente
    const bootnodePath = path.join('networks', 'besu-network', 'bootnode');
    if (!fs.existsSync(bootnodePath)) {
        fs.mkdirSync(bootnodePath, { recursive: true });
    }

    // Guardamos la dirección en un archivo (ruta corregida)
    const addressPath = path.join(bootnodePath, 'address');
    fs.writeFileSync(addressPath, address);
    console.log(`✅ Dirección guardada correctamente en: ${addressPath}`);

    return { privateKey, publicKey, address, enode };
};

// Ejecutamos la función con la IP del nodo
createKeys('192.168.1.100');
