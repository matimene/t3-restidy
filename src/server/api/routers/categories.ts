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
  getOne: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.category.findUniqueOrThrow({
        where: { id: input.id },
      });
      return item;
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
  edit: privateProcedure
    .input(
      z.object({
        id: z.number(),
        code: z.string(),
        order: z.number(),
        parentId: z.number().nullish(),
        nameEn: z.string().nullish(),
        nameEs: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedCategory = await ctx.prisma.category.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });

      return updatedCategory;
    }),
});
