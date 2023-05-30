import { createTRPCRouter } from "~/server/api/trpc";
import { categoriesRouter } from "~/server/api/routers/categories";
import { itemsRouter } from "~/server/api/routers/items";
import { menusRouter } from "~/server/api/routers/menus";
import { ordersRouter } from "~/server/api/routers/orders";
import { physicalTablesRouter } from "~/server/api/routers/physicalTable";
import { storesRouter } from "~/server/api/routers/stores";
import { tablesRouter } from "~/server/api/routers/tables";
import { usersRouter } from "~/server/api/routers/users";

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
  categories: categoriesRouter,
  menus: menusRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
