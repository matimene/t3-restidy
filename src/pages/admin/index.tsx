import { SignIn, UserButton, useUser } from "@clerk/nextjs";
import styled from "@emotion/styled";
import { Tabs } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import { Dashboard } from "~/components/Admin/Dashboard";
import { Management } from "~/components/Admin/Management";
import { Orders } from "~/components/Admin/Orders";
import { Tables } from "~/components/Admin/Tables";
import { PageLayout } from "~/components/AdminLayout";

const Centered = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TABS = {
  DASHBOARD: "dashboard",
  TABLES: "tables",
  ORDERS: "orders",
  MANAGEMENT: "management",
  ACCOUNT: "account",
};

// type Props = { host: string | null };

const AdminPage: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Return empty div if user isn't loaded
  if (!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>Admin dashboard - Restidy</title>
        <meta name="Restidy dashboard" content="Restidy store management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        {!isSignedIn ? (
          <Centered>
            <SignIn />
          </Centered>
        ) : (
          <Tabs
            defaultValue={TABS.DASHBOARD}
            styles={{
              root: {
                width: "100%",
              },
            }}
          >
            <Tabs.List>
              <Tabs.Tab value={TABS.DASHBOARD}>Dashboard</Tabs.Tab>
              <Tabs.Tab value={TABS.TABLES}>Tables</Tabs.Tab>
              <Tabs.Tab value={TABS.ORDERS}>Orders</Tabs.Tab>
              <Tabs.Tab value={TABS.MANAGEMENT}>Management</Tabs.Tab>
              <Tabs.Tab value={TABS.ACCOUNT} ml="auto">
                My store settings
              </Tabs.Tab>
              <div style={{ paddingRight: 12 }}>
                <UserButton />
              </div>
            </Tabs.List>
            <Tabs.Panel value={TABS.DASHBOARD}>
              <Dashboard />
            </Tabs.Panel>
            <Tabs.Panel value={TABS.TABLES}>
              <Tables />
            </Tabs.Panel>
            <Tabs.Panel value={TABS.ORDERS}>
              <Orders />
            </Tabs.Panel>
            <Tabs.Panel value={TABS.MANAGEMENT}>
              <Management />
            </Tabs.Panel>
            <Tabs.Panel value={TABS.ACCOUNT}>My store settings</Tabs.Panel>
          </Tabs>
        )}
      </PageLayout>
    </>
  );
};

// export const getStaticProps: GetStaticProps<Props> = async (context) => ({
//   props: { host: process.env["HOST"] || null },
// });

export default AdminPage;
