Instructions for Running the eduzz_dev Project (Linux)

This document provides detailed instructions for setting up and running the eduzz_dev project in a Linux environment.
Requirements

Postman link: https://murilloxfogaca.github.io/postman/eduzz-dev-backend-btc.json

Make sure you have the following installed on your system:

    Node.js (recommended version: 16.x)
    npm (Node.js package manager)
    TypeScript (version 4.5.2)
    PostgreSQL database (optional for use with TypeORM)

Installation
Cloning the Repository

Clone this repository to your local environment:

bash

git clone <url_do_seu_repositorio>
cd eduzz_dev

Installing Dependencies

Install the project dependencies using npm:

bash

npm install

Configuration
Environment Variables

Create a .env file at the root of the project and set the necessary environment variables, such as database connections, JWT keys, etc. A basic example might be:


    PORT=3000
    DB_HOST=localhost
    DB_USER=your_user
    DB_PASS=your_password
    DB_NAME=your_database_name
    JWT_SECRET=your_jwt_secret_key

TypeORM Configuration

Configure TypeORM by editing the ormconfig.json file at the root of the project, if necessary, to match your database settings.

Basic example of ormconfig.json:

json

    {
      "type": "postgres",
      "host": "localhost",
      "port": 5432,
      "username": "your_user",
      "password": "your_password",
      "database": "your_database_name",
      "synchronize": true,
      "logging": false,
      "entities": ["src/config/domain/**/*{.js,.ts}"],
      "migrations": ["src/config/migration/**/*{.js,.ts}"],
      "subscribers": ["src/config/subscriber/**/*{.js,.ts}"]
    }

Execution
Compile for Production

To compile the TypeScript project to JavaScript, run:

bash

npm run migration
npm run build

This creates a build folder with the compiled files ready for production.
Run in Production Mode

To start the project in production mode after compilation, run:

bash

npm start

Useful Commands

    npm run migration: Runs TypeORM migrations.
