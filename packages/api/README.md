# API TAKE BACK

Steps to run this project:

## Configure the environment variables

    API_URL=your-ip-address:port or http://0.0.0.0:port
    APP_COMPANY_URL=your-ip-address:port or http://0.0.0.0:port
    APP_SUPPORT_URL=your-ip-address:port or http://0.0.0.0:port
    APP_MANAGER_URL=your-ip-address:port or http://0.0.0.0:port

    DB_HOST=host-of-your-database-server
    DB_PORT=port-of-your-database-server
    DB_NAME=name-of-your-database
    DB_USER=database-user-name
    DB_PASS=database-user-password

    ENTITIES=directory-of-the-entities-files
    MIGRATIONS=directory-of-the-migrations-files
    SUBSCRIBERS=directory-of-the-subscribers-files

    ENTITIES_DIR=directory-of-the-entities
    MIGRATIONS_DIR=directory-of-the-migrations
    SUBSCRIBERS_DIR=directory-of-the-subscribers

    LOGGING=enable-to-see-the-logs - boolean

    MAIL_CONFIG_HOST=your-email-host
    MAIL_CONFIG_PORT=email-connection-port
    MAIL_CONFIG_SECURE=if-secure-or-not
    MAIL_CONFIG_USER=your-email-user
    MAIL_CONFIG_PASS=your-email-password

    AWS_S3_ACCESS_KEY_ID=your-aws-identifier-key
    AWS_S3_SECRET_ACCESS_KEY=your-aws-secret-password
    AWS_S3_BUCKET_TICKETS=name-of-the-bucket
    AWS_S3_DEFAULT_REGION=region-of-the-bucket
    STORAGE_TYPE=storage-type | s3 or local

    JWT_PRIVATE_KEY=private-key-for-token-generation
    JWT_EXPIRES_IN=token-expiration-time

---

## Install depencies

_Run:_

    yarn
    or
    npm install

---

## Run docker or local database

_You can install docker and docker compose to generate the database or you can use a local postgres database_

## With docker

### Install the docker

[Download and install docker](https://docs.docker.com/engine/install/)

### Create the database with docker

_Run:_

    docker-compose up -d

## With local database

[Download and install postgres](https://www.postgresql.org/download/)

---

## Execute the migrations in your database connection to development environment

    npm run typeorm migration:run
    or
    yarn execute-mi

---

## Run App

    npm run dev
    or
    yarn dev

---

## Generate seed data

_Access the route in api:_

    Method: POST
    Route: /support/seed
    Parameters in the body:
        cpf: string;
        email: string;
        name: string;
