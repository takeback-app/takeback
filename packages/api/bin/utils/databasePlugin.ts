import { PluginFn } from "@japa/runner";
import { prisma } from "../../src/prisma";

declare module "@japa/runner" {
  interface Group {
    /**
     * Delete all data from tables in array.
     */
    deleteTables: () => void;
  }
}

type Row = {
  tablename: string;
};

export function databasePlugin() {
  const plugin: PluginFn = (_config, _runner, { Group }) => {
    Group.macro("deleteTables", function () {
      this.each.setup(async () => {
        const data = await prisma.$queryRaw<Row[]>`
          SELECT tablename FROM pg_tables WHERE schemaname='public'
        `;

        const queries = [];

        for (const { tablename } of data) {
          if (tablename === "_prisma_migrations") {
            continue;
          }

          const sql = `TRUNCATE TABLE ${tablename} RESTART IDENTITY CASCADE;`;

          queries.push(prisma.$executeRawUnsafe(sql));
        }

        await prisma.$transaction(queries);
      });
    });
  };

  return plugin;
}
