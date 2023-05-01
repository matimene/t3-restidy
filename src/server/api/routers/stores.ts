import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const storesRouter = createTRPCRouter({
  loadDataByCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ ctx, input }) => {
      const store = await ctx.prisma.store.findUnique({
        where: { code: input.code },
      });

      if (!store)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Store not found",
        });

      const menus = await ctx.prisma.menu.findMany({
        where: { storeId: store.id },
      });
      // if (!menus.length)
      //   throw new TRPCError({
      //     code: "INTERNAL_SERVER_ERROR",
      //     message: "Menus not found",
      //   });

      const categories = await ctx.prisma.category.findMany({
        where: { storeId: store.id },
      });
      if (!categories.length)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Categories not found",
        });

      return { store, menus, categories };
    }),
  loadMenusAndCats: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ ctx, input }) => {
      const store = await ctx.prisma.store.findUnique({
        where: { code: input.code },
      });

      if (!store)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Store not found",
        });

      const menus = await ctx.prisma.menu.findMany({
        where: { storeId: store.id },
      });

      const categories = await ctx.prisma.category.findMany({
        where: { storeId: store.id },
      });
      // if (!menus.length)
      //   throw new TRPCError({
      //     code: "INTERNAL_SERVER_ERROR",
      //     message: "Menus not found",
      //   });

      return { store, menus, categories };
    }),
});
