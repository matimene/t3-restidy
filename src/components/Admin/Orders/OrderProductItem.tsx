import { Badge, Card, Text, rem } from "@mantine/core";
import { Edit } from "tabler-icons-react";
import { Row } from "~/components/Primary";
import { type RouterOutputs, api } from "~/utils/api";
type OrdersWithItems = RouterOutputs["orders"]["getAll"][number];

const OrderProductItem = ({
  order,
  onEdit,
}: {
  order: OrdersWithItems;
  onEdit: () => void;
}) => {
  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="md"
      withBorder
      style={{
        minWidth: rem(180),
        maxWidth: "40%",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1 }}>
        <Row justify="space-between">
          <Text weight={500}>{order?.table?.pTable?.name}</Text>
          <Badge color="pink" variant="light" style={{ cursor: "pointer" }}>
            {order.status}
          </Badge>
        </Row>

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
      </div>

      <Edit size={20} style={{ cursor: "pointer" }} onClick={onEdit} />
    </Card>
  );
};

export default OrderProductItem;
