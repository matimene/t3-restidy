import { optional, z } from "zod";
import menu from "~/pages/menu";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const menusRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          active: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const storeId = ctx.store?.id;
      const menus = await ctx.prisma.menu.findMany({
        where: {
          storeId,
          active: input?.active,
        },
        include: {
          sections: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });
      return menus;
    }),

  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const storeId = ctx.store?.id as number;
      const menu = await ctx.prisma.menu.findFirstOrThrow({
        where: {
          storeId,
          slug: input.slug,
        },
        include: {
          sections: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });
      return menu;
    }),

  create: privateProcedure
    .input(
      z.object({
        nameEn: z.string().nullish().default("New Menu"),
        nameEs: z.string().nullish().default("Nuevo Menu"),
        slug: z.string().default("new-menu"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const storeId = ctx.store.id;

      await ctx.prisma.menu.create({
        data: {
          storeId,
          active: false,
          ...input,
        },
      });
    }),

  edit: privateProcedure
    .input(
      z.object({
        id: z.number(),
        active: z.boolean(),
        nameEn: z.string().nullish(),
        nameEs: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const storeId = ctx.store.id;

      await ctx.prisma.menu.update({
        where: { id: input.id },
        data: {
          storeId,
          ...input,
        },
      });
    }),

  createSection: privateProcedure
    .input(
      z.object({
        menuId: z.number(),
        order: z.number(),
        slug: z.string(),
        itemIds: z.string().nullish(),
        img: z.string().nullish(),
        nameEn: z.string().nullish(),
        nameEs: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.menuSections.create({
        data: {
          ...input,
        },
      });
    }),

  editSection: privateProcedure
    .input(
      z.object({
        id: z.number(),
        menuId: z.number(),
        order: z.number(),
        itemIds: z.string().nullish(),
        img: z.string().nullish(),
        nameEn: z.string().nullish(),
        nameEs: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.menuSections.update({
        where: { id: input.id },
        data: {
          ...input,
        },
      });
    }),
  deleteSection: privateProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.menuSections.delete({
        where: { id: input.id },
      });
    }),
});
