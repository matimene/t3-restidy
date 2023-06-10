import {
  Button,
  Input,
  LoadingOverlay,
  Modal,
  createStyles,
  rem,
} from "@mantine/core";
import { type Item } from "@prisma/client";
import { api } from "~/utils/api";
import { Row } from "../Primary";
import { toast } from "react-hot-toast";

const useStyles = createStyles(() => ({
  itemContainer: {
    marginBottom: rem(12),
    fontSize: 16,
  },
  actionsContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: rem(24),
  },
}));

type CartItem = {
  itemId: number;
  qty: number;
  notes?: string;
};

const CartModal = ({
  items,
  cartItems,
  isOpen,
  token,
  onEditCartItem,
  onCleanCart,
  onClose,
}: {
  items: Item[];
  cartItems: CartItem[];
  isOpen: boolean;
  token?: string;
  onEditCartItem: (item: CartItem) => void;
  onCleanCart: () => void;
  onClose: () => void;
}) => {
  const { classes } = useStyles();
  const totalPrice = cartItems.reduce((acc, cItem) => {
    const item = items.find((i) => i.id === cItem.itemId) as Item;
    return cItem.qty * item.price + acc;
  }, 0);
  const { mutate: createOrder, isLoading } = api.orders.create.useMutation({
    onSuccess: () => {
      onClose();
      onCleanCart();
      toast.success(`We've got your order!`);
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError;
      console.log(errorMessage);
    },
  });

  const handlePlaceOrder = () => {
    if (token) {
      createOrder({
        items: cartItems,
        token,
      });
    }
  };

  return (
    <Modal
      padding="12px"
      opened={isOpen}
      onClose={onClose}
      withCloseButton={false}
      centered
    >
      <LoadingOverlay visible={isLoading} />
      {cartItems.map((cItem) => {
        const item = items.find((i) => i.id === cItem.itemId);
        return (
          <div key={cItem.itemId} className={classes.itemContainer}>
            <Row justify="space-between" marginBottom={6}>
              <div>{item?.titleEn?.toUpperCase()}</div>
              <div>{`€${item?.price ?? 0} x ${cItem.qty}`}</div>
            </Row>
            <Input
              placeholder="Notes:"
              onChange={({ target }) =>
                onEditCartItem({ ...cItem, notes: target.value })
              }
            />
          </div>
        );
      })}
      <Row justify="flex-end">{`TOTAL: ${totalPrice.toFixed(2)}`}</Row>
      <Row justify="space-between" align="center" marginTop={12}>
        <Button
          styles={(theme) => ({
            label: {
              color: theme.colors.gray[9],
              fontSize: 14,
              fontWeight: 700,
              textTransform: "uppercase",
            },
          })}
          color="yellow"
          size="xs"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button variant="outline" color="yellow" onClick={handlePlaceOrder}>
          Place order
        </Button>
      </Row>
    </Modal>
  );
};

export default CartModal;
