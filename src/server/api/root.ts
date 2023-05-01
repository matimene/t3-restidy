import { createTRPCRouter } from "~/server/api/trpc";
import { tablesRouter } from "~/server/api/routers/tables";
import { ordersRouter } from "~/server/api/routers/orders";
import { itemsRouter } from "~/server/api/routers/items";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tables: tablesRouter,
  orders: ordersRouter,
  items: itemsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
