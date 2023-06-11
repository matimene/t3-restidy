import { Loader } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import { ItemsList } from "~/components/Menu/ItemsList";
import { PageLayout } from "~/components/Layout";
import { api } from "~/utils/api";
import { getProductLocaleProps } from "~/utils/helpers";
import { type Category } from "@prisma/client";
import { Centered } from "~/components/Primary/LoadingSpinner";

const OrderMenuPage: NextPage<{ code: string }> = ({ code: storeCode }) => {
  const { data: storeData, isLoading: storeLoading } =
    api.stores.loadDataByCode.useQuery();
  const { data: items, isLoading } = api.items.getAll.useQuery();

  if (storeLoading)
    return (
      <Centered>
        <Loader />
      </Centered>
    );

  if (!storeData || !items || !storeData.categories)
    return <Centered>Something went wrong</Centered>;

  const { categories: cats } = storeData;

  const categories = cats.map((item: Category) => {
    const translations = getProductLocaleProps({
      item,
      keys: ["name"],
    });

    return { code: item.code, name: translations.name as string };
  });

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
          noActions
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
