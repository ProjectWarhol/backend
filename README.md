# Prerequisites

You need to install the following things to be able to run this project on your own hardware:

1. [nodeJS](https://nodejs.org/en/download/) (LTS v16.13.0)
2. At leaset two [PostgreSQL](https://www.postgresql.org/download/) v10 (or higher) instances for development & testing (we recommend v13 or higher)

# Getting Started

## Install

1. Clone this repository
2. Install dependencies with `npm install`
3. Duplicate `.env.example` and rename it to `.env`
4. Add enviroment variables to `.env`
5. Setup testing and development database
   1. Run `npm run setup:db` to drop & create a new database, and automatically add the fixtures
   2. Run `npm run setup:testing` to setup the testing database

## Run

1. Run `npm run dev` to start the development server (default port: 3000)
2. Run `npm run test` to run all tests
3. Run `npm run lint` for linting with ESLint
4. Run `npm run format` for formatting with Prettier

# Other

## Documentation

A documentation of this project can be found in the `/documentation` folder. It contains several sub-folders for the individual parts of the backend (i.e. a ER Diagram for the database, and a documentation of the API endpoints).

## Settings

- Change your linebreak style (End of Line Sequence) to `LF`

## Recommended VS-Code extensions

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
