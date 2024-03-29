import { Text, createStyles } from "@mantine/core";
import ProductsList from "./ProductsLists";
import { type MenuSections } from "@prisma/client";
import { Centered, GradientDivider } from "~/components/Primary";
import useFieldTranslation from "~/utils/hooks/useFieldTranslation";

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
  const { toLocale } = useFieldTranslation();

  if (!section?.itemIds?.length) return <Centered>No products yet</Centered>;

  return (
    <>
      <div className={classes.container}>
        <Text size={30} align="center" transform="uppercase" color="white">
          {toLocale(section, "name")}
        </Text>
        <GradientDivider w={100} />
        <ProductsList ids={section?.itemIds ?? ""} />
      </div>
    </>
  );
};
export default MenuSection;
