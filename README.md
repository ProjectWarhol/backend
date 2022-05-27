# UNOS – Backend

This repository contains:

- the backend server code, written with JS
- the smart contracts, written with Solidity

## Prerequisites

You need to install the following things to be able to run this project on your own hardware:

1. [nodeJS](https://nodejs.org/en/download/) (LTS v16.13.0)
2. At leaset two [PostgreSQL](https://www.postgresql.org/download/) v10 (or higher) instances for development & testing (we recommend v13 or higher)
3. A [Redis](https://redis.io/docs/getting-started/installation/) instance.
4. truffle -> `npm install -g truffle`
5. [Ganache – local blockchain](https://trufflesuite.com/ganache/index.html)

## Getting Started

### Setup database

#### PostgreSQL

1. (On windows if using cmd please us `windows powershell cmd`) navigate to the `bin` folder in the postgresql folder.
2. create a new user `psql -U userName` and enter a `password` when prompted.
3. Set up a local Database by running `CREATE DATABASE name`.
   EX. (CREATE DATABASE myDatabase)
4. (optional) you may have to give your account database priviledges using the `GRANT ALL PRIVILEGES` command.
   EX. (GRANT ALL PRIVILEGES ON myDB . \* TO 'user'@'localhost';)

#### Redis

1. Follow installation guide on [here](https://redis.io/docs/getting-started/installation/).
2. Start the instance
   1. MacOS - Run `brew services start redis`.
   2. Windows - Run `sudo service redis-server start`.
3. Test Redis instance
   1. Run `redis-cli`
   2. Run `PING`
   3. If everything is working correctly, you should see `PONG` in the output.

### Install and setup the repository

1. Clone this repository
2. Install dependencies

   ```zsh
   npm install
   ```

3. Duplicate `.env.example` file and rename it to `.env`
4. Add enviroment variables to `.env`
   1. Enter a random `string` variable for the `FOO_COOKIE_SECRET` in order to have session cookie generated
   2. `DB_DEVELOPMENT_HOST`=localhost
   3. `DB_DEVELOPMENT_DATABASE` => the name of the database created for this project

      `DB_DEVELOPMENT_USERNAME` => the username that has access to the development database

      `DB_DEVELOPMENT_PASSWORD` => your database user password (note if the password containes numbers, you may have to use single quotes EX. 'password123')

      `DB_DEVELOPMENT_PORT` => usualy is '5432'
5. Setup testing and development database

   1. Run the following to drop & create a new database and automatically migrate and seed:

      ```zsh
      npm run setup:db
      ```

   2. Run the following to setup the testing database:

      ```zsh
      npm run setup:testing
      ```

6. Setup local blockchain

   1. Install truffle globally on you machine:

      ```zsh
      npm install -g truffle
      ```

   2. Run the following to compile Smart Contracts:

      ```zsh
      npm run compile
      ```

   3. Open Ganache – There is a 'Quickstart Ethereum' configuration which works fine with our project.

   4. Run the following to deploy Smart Contracts:

      ```zsh
      npm run mDev
      ```

      After this, you have to get the address of the PostNftMinting contract:

      1. In your console output, you should see something similar to this:
         ![console_output_truffle migrate](https://user-images.githubusercontent.com/28442090/163338955-e4df8b55-7e6e-4d9b-a25e-5acd012612fa.png)

      2. Copy the address of the contract and paste it to `CONTRACT_LOCAL_ADDRESS` in the `.env`

### Commands

1. Run `npm run dev` to start the development server (default port: 3000)
2. Run `npm run test:dev` to run development tests only
3. Run `npm run lint` for linting with ESLint
4. Run `npm run format` for formatting with Prettier
5. Run `npm run compile` to check Smart Contracts
6. Run `npm run mDev` to deploy Smart Contracts to local blockchain (Ganache should run in background)
7. Run `npm run test:sol` to run Smart Contract tests
8. Run `npm run lint:sol` to lint Smart Contract

## Other

### Project Architecture

![Project Architecture](https://user-images.githubusercontent.com/28442090/164616055-627c3748-2296-4ff4-84cc-1aa7c0fb95c1.png)

- Frontend:
  - react-native
- Backend:
  - ExpressJS
- Postgres DB:
  - ORM: Sequelize.js
  - Stores data needed by frontend for UI (Promotions, Comments, Votes...)
  - Stores sensitive user info (password hashes, wallets...)
- Redis:
  - Used for keeping a counter of each user's requests every minute
  - A middleware drops the requests if the user surpasses their rate
- Blockchain:
  - Chain: Ethereum
  - Smart Contracts: Solidity
  - Local Blockchain Env: Truffle & Ganache
- IPFS:
  - Distributed File System
  - Images of NFTS and their metadata is stored there

### Documentation

A documentation of this project can be found in the `https://www.notion.so/Backend-104f26d1a13b4f44ae26f7226cbc1e05` for the backend. It contains several sub-folders for the individual parts of the backend (i.e. a ER Diagram for the database, and a documentation of the API endpoints).

In addition the documentation for the Blockchain aspect can be found in `https://www.notion.so/Blockchain-64a5a7bc341445aeac85e62e6fd60679`. It contains several sub-folders for the individual functions and they're expect inputs and outputs and where to find them.

### Settings

- Change your linebreak style (End of Line Sequence) to `LF`

### Recommended VS-Code extensions

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Solidity](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity)

## Authors

- Omar Badawy – [@osbadawy](https://github.com/osbadawy) – Backend
- Massimiliano Ricci – [@mellifluus](https://github.com/mellifluus) – Backend
- Takahiro Mitsui – [@takahiromitsui](https://github.com/takahiromitsui) – Blockchain
- Maurice Gerhardt – [@heymage](https://github.com/heymage) – Blockchain
