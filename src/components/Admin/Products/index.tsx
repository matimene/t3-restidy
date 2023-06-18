import { createStyles, Select, rem, Button, Table, Text } from "@mantine/core";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../../Primary/LoadingSpinner";
import { useState } from "react";
import ItemProduct from "./ItemProduct";
import { PRODUCTS_SORT_BY } from "./helper";
import { Reload } from "tabler-icons-react";
import { useDisclosure } from "@mantine/hooks";
import ModalEditProduct from "./ModalEditProduct";
import ModalNewProduct from "./ModalNewProduct";
import { Row } from "~/components/Primary";

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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: rem(12),
  },
}));

const Products = () => {
  const { classes } = useStyles();
  const [sortBy, setSortBy] = useState<string>("active");
  const [openedNew, { open: openNew, close: closeNew }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
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
      <Row align="center" justify="center">
        <Text transform="uppercase" weight={600} size={24}>
          Products
        </Text>
      </Row>
      <div className={classes.filterContainer}>
        <Row justify="center" align="flex-end" gap={12}>
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
        </Row>
        <Row justify="center">
          <Button onClick={openNew}>New product</Button>
        </Row>
      </div>
      <div className={classes.container}>
        <Table>
          <thead>
            <tr>
              <th>Sku</th>
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
                  openEdit();
                }}
              />
            ))}
          </tbody>
        </Table>
      </div>
      {editProductId && (
        <ModalEditProduct
          isOpen={openedEdit}
          onClose={closeEdit}
          itemId={editProductId}
        />
      )}
      {openedNew && <ModalNewProduct isOpen={openedNew} onClose={closeNew} />}
    </>
  );
};
export default Products;
