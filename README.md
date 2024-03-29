# CRAC – Backend

This repository contains:

- the backend server code, written with JS
- the smart contracts, written with Solidity

## Prerequisites

You need to install the following things to be able to run this project on your own hardware:

1. [nodeJS](https://nodejs.org/en/download/) (LTS v16.13.0)
2. At least two [PostgreSQL](https://www.postgresql.org/download/) v10 (or higher) instances for development & testing (we recommend v13 or higher)

## Getting Started

### Setup database

#### PostgreSQL

1. (On windows if using cmd please us `windows powershell cmd`) navigate to the `bin` folder in the postgresql folder.
2. create a new user `psql -U userName` and enter a `password` when prompted.
3. Set up a local Database by running `CREATE DATABASE name`.
   e.g., (CREATE DATABASE myDatabase)
4. (optional) you may have to give your account database privileges using the `GRANT ALL PRIVILEGES` command.
   e.g., (GRANT ALL PRIVILEGES ON myDB . \* TO 'user'@'localhost';)

### Install and setup the repository

1. Clone this repository
2. Install dependencies

   ```zsh
   npm install
   ```

3. Duplicate `.env.example` file and rename it to `.env`
4. Add environment variables to `.env`

   1. Enter a random `string` variable for the `FOO_COOKIE_SECRET` in order to have session cookie generated
   2. `DB_HOST`=localhost
      `DB_DATABASE` => the name of the database created for this project

      `DB_USERNAME` => the username that has access to the development database

      `DB_PASSWORD` => your database user password (note if the password contains numbers, you may have to use single quotes e.g., 'password123')

      `DB_PORT` => usually is '5432'

   3. Variables for testing

      `DB_HOST_TEST`=your testing host name

      `DB_DATABASE_TEST` => your testing database name

      `DB_USERNAME_TEST` => your username for testing database

      `DB_PASSWORD_TEST` => your database user password (note if the password contains numbers, you may have to use single quotes e.g., 'password123')

      `DB_PORT_TEST` => your testing database port

5. Setup testing and development database

   1. Run the following to drop & create a new database and automatically migrate and seed:

      ```zsh
      npm run setup:db
      ```

   2. Run the following to setup the testing database:

      ```zsh
      npm run setup:testing
      ```

### Commands

1. Run `npm run dev` to start the development server (default port: 3000)
2. Run `npm run test:dev` to run development tests only (make sure you set up testing environment variables)
3. Run `npm run lint` for linting with ESLint
4. Run `npm run format` for formatting with Prettier

## Continuous Integration/Delivery

This repository includes a CI/CD pipeline (Github actions) to check pull-request and merge to the main branch. These GitHub actions automatically deploy the latest main branch by PM2 on Digitalocean. [PM2](https://pm2.keymetrics.io) is a daemon process manager that will keep our application online. The overview is as follows:
![crac_ci_cd](https://user-images.githubusercontent.com/78789212/201517440-0ea21617-74c3-44ba-9eba-ddcb1686ce1d.png)

## Cloud Architecture

CRAC project has hosted this backend app on Digitalocean. As the first plan, we have used Docker for CI/CD pipelines, which have now been replaced with PM2 settings.

CRAC project has utilised NGINX as a reverse proxy.

The overview is as follows:
![crac_cloud_infra](https://user-images.githubusercontent.com/78789212/201524737-e7e0eb78-e6c0-4136-a5a7-18bfb184f07a.png)

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
- ~~Redis~~ => Replaced it with NGINX:
  - Used for keeping a counter of each user's requests every minute
  - A middleware drops the requests if the user surpasses their rate

### Documentation

A documentation of this project can be found in the `https://www.notion.so/Backend-104f26d1a13b4f44ae26f7226cbc1e05` for the backend. It contains several sub-folders for the individual parts of the backend (i.e. a ER Diagram for the database, and a documentation of the API endpoints).

### Settings

- Change your linebreak style (End of Line Sequence) to `LF`

### Recommended VS-Code extensions

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Authors

- Omar Badawy – [@osbadawy](https://github.com/osbadawy) – Backend/Frontend
- Massimiliano Ricci – [@mellifluus](https://github.com/mellifluus) – Backend
- Takahiro Mitsui – [@takahiromitsui](https://github.com/takahiromitsui) – Blockchain/Dev Ops
- Maurice Gerhardt – [@heymage](https://github.com/heymage) – Blockchain
