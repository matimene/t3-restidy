import { type PhysicalTable } from "@prisma/client";

export const TABLES_SORT_BY = [
  {
    value: "updatedAt",
    label: "Updated at",
  },
  {
    value: "createdAt",
    label: "Created at",
  },
  {
    value: "open",
    label: "Open",
  },
];

export const buildTableOptions = (pTables?: PhysicalTable[]) =>
  pTables?.map((item) => ({
    value: item.id.toString(),
    label: item.name,
  })) || [];
