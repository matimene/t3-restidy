import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const itemsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          sortBy: z.string(),
          skip: z.number().optional(),
        })
        .optional()
        .default({ skip: 0, sortBy: "titleEn" })
    )
    .query(async ({ ctx, input }) => {
      const storeId = ctx.store?.id;
      const items = await ctx.prisma.item.findMany({
        take: 18,
        skip: input?.skip,
        orderBy: {
          [input?.sortBy]: "asc",
        },
        where: { storeId, active: true },
      });
      return items;
    }),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const item = await ctx.prisma.item.findUniqueOrThrow({
        where: { id: input.id },
      });
      return item;
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
      const storeId = ctx.store.id;

      await ctx.prisma.item.create({
        data: {
          storeId,
          active: true,
          ...input,
        },
      });
    }),

  edit: privateProcedure
    .input(
      z.object({
        id: z.number(),
        price: z.number(),
        sku: z.string(),
        img: z.string().nullish(),
        categoryCodes: z.string().nullish(),
        descriptionEn: z.string().nullish(),
        descriptionEs: z.string().nullish(),
        titleEn: z.string().nullish(),
        titleEs: z.string().nullish(),
        tagsEn: z.string().nullish(),
        tagsEs: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedProduct = await ctx.prisma.item.update({
        where: {
          id: input.id,
        },
        data: {
          price: input?.price,
          sku: input?.sku,
          img: input?.img,
          categoryCodes: input?.categoryCodes,
          descriptionEn: input?.descriptionEn,
          descriptionEs: input?.descriptionEs,
          titleEn: input?.titleEn,
          titleEs: input?.titleEs,
          tagsEn: input?.tagsEn,
          tagsEs: input?.tagsEs,
        },
      });

      return updatedProduct;
    }),
});
