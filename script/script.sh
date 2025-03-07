# Eliminar la red y contenedores existentes
rm -rf networks

docker rm -f $(docker ps -aq --filter "label=network=besu-network") 2>/dev/null || true
docker network rm besu-network 2>/dev/null || true

# Configuración de la red
NETWORK="172.24.0.0/16"
BOOTNODE_IP="172.24.0.20"

# Crear el directorio de la red
mkdir -p networks/besu-network

# Crear red en Docker
docker network create besu-network \
  --subnet "$NETWORK" \
  --label network=besu-network \
  --label type=besu

# Generar claves del bootnode
cd networks/besu-network
mkdir -p bootnode
cd bootnode
node ../../../index.mjs create-keys "${BOOTNODE_IP}"
cd ../../..

# Generar `genesis.json`
cat > networks/besu-network/genesis.json <<EOF
{
  "config": {
    "chainId": 13371337,
    "londonBlock": 0,
    "clique": {
      "blockpersecond": 4,
      "epochlength": 3000,
      "createemptyblocks": true
    }
  },
  "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000$(cat networks/besu-network/bootnode/address)00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "gasLimit": "0x1ffffffffffff",
  "difficulty": "0x1",
  "alloc": {
    "$(cat networks/besu-network/bootnode/address)": { "balance": "0x200000000000000000000000000000000000000000000000" }
  }
}
EOF

# Generar `config.toml`
cat > networks/besu-network/config.toml <<EOF
genesis-file="data/genesis.json"

# Configuración de red entre los nodos
p2p-host="0.0.0.0"
p2p-port=30303
p2p-enable=true

# JSON-RPC
rpc-http-enable=true
rpc-http-host="0.0.0.0"
rpc-http-port=8545
rpc-http-cors-origins=["*"]
rpc-http-api=["ETH","NET","CLIQUE","ADMIN","TRACE","DEBUG","TXPOOL","PERM"]
host-allowlist=["*"]
EOF


## docker besu lo lanzamos



docker run -d \
  --name besu-network-bootnode \
  --label nodo=bootnode \
  --label network=besu-network \
  --network besu-network \
  --ip ${BOOTNODE_IP} \
  -p 8545:8545 \
  -v $(pwd)/networks/besu-network:/data \
  hyperledger/besu:latest \
  --config-file=/data/config.toml \
  --data-path=/data/bootnode/data \
  --node-private-key-file=/data/bootnode/key.priv \
  --genesis-file=/data/genesis.json