import { createStyles, rem } from "@mantine/core";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../../Primary/LoadingSpinner";
import Product from "./Product";

const useStyles = createStyles((theme) => ({
  container: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: rem(12),
  },
}));

const ProductsList = ({ ids }: { ids: string }) => {
  const { classes } = useStyles();
  const ctx = api.useContext();
  const { data: items, isLoading } = api.items.getByIds.useQuery({
    ids,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className={classes.container}>
      {items?.map((item) => (
        <Product item={item} key={item.id} itemInCart={undefined} />
      ))}
    </div>
  );
};
export default ProductsList;
