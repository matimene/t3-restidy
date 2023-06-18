import {
  createStyles,
  rem,
  Image,
  Modal,
  Button,
  NumberInput,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type Item } from "@prisma/client";
import { getProductLocaleProps } from "~/utils/helpers";
import useMobileDetection from "~/utils/hooks/useMobileDetection";
import { Row } from "~/components/Primary";
import NumericInput from "~/components/Primary/NumericInput";
import { type CartItem } from "~/utils/zustand-store";
import useCart from "~/utils/hooks/useCart";

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    borderBottom: `1px dashed ${theme.colors.gray[7]};`,
    paddingBottom: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
    width: "100%",
    height: "100%",
    minWidth: rem(350),

    // Simplify media query writing with theme functions
    [theme.fn.smallerThan("md")]: {
      height: "min-content",
    },
  },
  imgWrapper: {
    width: rem(120),
    marginRight: theme.spacing.xs,
  },
}));

const Product = ({
  item,
  itemInCart,
}: {
  item: Item;
  itemInCart?: CartItem;
}) => {
  const { isMobile } = useMobileDetection();
  const { classes } = useStyles();
  const { handleEditCart } = useCart(item.id);
  const [opened, { open, close }] = useDisclosure(false);

  const { title, description } = getProductLocaleProps<Item>({
    item,
    keys: ["title", "description"],
  });

  return (
    <>
      <div className={classes.container}>
        {item.img && (
          <div className={classes.imgWrapper}>
            <Image
              styles={{
                image: {
                  height: "100%",
                  minHeight: rem(120),
                },
              }}
              miw={100}
              radius="md"
              fit="cover"
              src={item.img}
              alt={item.sku}
              onClick={open}
            />
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Row align="center" justify="space-between" mb={6}>
            <Text transform="uppercase" weight={700} size={20} color="white">
              {title}
            </Text>
            <Text weight={700} size={20} color="white">
              {item?.price}€
            </Text>
          </Row>
          <Text size={16}>{description}</Text>
          <Row justify="flex-end" align="center" style={{ minHeight: 36 }}>
            {!!itemInCart ? (
              isMobile() ? (
                <NumericInput
                  value={itemInCart.quantity}
                  setValue={(quantity) => handleEditCart({ quantity })}
                />
              ) : (
                <NumberInput
                  value={itemInCart.quantity}
                  onChange={(quantity: number) => handleEditCart({ quantity })}
                  placeholder="Quantity"
                  min={1}
                  style={{ maxWidth: 100 }}
                />
              )
            ) : (
              <Button
                variant="gradient"
                gradient={{ from: "yellow.4", to: "yellow.8", deg: 90 }}
                compact
                onClick={() => handleEditCart({ quantity: 1 })}
              >
                +
              </Button>
            )}
          </Row>
        </div>
      </div>
      <Modal
        padding="6px"
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
      >
        <Image
          width="100%"
          radius="md"
          fit="cover"
          src={item.img}
          alt={item.sku}
          styles={{ image: { minHeight: 300 } }}
          data-autofocus
        />
        <NumericInput
          showDecrement={false}
          value={itemInCart?.quantity || 0}
          setValue={(quantity) => handleEditCart({ quantity })}
          style={{ position: "absolute", bottom: 12, right: 12 }}
          mainInputStyle={{ backgroundColor: "#000000D9" }}
        />
      </Modal>
    </>
  );
};

export default Product;
