import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const storesRouter = createTRPCRouter({
  getStore: publicProcedure.query(({ ctx }) => {
    return { store: ctx.store };
  }),

  loadDataByCode: publicProcedure.query(async ({ ctx }) => {
    const storeId = ctx.store?.id;

    const menus = await ctx.prisma.menu.findMany({
      where: { storeId },
    });
    // if (!menus.length)
    //   throw new TRPCError({
    //     code: "INTERNAL_SERVER_ERROR",
    //     message: "Menus not found",
    //   });

    const categories = (
      await ctx.prisma.category.findMany({
        where: { storeId },
      })
    ).sort((a, b) => a.order - b.order);

    if (!categories.length)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Categories not found",
      });

    return { menus, categories, store: ctx.store };
  }),

  loadMenusAndCats: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ ctx }) => {
      const storeId = ctx.store?.id;
      if (!storeId)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Store not found",
        });

      const menus = await ctx.prisma.menu.findMany({
        where: { storeId },
      });

      const categories = await ctx.prisma.category.findMany({
        where: { storeId },
      });

      // if (!menus.length)
      //   throw new TRPCError({
      //     code: "INTERNAL_SERVER_ERROR",
      //     message: "Menus not found",
      //   });

      return { menus, categories };
    }),
});
