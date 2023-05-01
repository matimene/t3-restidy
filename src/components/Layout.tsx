import type { PropsWithChildren } from "react";
import { createStyles, rem } from "@mantine/core";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

const useStyles = createStyles((theme) => ({
  main: {
    backgroundColor: theme.colors.gray[9],
    display: "flex",
    justifyContent: "start",
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    minHeight: "100vh",
    flexDirection: "column",
  },
  nav: {
    backgroundColor: theme.colors.gray[5],
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    height: rem(48),
  },
  container: {
    backgroundColor: theme.colors.gray[3],
    maxWidth: rem(1024),
    marginTop: rem(5),
    width: "100%",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: theme.radius.sm,
  },
}));

type PageLayoutProps = PropsWithChildren & { showNav?: boolean };

export const PageLayout = (props: PageLayoutProps) => {
  const { classes } = useStyles();
  const user = useUser();

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
      <div className={classes.container}>{props.children}</div>
    </main>
  );
};
