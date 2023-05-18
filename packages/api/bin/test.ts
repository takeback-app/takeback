import dotenv from "dotenv";
dotenv.config({ path: ".env.testing" });

import { assert } from "@japa/assert";
import { specReporter } from "@japa/spec-reporter";
import { runFailedTests } from "@japa/run-failed-tests";
import { processCliArgs, configure, run } from "@japa/runner";

import { exec } from "node:child_process";
import util from "node:util";
import { databasePlugin } from "./utils/databasePlugin";
import { createConnection } from "typeorm";
import { redis } from "../src/redis";

const execSync = util.promisify(exec);

const prismaBinary = "./node_modules/.bin/prisma";

/*
|--------------------------------------------------------------------------
| Configure tests
|--------------------------------------------------------------------------
|
| The configure method accepts the configuration to configure the Japa
| tests runner.
|
| The first method call "processCliArgs" process the command line arguments
| and turns them into a config object. Using this method is not mandatory.
|
| Please consult japa.dev/runner-config for the config docs.
*/
configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ["tests/**/*.spec.ts"],
    plugins: [
      assert(),
      runFailedTests(),
      databasePlugin(),
      // apiClient("http://localhost:3333"),
    ],
    reporters: [specReporter()],
    importer: (filePath) => import(filePath),
    setup: [
      async () => {
        await execSync(`${prismaBinary} migrate deploy`);
        await execSync(`${prismaBinary} generate`);

        await createConnection({
          type: "postgres",
          url: process.env.DATABASE_URL,
          logging: JSON.parse(process.env.LOGGING),
          entities: [process.env.ENTITIES],
          migrations: [process.env.MIGRATIONS],
          subscribers: [process.env.SUBSCRIBERS],
        });
      },
    ],
    teardown: [() => redis.quit()],
  },
});

/*
|--------------------------------------------------------------------------
| Run tests
|--------------------------------------------------------------------------
|
| The following "run" method is required to execute all the tests.
|
*/
run();
