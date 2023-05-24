import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const itemsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const storeId = ctx.store?.id;
    const items = await ctx.prisma.item.findMany({
      where: { storeId, active: true },
    });
    return items;
  }),

  create: privateProcedure
    .input(
      z.object({
        price: z.number(),
        sku: z.string(),
        img: z.string().optional(),
        categoryCodes: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionEs: z.string().optional(),
        titleEn: z.string().optional(),
        titleEs: z.string().optional(),
        tagsEn: z.string().optional(),
        tagsEs: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const storeId = ctx.store?.id as number;

      await ctx.prisma.item.create({
        data: {
          storeId,
          active: true,
          ...input,
        },
      });
    }),
});
