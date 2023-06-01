import dynamic from "next/dynamic";
import { Tabs } from "@mantine/core";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";
import ThemeToggler from "../Primary/ThemeToggler";

const DynamicOrders = dynamic(() => import("./Orders"), {
  loading: () => <p>Loading...</p>,
});
const DynamicTables = dynamic(() => import("./Tables"), {
  loading: () => <p>Loading...</p>,
});
const DynamicProducts = dynamic(() => import("./Products"), {
  loading: () => <p>Loading...</p>,
});

const TABS = {
  DASHBOARD: "dashboard",
  TABLES: "tables",
  ORDERS: "orders",
  MANAGEMENT: "management",
  ACCOUNT: "account",
  PRODUCTS: "products",
};

const Handler = ({ selectedValue }: { selectedValue: string | null }) => {
  switch (selectedValue) {
    case TABS.ACCOUNT:
      return <div>My store settings</div>;
    case TABS.TABLES:
      return <DynamicTables />;
    case TABS.PRODUCTS:
      return <DynamicProducts />;
    case TABS.ORDERS:
    default:
      return <DynamicOrders />;
  }
};

export const Content = () => {
  const [activeTab, setActiveTab] = useState<string | null>(TABS.ORDERS);

  return (
    <Tabs
      value={activeTab}
      onTabChange={setActiveTab}
      styles={{
        root: {
          width: "100%",
        },
      }}
    >
      <Tabs.List>
        {/* <Tabs.Tab value={TABS.DASHBOARD}>Dashboard</Tabs.Tab> */}
        <Tabs.Tab value={TABS.ORDERS}>Orders</Tabs.Tab>
        <Tabs.Tab value={TABS.TABLES}>Tables</Tabs.Tab>
        <Tabs.Tab value={TABS.PRODUCTS}>Products</Tabs.Tab>
        <Tabs.Tab value={TABS.MANAGEMENT}>Management</Tabs.Tab>
        <Tabs.Tab value={TABS.ACCOUNT} ml="auto">
          My store settings
        </Tabs.Tab>
        <div
          style={{ display: "flex", alignItems: "center", paddingRight: 12 }}
        >
          <ThemeToggler />
        </div>
        <div
          style={{ display: "flex", alignItems: "center", paddingRight: 12 }}
        >
          <UserButton />
        </div>
      </Tabs.List>
      <Handler selectedValue={activeTab} />
    </Tabs>
  );
};
