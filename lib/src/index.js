const { cleanNetwork } = require("./scripts/cleanNetwork");
const { createNetwork } = require("./scripts/createNetwork");

const networkName = "MiRedBesu"; // Nombre de la red Docker
const nodeCount = 3; // Número de nodos (ajustable)

async function setup() {
  console.log("🚀 Iniciando configuración de la red Besu...");

  // 1️⃣ Limpiar la red anterior y eliminar volúmenes huérfanos
  await new Promise((resolve) => cleanNetwork(networkName, resolve));

  // 2️⃣ Crear la nueva red si no existe
  await new Promise((resolve) => createNetwork(networkName, resolve));

  console.log("✅ Red creada y lista para configurar los nodos.");

  // 🚀 Próximo paso: Generar claves para los nodos
}

setup();
