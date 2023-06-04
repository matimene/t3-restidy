import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const physicalTablesRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.physicalTable.findMany({
      orderBy: {
        ["active"]: "asc",
      },
    });
  }),
});
