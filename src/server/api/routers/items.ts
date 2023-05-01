import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const itemsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const items = await ctx.prisma.item.findMany({
      where: { storeId: 0 }, // TODO: get store from subdomain
    });
    return items;
  }),
});
