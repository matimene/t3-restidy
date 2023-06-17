import { Text, createStyles } from "@mantine/core";
import ProductsList from "./ProductsLists";
import { type MenuSections } from "@prisma/client";
import { GradientDivider } from "~/components/Primary";

const useStyles = createStyles((theme) => ({
  container: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: theme.spacing.xs,
  },
}));

const MenuSection = ({ section }: { section: MenuSections }) => {
  const { classes } = useStyles();

  return (
    <>
      <div className={classes.container}>
        <Text size={30} align="center" transform="uppercase">
          {section?.nameEn}
        </Text>
        <GradientDivider w={100} />
        <ProductsList ids={section?.itemIds ?? ""} />
      </div>
    </>
  );
};
export default MenuSection;
