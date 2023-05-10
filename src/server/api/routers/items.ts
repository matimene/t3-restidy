import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const itemsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const storeId = ctx.store?.id;
    const items = await ctx.prisma.item.findMany({
      where: { storeId },
    });
    return items;
  }),
});
