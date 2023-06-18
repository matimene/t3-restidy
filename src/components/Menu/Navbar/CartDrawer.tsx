import {
  Drawer,
  Modal,
  Image,
  Text,
  useMantineTheme,
  Button,
  TextInput,
} from "@mantine/core";
import useStore, { type CartItem } from "~/utils/zustand-store";
import { Centered, Row } from "~/components/Primary";
import { type Item } from "@prisma/client";
import { api } from "~/utils/api";
import NumericInput from "~/components/Primary/NumericInput";
import useCart from "~/utils/hooks/useCart";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "~/components/Primary/LoadingSpinner";

const CartProduct = ({
  cartItem,
  item,
}: {
  cartItem: CartItem;
  item: Item;
}) => {
  const { handleEditCart } = useCart(item.id);
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  return (
    <>
      <Row align="center" justify="space-between">
        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          {item.img && (
            <Image
              styles={{
                image: {
                  width: "40px !important",
                  height: "40px !important",
                },
                root: { width: "min-content !important", marginRight: 6 },
              }}
              radius="md"
              fit="cover"
              src={item.img}
              alt={item.sku}
              onClick={open}
            />
          )}
          <Text>{`${item?.titleEn ?? ""} (${item?.price.toFixed(2)}€)`}</Text>
        </div>
        <NumericInput
          value={cartItem.quantity}
          setValue={(quantity) => handleEditCart({ quantity })}
        />
      </Row>
      <TextInput
        mt={-6}
        mb={6}
        placeholder="Notes"
        value={cartItem?.notes}
        onChange={({ target }) => handleEditCart({ notes: target?.value })}
      />
      <Modal
        fullScreen
        padding="6px"
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
        onClick={close}
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.yellow[9]
              : theme.colors.yellow[2],
          opacity: 0.15,
          blur: 3,
        }}
        transitionProps={{
          transition: "fade",
          duration: 150,
          timingFunction: "linear",
        }}
        styles={{
          content: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000000CC",
          },
        }}
      >
        <Image
          width="100%"
          radius="md"
          fit="cover"
          src={item.img}
          alt={item.sku}
          styles={{ image: { minHeight: 300 } }}
        />
      </Modal>
    </>
  );
};

const CartDrawer = ({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const { cart, dispatch } = useStore();
  const { data: items, isLoading } = api.items.getByIds.useQuery({
    ids: cart.map((cartItem) => cartItem.itemId).join(";"),
  });
  const cartTotal = cart
    .reduce((tally, item) => {
      if (!items) return tally;
      const product = items.find((p) => p.id === item.itemId);
      if (!product) return tally;
      return tally + product.price * item.quantity;
    }, 0)
    .toFixed(2);

  const { mutate: createOrder } = api.orders.create.useMutation({
    onSuccess: () => {
      dispatch.cleanCart();
      onClose();
      toast.success("Order received successfully!", {
        duration: 5000,
      });
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError;
      window.alert(errorMessage);
    },
  });

  const handlePlaceOrder = () =>
    createOrder({
      items: cart,
      token: router.query.token as string,
    });

  return (
    <Drawer.Root opened={opened} onClose={onClose}>
      <Drawer.Overlay />
      <Drawer.Content style={{ display: "flex", flexDirection: "column" }}>
        <Drawer.Header>
          <Drawer.Title>
            <Text transform="uppercase" size={24} align="center">
              My cart
            </Text>
          </Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            position: "relative",
            flex: 1,
          }}
        >
          {!isLoading && !cart.length ? (
            <div
              style={{
                height: "100%",
                marginTop: "100%",
                textAlign: "center",
              }}
            >
              <Button
                color="yellow.6"
                variant="light"
                onClick={onClose}
                style={{ textTransform: "uppercase" }}
              >
                Add products to continue
              </Button>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  flex: 1,
                }}
              >
                {!isLoading ? (
                  cart.map((cartItem) => (
                    <CartProduct
                      key={cartItem?.itemId}
                      cartItem={cartItem}
                      item={
                        items?.find(
                          (product) => product.id === cartItem.itemId
                        ) as Item
                      }
                    />
                  ))
                ) : (
                  <LoadingSpinner />
                )}
              </div>
              <div>
                <Text align="center" mb={12} mt={12}>
                  Total: {cartTotal}€
                </Text>
                <Button
                  fullWidth
                  color="yellow.7"
                  style={{ fontSize: 18 }}
                  onClick={handlePlaceOrder}
                >
                  Place order
                </Button>
              </div>
            </>
          )}
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
};

export default CartDrawer;
