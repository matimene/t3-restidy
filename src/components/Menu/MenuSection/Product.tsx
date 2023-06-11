import {
  createStyles,
  rem,
  Image,
  Modal,
  Button,
  NumberInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type Item } from "@prisma/client";
import { getProductLocaleProps } from "~/utils/helpers";
import styled from "@emotion/styled";
import useMobileDetection from "~/utils/hooks/useMobileDetection";
import { type CartItem } from "~/components/Menu2/helper";
import { Row } from "~/components/Primary";
import NumericInput from "~/components/Primary/NumericInput";

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    borderBottom: `1px dashed ${theme.colors.gray[7]};`,
    padding: theme.spacing.xs,
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
  dataWrapper: {
    height: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: "white",
  },
  desc: {},
  price: {
    fontSize: 24,
    color: theme.colors.yellow[6],
    textAlign: "right",
  },
}));

const ActionsContainer = styled.div`
  maxheight: ${rem(36)};
  display: flex;
  justifycontent: center;
  alignitems: center;

  .mantine-Group-root {
    flex-wrap: nowrap;
  }
`;

const Product = ({
  item,
  onAddToCart,
  itemInCart,
}: {
  itemInCart: CartItem | undefined;
  item: Item;
  onAddToCart?: (cartItem: any) => void;
}) => {
  const { isMobile } = useMobileDetection();
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);

  const { title, description } = getProductLocaleProps<Item>({
    item,
    keys: ["title", "description"],
  });

  const handleEditCart = ({ qty, notes }: { qty: number; notes?: string }) => {
    const cartItem = {
      itemId: item.id,
      qty,
      notes,
    };
    onAddToCart && onAddToCart(cartItem);
  };

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
              miw={120}
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
          }}
        >
          <div>
            {title && <div className={classes.title}>{title}</div>}
            {description && <div className={classes.desc}>{description}</div>}
          </div>
          {item?.price && (
            <Row justify="space-between" align="center" marginTop={12}>
              <div className={classes.price}>€{item?.price}</div>
              {onAddToCart && (
                <ActionsContainer>
                  {!!itemInCart ? (
                    isMobile() ? (
                      <NumericInput
                        value={itemInCart.qty}
                        setValue={(qty) => handleEditCart({ qty })}
                      />
                    ) : (
                      <NumberInput
                        value={itemInCart.qty}
                        onChange={(qty: number) => handleEditCart({ qty })}
                        placeholder="Quantity"
                        min={1}
                        style={{ maxWidth: 100 }}
                      />
                    )
                  ) : (
                    <Button
                      variant="outline"
                      color="yellow"
                      onClick={() => handleEditCart({ qty: 1 })}
                    >
                      Add to cart
                    </Button>
                  )}
                </ActionsContainer>
              )}
            </Row>
          )}
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
        />
      </Modal>
    </>
  );
};

export default Product;
