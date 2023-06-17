import { createStyles, rem } from "@mantine/core";
import ProductsList from "./ProductsLists";
import { type MenuSections } from "@prisma/client";

const useStyles = createStyles((theme) => ({
  container: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: theme.spacing.xs,
    gap: rem(12),
  },
}));

const MenuSection = ({ section }: { section: MenuSections }) => {
  const { classes } = useStyles();

  return (
    <>
      <div className={classes.container}>
        <ProductsList ids={section?.itemIds ?? ""} />
      </div>
    </>
  );
};
export default MenuSection;
