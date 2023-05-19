import type { PropsWithChildren } from "react";
import { Container, Grid, createStyles, rem } from "@mantine/core";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import useIntervalPicker from "~/utils/hooks/useIntervalPicker";

interface LayoutProps {
  bgUrl: string;
}

const useStyles = createStyles((theme, { bgUrl }: LayoutProps) => ({
  main: {
    position: "relative",
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bgUrl})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    display: "flex",
    justifyContent: "start",
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    height: "100vh",
    maxHeight: "-webkit-fill-available",
  },
  nav: {
    backgroundColor: theme.colors.gray[5],
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    height: rem(48),
  },
  content: {
    width: "100%",
    height: "100%",
    paddingTop: rem(24),
    paddingBottom: rem(24),
    display: "flex",
    justifyContent: "flex-start",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: theme.radius.sm,
    flexDirection: "column",
  },
}));

type PageLayoutProps = PropsWithChildren & { showNav?: boolean };
const BG_IMAGES = [
  "https://us.steelite.com/media/catalog/category/758x458/restaurant-plates-blue-dapple.jpg",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Nnx8fGVufDB8fHx8&w=1000&q=80",
  "https://st3.depositphotos.com/1062035/16145/i/600/depositphotos_161452498-stock-photo-boiled-octopus-with-vegetables.jpg",
]; // TODO: get dynamic from store

export const PageLayout = (props: PageLayoutProps) => {
  const user = useUser();
  const bgImage = useIntervalPicker(BG_IMAGES, 5000);
  const { classes } = useStyles({ bgUrl: bgImage });

  return (
    <main className={classes.main}>
      {props.showNav ? (
        <nav className={classes.nav}>
          {!!user.isSignedIn ? (
            <SignOutButton />
          ) : (
            <SignInButton mode="modal">
              <button className="btn">Sign in</button>
            </SignInButton>
          )}
        </nav>
      ) : (
        ""
      )}
      <div className={classes.content}>{props.children}</div>
    </main>
  );
};
