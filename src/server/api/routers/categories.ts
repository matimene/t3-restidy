import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const categoriesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const storeId = ctx.store?.id;
    const categories = await ctx.prisma.category.findMany({
      where: { storeId },
      include: {
        parentCategory: true,
        subCategories: true,
      },
    });
    return categories;
  }),

  create: privateProcedure
    .input(
      z.object({
        code: z.string(),
        order: z.number(),
        parentId: z.number().optional(),
        nameEn: z.string().optional(),
        nameEs: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const storeId = ctx.store?.id;

      await ctx.prisma.category.create({
        data: {
          storeId,
          ...input,
        },
      });
    }),
});
