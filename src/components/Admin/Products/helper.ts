import { type Table } from "@prisma/client";
import { type RouterOutputs } from "~/utils/api";

type TableWithPtable = RouterOutputs["tables"]["getAll"][number];

export const ORDERS_STATUS = [
  { value: "PENDING", label: "Pending" },
  { value: "PREPARING", label: "Preparing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELED", label: "Canceled" },
];

export const ORDERS_SORT_BY = [
  {
    value: "updatedAt",
    label: "Updated at",
  },
  {
    value: "createdAt",
    label: "Created at",
  },
];

export const buildTableOptions = (tables?: TableWithPtable[]) =>
  tables
    ? tables?.map((table) => ({
        value: table.id.toString(),
        label: table.pTable.name,
      }))
    : [];
