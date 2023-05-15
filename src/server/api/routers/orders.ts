import { z } from "zod";

export const OrderStatuses = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  CANCELED: "CANCELED",
  COMPLETED: "COMPLETED",
};

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const NewOrderItem = z.object({
  itemId: z.number(),
  qty: z.number(),
  notes: z.string().optional(),
});

export const ordersRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        selectedTableId: z.string(),
        validStatus: z.array(z.string()),
        sortBy: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.order.findMany({
        where: {
          tableId: input.selectedTableId
            ? parseFloat(input.selectedTableId)
            : undefined,
          status: {
            in: input.validStatus,
          },
        },
        orderBy: {
          [input.sortBy]: "desc",
        },
        include: {
          items: {
            include: {
              item: {
                select: {
                  titleEn: true,
                  titleEs: true,
                  sku: true,
                },
              },
            },
          },
          table: {
            include: {
              pTable: true,
            },
          },
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        token: z.string().min(5),
        items: z.array(NewOrderItem),
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
