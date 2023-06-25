import type { PropsWithChildren } from "react";
import { createStyles, rem } from "@mantine/core";
import useIntervalPicker from "~/utils/hooks/useIntervalPicker";

interface LayoutProps {
  bgUrl: string;
}

const useStyles = createStyles((theme, { bgUrl }: LayoutProps) => ({
  main: {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url(${bgUrl})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    minHeight: "100vh",
    display: "flex",
    // justifyContent: "start",
    // overflowY: "scroll",
    // maxHeight: "-webkit-fill-available",
  },
  nav: {
    backgroundColor: theme.colors.gray[5],
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    height: rem(48),
    overflow: "visible",
  },
  content: {
    position: "relative",
    maxWidth: rem(1024),
    width: "100%",
    flex: 1,
    paddingTop: rem(24),
    paddingBottom: rem(24),
    display: "flex",
    justifyContent: "start",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: theme.radius.sm,
    flexDirection: "column",
  },
}));

type PageLayoutProps = PropsWithChildren & {
  bgImgs?: string[];
  showNav?: boolean;
};

export const PageLayout = (props: PageLayoutProps) => {
  const bgImage = useIntervalPicker(props?.bgImgs || [], 5000);
  const { classes } = useStyles({ bgUrl: bgImage });

  return (
    <main className={classes.main}>
      <div className={classes.content}>{props.children}</div>
    </main>
  );
};
