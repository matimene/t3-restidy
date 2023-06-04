import dynamic from "next/dynamic";
import { useState } from "react";
import AdminHeader from "./AdminHeader";

const DynamicOrders = dynamic(() => import("./Orders"), {
  loading: () => <p>Loading...</p>,
});
const DynamicTables = dynamic(() => import("./Tables"), {
  loading: () => <p>Loading...</p>,
});
const DynamicProducts = dynamic(() => import("./Products"), {
  loading: () => <p>Loading...</p>,
});
const DynamicCategories = dynamic(() => import("./Categories"), {
  loading: () => <p>Loading...</p>,
});
const DynamicMenus = dynamic(() => import("./Menus"), {
  loading: () => <p>Loading...</p>,
});
const DynamicPhysicalTables = dynamic(() => import("./PhysicalTables"), {
  loading: () => <p>Loading...</p>,
});

const TABS = {
  DASHBOARD: "dashboard",
  ORDERS: "orders",
  TABLES: "tables",
  MANAGEMENT: "management",
  CATEGORIES: "categories",
  PHYSICAL_TABLES: "physical tables",
  MENUS: "menus",
  PRODUCTS: "products",
  ACCOUNT: "account",
};

const Handler = ({ selectedValue }: { selectedValue: string | null }) => {
  switch (selectedValue) {
    case TABS.ACCOUNT:
      return <div>My store settings</div>;
    case TABS.TABLES:
      return <DynamicTables />;
    case TABS.PRODUCTS:
      return <DynamicProducts />;
    case TABS.CATEGORIES:
      return <DynamicCategories />;
    case TABS.MENUS:
      return <DynamicMenus />;
    case TABS.PHYSICAL_TABLES:
      return <DynamicPhysicalTables />;
    case TABS.ORDERS:
    default:
      return <DynamicOrders />;
  }
};

function buildTabLinks(setActive: (tab: string) => void) {
  return [
    {
      label: TABS.ORDERS,
      key: TABS.ORDERS,
      onClick: () => setActive(TABS.ORDERS),
    },
    {
      label: TABS.TABLES,
      key: TABS.TABLES,
      onClick: () => setActive(TABS.TABLES),
    },
    {
      label: TABS.MANAGEMENT,
      key: TABS.MANAGEMENT,
      links: [
        {
          label: TABS.CATEGORIES,
          key: TABS.CATEGORIES,
          onClick: () => setActive(TABS.CATEGORIES),
        },
        {
          label: TABS.MENUS,
          key: TABS.MENUS,
          onClick: () => setActive(TABS.MENUS),
        },
        {
          label: TABS.PRODUCTS,
          key: TABS.PRODUCTS,
          onClick: () => setActive(TABS.PRODUCTS),
        },
      ],
    },
  ];
}

export const Content = () => {
  const [activeTab, setActiveTab] = useState<string | null>(TABS.ORDERS);
  const tabLinks = buildTabLinks(setActiveTab);

  return (
    <>
      <AdminHeader links={tabLinks} />
      <Handler selectedValue={activeTab} />
    </>
  );
};
