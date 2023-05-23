import { createTRPCRouter } from "~/server/api/trpc";
import { tablesRouter } from "~/server/api/routers/tables";
import { ordersRouter } from "~/server/api/routers/orders";
import { itemsRouter } from "~/server/api/routers/items";
import { storesRouter } from "~/server/api/routers/stores";
import { physicalTablesRouter } from "~/server/api/routers/physicalTable";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  stores: storesRouter,
  tables: tablesRouter,
  orders: ordersRouter,
  items: itemsRouter,
  physicalTables: physicalTablesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
