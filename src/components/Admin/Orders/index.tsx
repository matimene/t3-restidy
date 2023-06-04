import { MultiSelect, createStyles, Select, rem, Button } from "@mantine/core";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../../Primary/LoadingSpinner";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import ItemOrder from "./ItemOrder";
import ModalEditOrder from "./ModalEditOrder";
import {
  buildTableOptions,
  ORDERS_SORTBY_OPTIONS,
  ORDERS_STATUS_OPTIONS,
} from "./helper";
import { Reload } from "tabler-icons-react";
import { Row } from "~/components/Primary";

const useStyles = createStyles((theme) => ({
  container: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    padding: theme.spacing.xs,
    gap: rem(12),
  },
  filterContainer: {
    display: "flex",
    gap: rem(12),
    alignItems: "center",
    flexDirection: "column",
  },
}));

const Orders = () => {
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);
  const [validStatus, setValidStatus] = useState(
    ORDERS_STATUS_OPTIONS.map((i) => i.value)
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
  const TABLES_OPTIONS = buildTableOptions(tables);

  const handleEditOrderId = (id: number) => {
    setEditOrderId(id);
    open();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className={classes.filterContainer}>
        <Row align="flex-end" gap={12}>
          <Select
            label="Show only table"
            placeholder="Pick one"
            data={TABLES_OPTIONS}
            clearable
            value={selectedTableId}
            onChange={(value: string) => setSelectedTableId(value)}
          />
          <Select
            label="Sort by"
            data={ORDERS_SORTBY_OPTIONS}
            value={sortBy}
            onChange={(value: string) => setSortBy(value)}
          />
          <Button
            disabled={isLoading}
            onClick={() => void ctx.orders.getAll.invalidate()}
          >
            <Reload size={24} strokeWidth={1.5} color={"white"} />
          </Button>
        </Row>
        <div style={{ width: rem(504) }}>
          <MultiSelect
            value={validStatus}
            onChange={setValidStatus}
            data={ORDERS_STATUS_OPTIONS}
            placeholder="Orders statuses"
          />
        </div>
      </div>
      <div className={classes.container}>
        {orders?.map((order) => (
          <ItemOrder
            key={order.id}
            order={order}
            onEdit={() => handleEditOrderId(order.id)}
          />
        ))}
      </div>
      {editOrderId && (
        <ModalEditOrder isOpen={opened} onClose={close} orderId={editOrderId} />
      )}
    </>
  );
};

export default Orders;
