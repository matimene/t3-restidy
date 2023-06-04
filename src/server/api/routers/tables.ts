import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { v4 as uuidv4 } from "uuid";

export const tablesRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          sortBy: z.string().optional(),
          skip: z.number().optional(),
        })
        .optional()
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.table.findMany({
        take: 18,
        skip: input?.skip ?? 0,
        orderBy: {
          [input?.sortBy ?? "updatedAt"]: "desc",
        },
        include: {
          pTable: true,
        },
      });
    }),

  create: privateProcedure
    .input(
      z.object({
        pTableId: z.number(),
        discount: z.number().optional().default(0.0),
        identifier: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const storeId = ctx.store.id;
      const token = uuidv4();

      await ctx.prisma.table.create({
        data: {
          pTableId: input.pTableId,
          discount: input.discount,
          identifier: input.identifier,
          storeId,
          token,
        },
      });
    }),
  editTableOpen: privateProcedure
    .input(
      z.object({
        id: z.number(),
        open: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.orderItem.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });

      await ctx.prisma.table.update({
        where: {
          id: input.id,
        },
        data: {
          open: input.open,
        },
      });
    }),
});
