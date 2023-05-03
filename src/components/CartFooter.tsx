import { createStyles, rem } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  container: {
    height: rem(48),
    backgroundColor: theme.colors.yellow[6],
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
    fontSize: theme.fontSizes.lg,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
}));

export const CartFooter = ({ items }: { items: any[] }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      {items?.length ? `Place order (${items.length})` : "Add to cart"}
    </div>
  );
};
