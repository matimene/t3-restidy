import { Input, Modal, createStyles, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type Item } from "@prisma/client";

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
}: {
  items: Item[];
  cartItems: CartItem[];
  onEditCartItem: (item: CartItem) => void;
}) => {
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);

  const handleShowModal = () => {
    if (!items.length) return;
    open();
  };

  return (
    <>
      <div className={classes.container} onClick={handleShowModal}>
        {cartItems?.length ? `Place order (${cartItems.length})` : "Cart empty"}
      </div>
      <Modal
        padding="6px"
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
      >
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
      </Modal>
    </>
  );
};
