import { createStyles, rem, Image, Modal, Button, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type Item } from "@prisma/client";
import { useState } from "react";
import { getProductLocaleProps } from "~/utils/helpers";
import { CartFooter } from "./CartFooter";
import { Loading } from "../Primary/LoadingSpinner";
import styled from "@emotion/styled";
import NumericInput from "../Primary/NumericInput";

const useStyles = createStyles((theme) => ({
  container: {
    paddingBottom: rem(48 + 12),
    flex: 1,
  },
  itemsContainer: {
    maxWidth: rem(1024),
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: theme.radius.sm,
  },
  itemWrapper: {
    padding: theme.spacing.xs,
    height: "min-content",
    width: "100%",
    display: "flex",
    alignItems: "center",
    borderBottom: `1px dashed ${theme.colors.gray[7]};`,
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
  actionsitemsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.xxs,
  },
  price: {
    fontSize: 24,
    color: theme.colors.yellow[6],
    textAlign: "right",
  },
}));

const StyledTabs = styled(Tabs)`
  /* Hide scrollbar for Chrome, Safari and Opera */
  & .mantine-Tabs-tabsList::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  & .mantine-Tabs-tabsList {
    -ms-overflow-style: none;
    scrollbar-width: none;
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
      <div className={classes.itemWrapper}>
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
        <div className={classes.dataWrapper}>
          {title && <div className={classes.title}>{title}</div>}
          {description && <div className={classes.desc}>{description}</div>}
          {item?.price && (
            <div className={classes.actionsitemsContainer}>
              <div className={classes.price}>€{item?.price}</div>
              {onAddToCart && (
                <div>
                  {!!itemInCart ? (
                    <NumericInput
                      value={itemInCart.qty}
                      setValue={(qty) => handleEditCart({ qty })}
                    />
                  ) : (
                    <Button
                      variant="outline"
                      color="yellow"
                      onClick={() => handleEditCart({ qty: 1 })}
                    >
                      Add to cart
                    </Button>
                  )}
                </div>
              )}
            </div>
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

type ParsedCategory = {
  name: string;
  code: string;
};
type CartItem = {
  itemId: number;
  qty: number;
  notes?: string;
};
type ItemsListProps = {
  items: Item[];
  categories: ParsedCategory[];
  isLoading: boolean;
  noActions?: boolean;
};

export const ItemsList = ({
  items,
  categories,
  isLoading,
  noActions,
}: ItemsListProps) => {
  const { classes } = useStyles();
  const [activeTabCode, setActiveTabCode] = useState<string>(
    categories[0]?.code as string
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleEditCartItem = (updatedCartItem: CartItem) => {
    const { itemId, qty: newQty } = updatedCartItem;

    setCartItems((curr) => {
      if (newQty === 0)
        return cartItems.filter((item) => item.itemId !== itemId);

      const isInCart = !!curr.find((item) => item.itemId === itemId);
      const updatedCart = isInCart
        ? cartItems.map((item) =>
            item.itemId === itemId ? updatedCartItem : item
          )
        : [...curr, updatedCartItem];
      return updatedCart;
    });
  };

  if (isLoading) return <Loading />;

  const selectedItems = items?.filter((item) => {
    return item.categoryCodes?.split(";").indexOf(activeTabCode) !== -1;
  });

  return (
    <div className={classes.container}>
      <StyledTabs
        color="yellow"
        loop
        value={activeTabCode}
        onTabChange={(v) => v && setActiveTabCode(v)}
        styles={{
          tabsList: {
            flexWrap: "nowrap",
            overflowX: "scroll",
            minHeight: rem(44),
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          },
          tab: { maxHeight: rem(42) },
        }}
      >
        <Tabs.List position="center">
          {categories?.map((cat) => (
            <Tabs.Tab key={cat.code} value={cat.code}>
              {cat.name}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </StyledTabs>
      <div className={classes.itemsContainer}>
        {selectedItems?.map((item) => (
          <Product
            key={item.id}
            item={item}
            itemInCart={cartItems?.find((cItem) => cItem.itemId === item.id)}
            onAddToCart={noActions ? undefined : handleEditCartItem}
          />
        ))}
      </div>
      <CartFooter
        cartItems={cartItems}
        items={items}
        onEditCartItem={handleEditCartItem}
      />
    </div>
  );
};
