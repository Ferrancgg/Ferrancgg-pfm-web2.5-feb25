# Ferrancgg-pfm-web2.5-feb25
Motivación

El propósito de este proyecto es automatizar la creación y gestión de una red blockchain basada en Hyperledger Besu, utilizando Docker para desplegar nodos y facilitando su interacción mediante una API REST y una interfaz gráfica. Se busca profundizar en el funcionamiento de los nodos Hyperledger Besu, la creación de redes internas de Docker y su administración programática mediante scripts y TypeScript.

Tecnologías Utilizadas

Frontend: React (NextJS)
Backend: NodeJS con TypeScript
Contenedorización: Docker o Kubernetes (K8S)
Blockchain Framework: Hyperledger Besu con el protocolo Clique
Sistema Operativo: Linux, MacOS o WSL en Windows
Entendimiento Técnico

Funcionamiento de un Nodo Hyperledger Besu

Hyperledger Besu es un cliente Ethereum compatible con EVM que permite la ejecución de redes blockchain privadas y públicas. En este proyecto se usará el protocolo Clique (Proof of Authority) para la validación de transacciones.

Redes Internas de Docker

Docker permite la creación de redes internas aisladas, facilitando la comunicación entre los distintos contenedores que alojarán los nodos de la red blockchain.

Uso Programático de Docker

Se desarrollará una biblioteca en TypeScript que permita la gestión programática de los nodos mediante comandos Docker.