import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { MantineProvider } from "@mantine/core";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "dark",
          spacing: {
            xxs: "0.6rem",
            xs: "0.9rem",
            sm: "1.2rem",
            md: "1.8rem",
            lg: "2.2rem",
            xl: "2.8rem",
          },
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
