import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const itemsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ ctx, input }) => {
      const storeId = ctx.store?.id;
      console.log(storeId);

      const items = await ctx.prisma.item.findMany({
        where: { storeId },
      });
      return items;
    }),
});
