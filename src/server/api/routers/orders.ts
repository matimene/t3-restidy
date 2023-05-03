import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const OrderItemModel = z.object({
  storeId: z.number(),
  itemId: z.number(),
  qty: z.number(),
  notes: z.string(),
});

export const ordersRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.order.findMany();
  }),

  create: publicProcedure
    .input(
      z.object({
        code: z.string().min(5),
        items: z.array(OrderItemModel),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const storeId = ctx.store?.id;
      if (!storeId)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Not found",
        });

      const table = await ctx.prisma.table.findUniqueOrThrow({
        where: { token: input.code },
      });

      const order = await ctx.prisma.order.create({
        data: {
          storeId,
          tableId: table.id,
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
