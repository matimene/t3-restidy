import { ORDER_STATUS } from "prisma/types";
import { type RouterOutputs } from "~/utils/api";

type TableWithPtable = RouterOutputs["tables"]["getAll"][number];

export const ORDERS_STATUS_OPTIONS = [
  { value: ORDER_STATUS.PENDING, label: "Pending" },
  { value: ORDER_STATUS.PROCESSING, label: "Processing" },
  { value: ORDER_STATUS.COMPLETED, label: "Completed" },
  { value: ORDER_STATUS.CANCELED, label: "Canceled" },
];

export const ORDERS_SORTBY_OPTIONS = [
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
