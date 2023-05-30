import { USER_TYPES } from "prisma/types";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    let users = await ctx.prisma.user.findMany({
      where: {
        OR: [
          { role: { not: USER_TYPES.GOD } },
          { role: { not: USER_TYPES.SUPERADMIN } },
        ],
      },
    });

    if (
      ctx.user.role !== USER_TYPES.GOD ||
      ctx.user.role !== USER_TYPES.SUPERADMIN
    ) {
      users = users.filter((user) =>
        user.storeIds.split(";").includes(ctx.store.id.toString())
      );
    }
    return users;
  }),

  // create: privateProcedure
  //   .input(
  //     z.object({
  //       order: z.number(),
  //       img: z.string().optional(),
  //       nameEn: z.string().optional(),
  //       nameEs: z.string().optional(),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const storeId = ctx.store?.id;

  //     await ctx.prisma.menu.create({
  //       data: {
  //         storeId,
  //         active: false,
  //         ...input,
  //       },
  //     });
  //   }),

  editUser: privateProcedure
    .input(
      z.object({
        name: z.string(),
        scopes: z.string(),
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          scopes: input.scopes,
        },
      });
    }),
});
