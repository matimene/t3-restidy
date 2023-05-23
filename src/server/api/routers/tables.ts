import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { v4 as uuidv4 } from "uuid";

export const tablesRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.table.findMany({
      include: {
        pTable: true,
      },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        pTableId: z.number(),
        discount: z.number().optional().default(0.0),
        identifier: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const storeId = ctx.store?.id as number;
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
});
