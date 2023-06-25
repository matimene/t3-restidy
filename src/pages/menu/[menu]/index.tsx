import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/Layout";
import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/Primary/LoadingSpinner";
import SectionsList from "~/components/Menu/SectionsList";
import { SmtWrong } from "~/components/Primary";
import MenuNavbar from "~/components/Menu/Navbar";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

const MenuPage: NextPage<{ menuSlug: string }> = ({ menuSlug }) => {
  const { data: store, isLoading: isLoadingStore } =
    api.stores.getStore.useQuery();
  const { data: storeConfig, isLoading: isLoadingConfig } =
    api.stores.getConfig.useQuery();
  const { data: menu, isLoading } = api.menus.getBySlug.useQuery({
    slug: menuSlug,
  });

  if (isLoading || isLoadingConfig || isLoadingStore) return <LoadingSpinner />;
  if (!menu || !store) return <SmtWrong />;

  return (
    <>
      <Head>
        <title>
          {store.name} - {menu?.nameEn ?? "Menu"}
        </title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout bgImgs={storeConfig?.bgImgs?.split(";")}>
        <MenuNavbar />
        <SectionsList menu={menu} isLoading={isLoading} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const menuSlug = context.params?.menu as string;

  if (typeof menuSlug !== "string") throw new Error("no menu");

  await ssg.menus.getBySlug.prefetch({ slug: menuSlug });
  await ssg.stores.getConfig.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
      menuSlug,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default MenuPage;

// MenuPage.getInitialProps = ({ req }) => {
//   // // FOR WHEN NEEDED ONLY ON CLIENT SIDE
//   // const code = window.location.host.split(".")[0] as string;
//   // FOR WHEN THEY'RE NEEDED AT SERVER SIDE
//   const code = req?.headers?.host?.split(".")[0] as string;
//   if (typeof code !== "string") throw new Error("No store found");

//   return { code };
// };
