import {
  Button,
  Grid,
  Input,
  LoadingOverlay,
  Modal,
  NumberInput,
  Select,
  Avatar,
  Group,
  Text,
} from "@mantine/core";
import { forwardRef, useId, useState } from "react";
import { ChevronDown, Trash, TrashOff } from "tabler-icons-react";
import { Row } from "~/components/Primary";
import { api } from "~/utils/api";
import { ORDERS_STATUS_OPTIONS } from "./helper";
import styled from "@emotion/styled";

const ItemContainer = styled.div<{ deleted: boolean }>`
  margin: 12px 0;
  opacity: ${(props) => (props.deleted ? 0.4 : 1)};
  line-height: 20px;
  position: relative;
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

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image?: string;
  label: string;
  description: string;
}

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => {
    return (
      <div ref={ref} {...others} style={{ maxWidth: 192, overflow: "hidden" }}>
        <Group>
          {image && <Avatar src={image} />}

          <div>
            <Text size="sm">{label}</Text>
            <Text
              size="xs"
              opacity={0.65}
              style={{
                maxWidth: 170,
                whiteSpace: "unset",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {description}
            </Text>
          </div>
        </Group>
      </div>
    );
  }
);

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

  const { data: order, isLoading: isLoadingOrder } =
    api.orders.getOrder.useQuery({
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
  const { mutate: editOrderItemDeleted, isLoading: isLoadingEditItemDeleted } =
    api.orders.editOrderItemDeleted.useMutation({
      onSuccess: () => {
        void ctx.orders.getAll.invalidate(); // TODO: do smt better here
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
      <LoadingOverlay
        visible={isLoadingOrder}
        overlayBlur={2}
        transitionDuration={500}
      />
      <Input.Wrapper id={id} label="Status" mx="auto">
        <Input
          id={id}
          component="select"
          rightSection={<ChevronDown size={14} color="white" />}
          onChange={({ target }) => handleEditStatus(target.value)}
        >
          {ORDERS_STATUS_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </Input>
      </Input.Wrapper>
      {order?.items?.map((item) => (
        <ItemContainer key={item.id} deleted={item.deleted}>
          <LoadingOverlay
            visible={isLoadingEditItemDeleted}
            overlayBlur={2}
            transitionDuration={500}
          />
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
        <Grid gutter="xs" style={{ alignItems: "flex-end", marginTop: 12 }}>
          <Grid.Col span={7}>
            <div>
              <Select
                label="New product"
                placeholder="Pick one"
                value={newItem?.itemId?.toString() ?? ""}
                itemComponent={SelectItem}
                data={
                  items?.map((item) => ({
                    value: item.id.toString(),
                    description: item?.titleEn ?? "",
                    label: item.sku,
                    // group: item?.category?.nameEn ?? "",
                  })) || []
                }
                searchable
                filter={(value: string, item) => {
                  if (
                    !value ||
                    item?.label
                      ?.toLowerCase()
                      .includes(value.toLowerCase().trim()) ||
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    item?.description
                      .toLowerCase()
                      .includes(value.toLowerCase().trim())
                  )
                    return true;
                  return false;
                }}
                onChange={(itemId) =>
                  setNewItem((curr) =>
                    curr ? { ...curr, itemId } : { itemId }
                  )
                }
              />
            </div>
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              value={newItem?.qty}
              placeholder="Quantity"
              label="Qty"
              min={1}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Button uppercase disabled={isLoading} onClick={handleAddNewItem}>
              Ok
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
