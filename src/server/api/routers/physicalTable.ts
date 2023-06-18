import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const physicalTablesRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.physicalTable.findMany({
      orderBy: {
        ["name"]: "asc",
      },
    });
  }),

  create: privateProcedure
    .input(
      z.object({
        name: z.string(),
        active: z.boolean().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const storeId = ctx.store.id;

      await ctx.prisma.physicalTable.create({
        data: {
          storeId,
          name: input.name,
          active: input.active ?? true,
        },
      });
    }),
  edit: privateProcedure
    .input(
      z.object({
        id: z.number(),
        active: z.boolean(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.physicalTable.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });

      await ctx.prisma.physicalTable.update({
        where: {
          id: input.id,
        },
        data: {
          active: input.active,
          name: input.name,
        },
      });
    }),
});
