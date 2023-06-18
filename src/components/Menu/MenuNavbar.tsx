import { Text, Box, Drawer } from "@mantine/core";
import { Atom2, ShoppingCart } from "tabler-icons-react";
import { Row } from "../Primary";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";
import useStore from "~/utils/zustand-store";

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;
const Circle = styled.div`
  position: absolute;
  width: 14px;
  height: 14px;
  color: black;
  background-color: #ffffffcc;
  top: -4px;
  right: -4px;
  line-height: 14px;
  font-size: 10px;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  justify-content: center;
`;

const MenuNavbar = () => {
  const router = useRouter();
  const [opened, { open: openCart, close }] = useDisclosure(false);
  const { cart } = useStore();

  return (
    <>
      <Box w="100%" mx="auto" mb={18} style={{ position: "sticky" }}>
        <Row mr={24} ml={24} justify="space-between">
          <ItemContainer
            onClick={() =>
              void router.push({
                pathname: "/menu",
                query: { token: router.query.token },
              })
            }
          >
            <Atom2 size={24} />
            <Text transform="uppercase" size={14}>
              Menu
            </Text>
          </ItemContainer>
          <ItemContainer onClick={openCart}>
            <ShoppingCart size={24} />
            <Text transform="uppercase" size={14}>
              Cart
            </Text>
            <Circle>{cart?.length}</Circle>
          </ItemContainer>
        </Row>
      </Box>
      <Drawer opened={opened} onClose={close} title="Cart">
        {/* Drawer content */}
      </Drawer>
    </>
  );
};

export default MenuNavbar;
