import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const OrderItemModel = z.object({
  itemId: z.number(),
  qty: z.number(),
  notes: z.string().optional(),
});

export const ordersRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.order.findMany();
  }),

  create: publicProcedure
    .input(
      z.object({
        token: z.string().min(5),
        items: z.array(OrderItemModel),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const storeId = ctx.store?.id as number;

      const table = await ctx.prisma.table.findFirstOrThrow({
        where: {
          token: input.token,
          storeId,
        },
      });

      const order = await ctx.prisma.order.create({
        data: {
          storeId,
          tableId: table?.id,
        },
      });

      await Promise.all(
        input.items.map(async (item) => {
          const storeItem = await ctx.prisma.item.findUniqueOrThrow({
            where: {
              id: item.itemId,
            },
          });

          await ctx.prisma.orderItem.create({
            data: {
              orderId: order.id,
              itemId: item.itemId,
              qty: item.qty,
              notes: item.notes,
              price: storeItem.price,
            },
          });
        })
      );
    }),
});
