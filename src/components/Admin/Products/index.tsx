import {
  MultiSelect,
  createStyles,
  Select,
  rem,
  Button,
  Table,
} from "@mantine/core";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../../Primary/LoadingSpinner";
import { useState } from "react";
import ItemProduct from "./ItemProduct";
import { ORDERS_SORT_BY, ORDERS_STATUS } from "./helper";
import { Reload } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  container: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    padding: theme.spacing.xs,
    gap: rem(12),
  },
  filterContainer: {
    flex: 1,
    width: "100%",
    display: "flex",
    padding: theme.spacing.xs,
    gap: rem(12),
    justifyContent: "center",
    alignItems: "flex-end",
  },
}));

const Products = () => {
  const { classes } = useStyles();
  const [validStatus, setValidStatus] = useState(
    ORDERS_STATUS.map((i) => i.value)
  );
  const [sortBy, setSortBy] = useState<string>("createdAt");

  const ctx = api.useContext();
  const { data: items, isLoading } = api.items.getAll.useQuery();

  const handleToggleActive = () => {
    console.log("go");
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className={classes.filterContainer}>
        <MultiSelect
          value={validStatus}
          onChange={setValidStatus}
          data={ORDERS_STATUS}
          label="Show only status"
          placeholder="Orders statuses"
        />
        <Select
          label="Sort by"
          data={ORDERS_SORT_BY}
          value={sortBy}
          onChange={(value: string) => setSortBy(value)}
        />
        <Button
          disabled={isLoading}
          onClick={() => void ctx.orders.getAll.invalidate()}
        >
          <Reload size={24} strokeWidth={2} color={"white"} />
        </Button>
      </div>
      <div className={classes.container}>
        <Table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Active</th>
              <th>Sku</th>
              <th>Title English</th>
              <th>Title Spanish</th>
              <th>Description English</th>
              <th>Description Spanish</th>
              <th>Categories</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <ItemProduct
                key={item.id}
                item={item}
                onToggleActive={handleToggleActive}
              />
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};
export default Products;
