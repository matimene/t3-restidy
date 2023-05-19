import { Button, Grid, Input, Modal, NumberInput, Select } from "@mantine/core";
import { useId, useState } from "react";
import { ChevronDown, Trash, MoodHappy, TrashOff } from "tabler-icons-react";
import { Row } from "~/components/Primary";
import { api } from "~/utils/api";
import { ORDERS_STATUS } from "./helper";
import styled from "@emotion/styled";

const ItemContainer = styled.div<{ deleted: boolean }>`
  margin: 12px 0;
  opacity: ${(props) => (props.deleted ? 0.4 : 1)};
  line-height: 20px;
  & > div {
    text-decoration: ${(props) => (props.deleted ? "line-through" : "none")};
  }
  & > span {
    line-height: 12px;
    font-size: 12px;
    opacity: 0.7;
    text-transform: uppercase;
  }
`;

type NewOrderItem = {
  itemId?: string | null;
  qty?: number;
};

const ModalEditOrder = ({
  orderId,
  isOpen,
  onClose,
}: {
  orderId?: number;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const id = useId();
  const [newItem, setNewItem] = useState<NewOrderItem>();

  const ctx = api.useContext();
  const { data: order } = api.orders.getOrder.useQuery({
    orderId: orderId as number,
  });
  const { data: items } = api.items.getAll.useQuery();
  const { mutate: createOrderItem, isLoading } =
    api.orders.createOrderItem.useMutation({
      onSuccess: () => {
        setNewItem(undefined);
        void ctx.orders.getOrder.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError;
        window.alert(errorMessage);
      },
    });
  const { mutate: editOrderStatus } = api.orders.editOrderStatus.useMutation({
    onSuccess: () => {
      void ctx.orders.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError;
      window.alert(errorMessage);
    },
  });
  const { mutate: editOrderItemDeleted } =
    api.orders.editOrderItemDeleted.useMutation({
      onSuccess: () => {
        void ctx.orders.getAll.invalidate();
        void ctx.orders.getOrder.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError;
        window.alert(errorMessage);
      },
    });

  const handleEditStatus = (status: string) => {
    if (!orderId) return;

    editOrderStatus({
      id: orderId,
      status,
    });
  };
  const handleAddNewItem = () => {
    if (!newItem?.itemId || !newItem?.qty || !orderId) return;

    createOrderItem({
      itemId: parseFloat(newItem.itemId),
      orderId,
      qty: newItem.qty,
    });
  };
  const handleToggleOrderItemDel = (id: number, deleted: boolean) => {
    editOrderItemDeleted({
      id,
      deleted: !deleted,
    });
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit order" centered>
      <Input.Wrapper id={id} label="Status" mx="auto">
        <Input
          id={id}
          component="select"
          rightSection={<ChevronDown size={14} color="white" />}
          onChange={({ target }) => handleEditStatus(target.value)}
        >
          {ORDERS_STATUS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </Input>
      </Input.Wrapper>
      {order?.items?.map((item) => (
        <ItemContainer key={item.id} deleted={item.deleted}>
          <span>{item.item.sku}</span>
          <Row justify="space-between">
            {` ${item.item.titleEn ?? ""} x ${item.qty}`}
            <Button
              compact
              onClick={() => handleToggleOrderItemDel(item.id, item.deleted)}
            >
              {item.deleted ? <TrashOff size={20} /> : <Trash size={20} />}
            </Button>
          </Row>
        </ItemContainer>
      ))}
      {newItem && Object.keys(newItem) ? (
        <Grid style={{ alignItems: "flex-end", marginTop: 12 }}>
          <Grid.Col span={6}>
            <Select
              label="New product"
              placeholder="Pick one"
              value={newItem?.itemId?.toString() ?? ""}
              onChange={(itemId) =>
                setNewItem((curr) => (curr ? { ...curr, itemId } : { itemId }))
              }
              data={
                items?.map((item) => ({
                  value: item.id.toString(),
                  label: `${item?.titleEn ?? ""} (${item.sku})`,
                })) || []
              }
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              value={newItem?.qty}
              placeholder="Quantity"
              label="Qty"
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Button uppercase disabled={isLoading} onClick={handleAddNewItem}>
              Ok
              <MoodHappy size={24} />
            </Button>
          </Grid.Col>
        </Grid>
      ) : (
        <Row justify="center" marginTop={12}>
          <Button uppercase onClick={() => setNewItem({ qty: 1 })}>
            Add new item
          </Button>
        </Row>
      )}
    </Modal>
  );
};

export default ModalEditOrder;
