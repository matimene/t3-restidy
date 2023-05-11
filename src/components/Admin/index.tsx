import { createStyles, rem } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  container: {
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    color: "white",
    fontSize: theme.fontSizes.md,
  },
}));

export const Dashboard = () => {
  const { classes } = useStyles();
  return <div className={classes.container}>content</div>;
};
