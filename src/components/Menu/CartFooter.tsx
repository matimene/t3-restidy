import {
  Button,
  Input,
  LoadingOverlay,
  Modal,
  createStyles,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type Item } from "@prisma/client";
import { api } from "~/utils/api";

const useStyles = createStyles((theme) => ({
  container: {
    height: rem(48),
    backgroundColor: theme.colors.yellow[6],
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
    fontSize: theme.fontSizes.lg,
    textTransform: "uppercase",
    fontWeight: "bold",
    position: "fixed",
    bottom: 0,
  },
  itemContainer: {
    paddingBottom: rem(12),
    textTransform: "uppercase",
    fontSize: 16,
  },
  itemInnerContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
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

export const CartFooter = ({
  items,
  cartItems,
  onEditCartItem,
  token,
  onCleanCart,
}: {
  items: Item[];
  cartItems: CartItem[];
  onEditCartItem: (item: CartItem) => void;
  token?: string;
  onCleanCart: () => void;
}) => {
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);
  const { mutate: createOrder, isLoading } = api.orders.create.useMutation({
    onSuccess: () => {
      onCleanCart();
      close();
      window.alert("order created");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError;
      console.log(errorMessage);
    },
  });

  const handleShowModal = () => {
    if (cartItems.length) open();
  };
  const handlePlaceOrder = () => {
    if (token) {
      createOrder({
        items: cartItems,
        token,
      });
    }
  };

  return (
    <>
      <div className={classes.container} onClick={handleShowModal}>
        {cartItems?.length ? `Continue (${cartItems.length})` : "Cart empty"}
      </div>
      <Modal
        padding="6px"
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
      >
        <LoadingOverlay visible={isLoading} />
        {cartItems.map((cItem) => {
          const item = items.find((i) => i.id === cItem.itemId);
          return (
            <div key={cItem.itemId} className={classes.itemContainer}>
              <div className={classes.itemInnerContainer}>
                <div>{item?.titleEn}</div>
                <div>{`€${item?.price ?? 0} x ${cItem.qty}`}</div>
              </div>
              <Input
                placeholder="Notes:"
                onChange={({ target }) =>
                  onEditCartItem({ ...cItem, notes: target.value })
                }
              />
            </div>
          );
        })}
        <div className={classes.actionsContainer}>
          <Button
            styles={(theme) => ({
              label: {
                color: theme.colors.gray[9],
              },
            })}
            color="yellow"
            size="xs"
            onClick={close}
          >
            Cancel
          </Button>
          <Button variant="outline" color="yellow" onClick={handlePlaceOrder}>
            Place order
          </Button>
        </div>
      </Modal>
    </>
  );
};
