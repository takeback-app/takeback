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

export function databasePlugin() {
  const plugin: PluginFn = (_config, _runner, { Group }) => {
    Group.macro("deleteTables", function () {
      this.each.setup(async () => {
        type Row = {
          tablename: string;
        };

        const data = await prisma.$queryRaw<Row[]>`
          SELECT tablename FROM pg_tables WHERE schemaname='public'
        `;

        for (const { tablename } of data) {
          if (tablename === "_prisma_migrations") {
            continue;
          }

          const sql = `TRUNCATE TABLE ${tablename} RESTART IDENTITY CASCADE;`;

          await prisma.$executeRawUnsafe(sql);
        }
      });
    });
  };

  return plugin;
}
