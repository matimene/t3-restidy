import { SignIn, useUser } from "@clerk/nextjs";
import styled from "@emotion/styled";
import { type NextPage } from "next";
import Head from "next/head";
import { Dashboard } from "~/components/Admin";
import { PageLayout } from "~/components/Layout";

const Centered = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Admin: NextPage = () => {
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
          <Dashboard />
        )}
      </PageLayout>
    </>
  );
};

export default Admin;
