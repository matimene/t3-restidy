import { MultiSelect, createStyles, Select, rem, Button } from "@mantine/core";
import { type RouterOutputs, api } from "~/utils/api";
import { LoadingSpinner } from "../../Primary/LoadingSpinner";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import OrderProductItem from "./OrderProductItem";
import ModalEditOrder from "./ModalEditOrder";
import { ORDERS_SORT_BY, ORDERS_STATUS } from "./helper";
import { Reload } from "tabler-icons-react";

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
    alignItems: "flex-end",
  },
}));

export const Orders = () => {
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);
  const [validStatus, setValidStatus] = useState(
    ORDERS_STATUS.map((i) => i.value)
  );
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [editOrderId, setEditOrderId] = useState<number>();

  const ctx = api.useContext();
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

  const handleEditOrderId = (id: number) => {
    setEditOrderId(id);
    open();
  };

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
        <Button onClick={() => void ctx.orders.getAll.invalidate()}>
          <Reload size={24} strokeWidth={2} color={"white"} />
        </Button>
      </div>
      <div className={classes.container}>
        {orders?.map((order) => (
          <OrderProductItem
            key={order.id}
            order={order}
            onEdit={() => handleEditOrderId(order.id)}
          />
        ))}
      </div>
      <ModalEditOrder isOpen={opened} onClose={close} orderId={editOrderId} />
    </>
  );
};
