import {
  Badge,
  Card,
  MultiSelect,
  Text,
  createStyles,
  Select,
  rem,
} from "@mantine/core";
import { ArrowDown } from "tabler-icons-react";
import { type RouterOutputs, api } from "~/utils/api";
import { LoadingSpinner } from "../Primary/LoadingSpinner";
import { useState } from "react";

type OrdersWithItems = RouterOutputs["orders"]["getAll"][number];

const OrderItem = ({ order }: { order: OrdersWithItems }) => {
  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="md"
      withBorder
      style={{ minWidth: rem(180), maxWidth: "40%", flexGrow: 1 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text weight={500}>{order?.table?.pTable?.name}</Text>
        <Badge color="pink" variant="light" style={{ cursor: "pointer" }}>
          {order.status}
          <ArrowDown size={12} strokeWidth={3} color={"pink"} />
        </Badge>
      </div>

      {order?.table?.identifier && (
        <Text size="sm" weight={500}>
          {order?.table?.identifier}
        </Text>
      )}

      <Text size="md" color="dimmed" mt={rem(6)}>
        {order?.items?.map((oItem) => {
          return (
            <div key={oItem.id}>
              <div>{`${oItem.qty} x ${
                oItem?.item?.titleEn ?? oItem?.item.sku
              }`}</div>
              {oItem?.notes && (
                <Text size="xs">{`Notes: ${oItem?.notes ?? ""}`}</Text>
              )}
            </div>
          );
        })}
      </Text>
    </Card>
  );
};

const useStyles = createStyles((theme) => ({
  container: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    padding: theme.spacing.xs,
    gap: rem(12),
  },
  filterContainer: {
    flex: 1,
    width: "100%",
    display: "flex",
    padding: theme.spacing.xs,
    gap: rem(12),
    justifyContent: "center",
  },
}));

const ORDERS_STATUS = [
  { value: "PENDING", label: "Pending" },
  { value: "CANCELED", label: "Canceled" },
  { value: "COMPLETED", label: "Completed" },
];
const ORDERS_SORT_BY = [
  {
    value: "updatedAt",
    label: "Updated at",
  },
  {
    value: "createdAt",
    label: "Created at",
  },
];

export const Orders = () => {
  const { classes } = useStyles();
  const [validStatus, setValidStatus] = useState(
    ORDERS_STATUS.map((i) => i.value)
  );
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const { data: tables } = api.tables.getAll.useQuery();
  const { data: orders, isLoading } = api.orders.getAll.useQuery({
    selectedTableId,
    validStatus,
    sortBy,
  });

  const TABLES_ARR = tables
    ? tables?.map((table) => ({
        value: table.id.toString(),
        label: table.pTable.name,
      }))
    : [];

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className={classes.filterContainer}>
        <MultiSelect
          value={validStatus}
          onChange={setValidStatus}
          data={ORDERS_STATUS}
          label="Show only status"
          placeholder="Orders statuses"
        />
        <Select
          label="Show only table"
          placeholder="Pick one"
          data={TABLES_ARR}
          clearable
          value={selectedTableId}
          onChange={(value: string) => setSelectedTableId(value)}
        />
        <Select
          label="Sort by"
          data={ORDERS_SORT_BY}
          value={sortBy}
          onChange={(value: string) => setSortBy(value)}
        />
      </div>
      <div className={classes.container}>
        {orders?.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </div>
    </>
  );
};
