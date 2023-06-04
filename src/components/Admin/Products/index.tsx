import { createStyles, Select, rem, Button, Table } from "@mantine/core";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../../Primary/LoadingSpinner";
import { useState } from "react";
import ItemProduct from "./ItemProduct";
import { PRODUCTS_SORT_BY } from "./helper";
import { Reload } from "tabler-icons-react";
import { useDisclosure } from "@mantine/hooks";
import ModalEditProduct from "./ModalEditProduct";

const useStyles = createStyles((theme) => ({
  container: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    padding: theme.spacing.xs,
    gap: rem(12),
  },
  filterContainer: {
    width: "100%",
    display: "flex",
    gap: rem(12),
    justifyContent: "center",
    alignItems: "flex-end",
  },
}));

const Products = () => {
  const { classes } = useStyles();
  const [sortBy, setSortBy] = useState<string>("active");
  const [opened, { open, close }] = useDisclosure(false);
  const [editProductId, setEditProductId] = useState<number | undefined>();

  const ctx = api.useContext();
  const { data: items, isLoading } = api.items.getAll.useQuery({
    sortBy,
  });

  const handleToggleActive = () => {
    console.log("go");
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className={classes.filterContainer}>
        <Select
          label="Sort by"
          data={PRODUCTS_SORT_BY}
          value={sortBy}
          onChange={(value: string) => setSortBy(value)}
        />
        <Button
          disabled={isLoading}
          onClick={() => void ctx.orders.getAll.invalidate()}
        >
          <Reload size={24} strokeWidth={1.5} color={"white"} />
        </Button>
      </div>
      <div className={classes.container}>
        <Table>
          <thead>
            <tr>
              <th>Sku</th>
              <th>Status</th>
              <th>Image</th>
              <th>Title (ENG)</th>
              <th>Title (SPA)</th>
              <th>Description (ENG)</th>
              <th>Description (SPA)</th>
              <th>Categories</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <ItemProduct
                key={item.id}
                item={item}
                onToggleActive={handleToggleActive}
                onEdit={() => {
                  setEditProductId(item.id);
                  open();
                }}
              />
            ))}
          </tbody>
        </Table>
      </div>
      {editProductId && (
        <ModalEditProduct
          isOpen={opened}
          onClose={close}
          itemId={editProductId}
        />
      )}
    </>
  );
};
export default Products;
