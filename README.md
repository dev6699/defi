# DeFi Project Based on Uniswap V2 

## Overview
A decentralized finance (DeFi) application that leverages the architecture of Uniswap V2. This project enables users to trade and swap ERC-20 tokens and contribute to liquidity pools, following the principles of automated market-making (AMM) and liquidity provision.

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Disclaimer](#disclaimer)

## Tech Stack
- **Hardhat:** Ethereum development environment for compiling, testing, and deploying smart contracts.
- **React:** Frontend framework for building the user interface.
- **wagmi:** React hooks library for Ethereum that simplifies interaction with wallets and contracts.

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/dev6699/defi.git
    cd defi
    ```

2. Install dependencis:

    backend
    ```bash
    npm install
    ```
    
    frontend
    ```bash
    cd frontend
    npm install
    ```

## Usage
### Start local node
```bash
make node
```

### Deploy the contracts to a local blockchain
```bash
make deploy
```

### Generate contracts for frontend
```bash
make generate
```

### Run tests
```bash
make test
```

### Run tests coverage
```bash
make coverage
```

### Running the Frontend
Open http://localhost:3000 in your browser to view the app.
```bash
make dev
```

## Disclaimer
This project is created for learning and educational purposes only. It is not intended for production use or to be deployed on the mainnet. Users should exercise caution and are encouraged to review and understand the code before using it in any capacity.