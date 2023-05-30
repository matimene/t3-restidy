import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const menusRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const storeId = ctx.store?.id;
    const menus = await ctx.prisma.menu.findMany({
      where: { storeId },
      include: { sections: true },
    });
    return menus;
  }),

  create: privateProcedure
    .input(
      z.object({
        order: z.number(),
        img: z.string().optional(),
        nameEn: z.string().optional(),
        nameEs: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const storeId = ctx.store?.id as number;

      await ctx.prisma.menu.create({
        data: {
          storeId,
          active: false,
          ...input,
        },
      });
    }),

  createSection: privateProcedure
    .input(
      z.object({
        menuId: z.number(),
        order: z.number(),
        itemIds: z.string().optional(),
        img: z.string().optional(),
        nameEn: z.string().optional(),
        nameEs: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.menuSections.create({
        data: {
          ...input,
        },
      });
    }),
});
