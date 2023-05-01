import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const itemsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ ctx, input }) => {
      const store = await ctx.prisma.store.findUnique({
        where: { code: input.code },
      });
      if (!store) throw new TRPCError({ code: "NOT_FOUND" });

      const items = await ctx.prisma.item.findMany({
        where: { storeId: store.id }, // TODO: get store from subdomain
      });
      return items;
    }),
});
