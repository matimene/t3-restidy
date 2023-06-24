import { Text, Box } from "@mantine/core";
import { Atom2, World, ShoppingCart } from "tabler-icons-react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";
import useStore from "~/utils/zustand-store";
import { Row } from "~/components/Primary";
import CartDrawer from "./CartDrawer";
import { useState } from "react";

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
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
  const lang = (router.query.lang as string) ?? "en";

  const handleChangeLang = () =>
    void router.replace({
      query: { ...router.query, lang: lang === "en" ? "es" : "en" },
    });

  return (
    <>
      <Box w="100%" mx="auto" mb={18} style={{ position: "sticky" }}>
        <Row
          mr={24}
          ml={24}
          justify="space-between"
          style={{ position: "relative" }}
        >
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
          <Text
            color="white"
            transform="uppercase"
            size={18}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            Boludo&apos;s Store
          </Text>
          <div style={{ display: "flex", gap: 24 }}>
            <ItemContainer
              style={{ justifyContent: "center" }}
              onClick={handleChangeLang}
            >
              <Text>
                {lang === "en" ? "ENG" : "SPA"}
                <World size={12} style={{ marginLeft: 2 }} />
              </Text>
            </ItemContainer>
            <ItemContainer onClick={openCart}>
              <ShoppingCart size={24} />
              <Text transform="uppercase" size={14}>
                Cart
              </Text>
              <Circle>{cart?.length}</Circle>
            </ItemContainer>
          </div>
        </Row>
      </Box>
      {opened && <CartDrawer opened={opened} onClose={close} />}
    </>
  );
};

export default MenuNavbar;
