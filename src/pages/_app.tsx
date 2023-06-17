import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import {
  MantineProvider,
  ColorSchemeProvider,
  type ColorScheme,
} from "@mantine/core";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

const MyApp: AppType = ({ Component, pageProps }) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ClerkProvider {...pageProps}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme,
            spacing: {
              xxs: "0.6rem",
              xs: "0.9rem",
              sm: "1.2rem",
              md: "1.8rem",
              lg: "2.2rem",
              xl: "2.8rem",
            },
            colors: {
              gradient: [
                "linear-gradient(90deg, rgba(255,248,13,1) 0%, rgba(255,158,38,1) 100%)",
                "linear-gradient(90deg, rgba(255,158,38,1) 0%, rgba(255,248,13,1) 100%)",
              ],
            },
          }}
        >
          <Toaster />
          <Component {...pageProps} />
        </MantineProvider>
      </ColorSchemeProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
