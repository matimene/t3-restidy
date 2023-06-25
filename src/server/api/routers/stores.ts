import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const storesRouter = createTRPCRouter({
  getStore: publicProcedure.query(({ ctx }) => {
    if (!ctx.store)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Store not found",
      });
    return ctx.store;
  }),

  getConfig: publicProcedure.query(async ({ ctx }) => {
    const storeId = ctx.store?.id;

    const config = await ctx.prisma.storeConfig.findFirst({
      where: { storeId },
    });
    return config;
  }),

  editConfig: privateProcedure
    .input(
      z.object({
        id: z.number(),
        bgImgs: z.string(),
        defaultLang: z.string(),
        logo: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.storeConfig.update({
        where: {
          id: input.id,
        },
        data: {
          bgImgs: input.bgImgs,
          logo: input.logo,
          defaultLang: input.defaultLang,
        },
      });
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
});
