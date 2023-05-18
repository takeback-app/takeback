import { types } from "pg";

import { knex as KnexInit } from "knex";
import { attachPaginate } from "knex-paginate";

const { builtins } = types;

types.setTypeParser(builtins.INT8, (value: string) => parseInt(value));
types.setTypeParser(builtins.FLOAT8, (value: string) => parseFloat(value));
types.setTypeParser(builtins.NUMERIC, (value: string) => parseFloat(value));

export const db = KnexInit({
  client: "pg",
  connection: process.env.DATABASE_URL,
  searchPath: ["knex", "public"],
});

attachPaginate();
