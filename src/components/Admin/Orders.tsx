import {
  Badge,
  Button,
  Card,
  Group,
  Text,
  createStyles,
  rem,
} from "@mantine/core";
import { ArrowDown } from "tabler-icons-react";
import { type RouterOutputs, api } from "~/utils/api";
import { LoadingSpinner } from "../Primary/LoadingSpinner";

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
}));

export const Orders = () => {
  const { classes } = useStyles();
  const { data: orders, isLoading } = api.orders.getAll.useQuery();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className={classes.container}>
      {orders?.map((order) => (
        <OrderItem key={order.id} order={order} />
      ))}
    </div>
  );
};
