import { useState } from "react";
import { Loader, Tabs } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import { ItemsList } from "~/components/ItemsList";
import { PageLayout } from "~/components/Layout";
import { api } from "~/utils/api";
import { getProductLocaleProps } from "~/utils/helpers";
import { Category } from "@prisma/client";

const OrderMenuPage: NextPage<{ code: string }> = ({ code: storeCode }) => {
  const { data: storeData, isLoading: storeLoading } =
    api.stores.loadDataByCode.useQuery({
      code: storeCode,
    });
  const { data: items, isLoading } = api.items.getAll.useQuery({
    code: storeCode,
  });
  const [activeTabCode, setActiveTabCode] = useState<string | null>(null);

  if (storeLoading) return <Loader />;
  if (!items || !storeData || !storeData.categories)
    return <div>Something went wrong</div>;

  const { categories: cats } = storeData;

  const categories = cats.map((item: Category) => {
    const { name } = getProductLocaleProps({
      item,
      keys: ["name"],
    });
    return { code: item.code, name };
  });

  console.log(categories);

  return (
    <>
      <Head>
        <title>Menu - Restidy T3</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <ItemsList
          categories={categories}
          items={items}
          isLoading={isLoading}
        />
      </PageLayout>
    </>
  );
};

OrderMenuPage.getInitialProps = ({ req }) => {
  // // FOR WHEN NEEDED ONLY ON CLIENT SIDE
  // const code = window.location.host.split(".")[0] as string;
  // FOR WHEN THEY'RE NEEDED AT SERVER SIDE
  const code = req?.headers?.host?.split(".")[0] as string;
  if (typeof code !== "string") throw new Error("No store found");

  return { code };
};

export default OrderMenuPage;
