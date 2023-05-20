import { createStyles, rem, Tabs, Grid, Button } from "@mantine/core";
import { type Item } from "@prisma/client";
import { useState } from "react";
import CartModal from "./CartModal";
import { LoadingSpinner } from "../Primary/LoadingSpinner";
import styled from "@emotion/styled";
import useMobileDetection from "~/utils/hooks/useMobileDetection";
import ItemItem from "./ItemItem";
import { type CartItem, type ParsedCategory } from "./helper";
import { ShoppingCart } from "tabler-icons-react";
import { useDisclosure } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
  container: {
    height: "100%",
  },
  itemsContainer: {
    maxWidth: rem(1280),
    width: "100%",
    display: "flex",
    flex: "1 1 auto",
    flexDirection: "column",
    justifyContent: "start",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: theme.radius.sm,
    // Simplify media query writing with theme functions
    [theme.fn.smallerThan("md")]: {
      paddingBottom: rem(48),
    },
  },
  mobileFooter: {
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
    opacity: 0.9,
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

type ItemsListProps = {
  items: Item[];
  categories: ParsedCategory[];
  isLoading: boolean;
  noActions?: boolean;
  token?: string;
};

export const ItemsList = ({
  token,
  items,
  categories,
  isLoading,
  noActions,
}: ItemsListProps) => {
  const { classes } = useStyles();
  const { isMobile } = useMobileDetection();
  const [cartOpen, { open: openCartModal, close: closeCartModal }] =
    useDisclosure(false);

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
  const handleOpenCart = () => {
    if (!cartItems.length) return;
    openCartModal();
  };

  if (isLoading) return <LoadingSpinner />;

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
          {!isMobile() && cartItems.length ? (
            <Button
              color="yellow"
              onClick={handleOpenCart}
              style={{ marginLeft: 12, opacity: 0.8 }}
            >
              <ShoppingCart size={20} strokeWidth={2} color={"white"} />
              <div
                style={{
                  marginLeft: 4,
                  padding: "4px 8px",
                  border: "1px solid white",
                  borderRadius: "40%",
                }}
              >
                {cartItems.length}
              </div>
            </Button>
          ) : (
            ""
          )}
        </Tabs.List>
      </StyledTabs>
      <div className={classes.itemsContainer}>
        {isMobile() ? (
          selectedItems?.map((item) => (
            <ItemItem
              key={item.id}
              item={item}
              itemInCart={cartItems?.find((cItem) => cItem.itemId === item.id)}
              onAddToCart={noActions ? undefined : handleEditCartItem}
            />
          ))
        ) : (
          <Grid gutter="xs">
            {selectedItems?.map((item) => (
              <Grid.Col span={6} key={item.id}>
                <ItemItem
                  item={item}
                  itemInCart={cartItems?.find(
                    (cItem) => cItem.itemId === item.id
                  )}
                  onAddToCart={noActions ? undefined : handleEditCartItem}
                />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </div>
      {isMobile() && (
        <div className={classes.mobileFooter} onClick={handleOpenCart}>
          {cartItems?.length ? (
            <>
              {`Continue`}
              <ShoppingCart
                size={20}
                strokeWidth={2}
                color={"black"}
                style={{ margin: "0 6px" }}
              />
              {`(${cartItems.length})`}
            </>
          ) : (
            "Pick what you want"
          )}
        </div>
      )}
      <CartModal
        isOpen={cartOpen}
        onClose={closeCartModal}
        cartItems={cartItems}
        items={items}
        onEditCartItem={handleEditCartItem}
        token={token}
        onCleanCart={() => setCartItems([])}
      />
    </div>
  );
};
