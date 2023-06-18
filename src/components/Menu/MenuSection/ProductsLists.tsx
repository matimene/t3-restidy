import { createStyles, rem } from "@mantine/core";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../../Primary/LoadingSpinner";
import Product from "./Product";
import useStore from "~/utils/zustand-store";

const useStyles = createStyles((theme) => ({
  container: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
}));

const ProductsList = ({ ids }: { ids: string }) => {
  const { classes } = useStyles();
  const { cart } = useStore();
  const { data: items, isLoading } = api.items.getByIds.useQuery({
    ids,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className={classes.container}>
      {items?.map((item) => (
        <Product
          item={item}
          key={item.id}
          itemInCart={cart.find((cItem) => cItem.itemId === item.id)}
        />
      ))}
    </div>
  );
};
export default ProductsList;
