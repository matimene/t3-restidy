import { z } from "zod";

export const OrderStatuses = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  CANCELED: "CANCELED",
  COMPLETED: "COMPLETED",
};

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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
        skip: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.order.findMany({
        take: 18,
        skip: input.skip ?? 0,
        orderBy: {
          [input.sortBy]: "desc",
        },
        where: {
          tableId: input.selectedTableId
            ? parseFloat(input.selectedTableId)
            : undefined,
          status: {
            in: input.validStatus,
          },
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
  getOrder: publicProcedure
    .input(
      z.object({
        orderId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.order.findUniqueOrThrow({
        where: {
          id: input.orderId,
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

  createOrderItem: privateProcedure
    .input(
      z.object({
        orderId: z.number(),
        itemId: z.number(),
        qty: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const storeItem = await ctx.prisma.item.findUniqueOrThrow({
        where: {
          id: input.itemId,
        },
      });

      await ctx.prisma.orderItem.create({
        data: {
          orderId: input.orderId,
          itemId: input.itemId,
          qty: input.qty,
          price: storeItem.price,
        },
      });
    }),

  editOrderItemDeleted: privateProcedure
    .input(
      z.object({
        id: z.number(),
        deleted: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.orderItem.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });

      await ctx.prisma.orderItem.update({
        where: {
          id: input.id,
        },
        data: {
          deleted: input.deleted,
        },
      });
    }),

  editOrderStatus: privateProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.order.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });

      await ctx.prisma.order.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });
    }),
});
