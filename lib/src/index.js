const { createConfigToml } = require("./config/createConfig_toml");
const { createGenesisFile } = require("./config/createGenesis");
const {
  createNetworkFolder,
  delete_networkFolder,
  delete_docker_network,
} = require("./script/cleanNetwork");
const { createNetwork } = require("./script/createNetwork");
const { generateNodeKeys } = require("./script/generateNodesKeys");

const main = async () => {
  await delete_networkFolder();
  await delete_docker_network();
  await createNetworkFolder();
  console.log("todo listo para empezar en docker");
  await createNetwork();
  await generateNodeKeys("nodo1");

  console.log("🔄 Creando archivo genesis.json...");
  await createGenesisFile();
  await createConfigToml();
};


main();
