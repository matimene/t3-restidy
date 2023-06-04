import { createStyles, rem, Button, Table, Text } from "@mantine/core";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../../Primary/LoadingSpinner";
import { useState } from "react";
import { Edit, Reload, Trash } from "tabler-icons-react";
import { Row } from "~/components/Primary";
import { useDisclosure } from "@mantine/hooks";
import ModalEditCategory from "./ModalEditCategory";

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
    padding: theme.spacing.xs,
    gap: rem(12),
    justifyContent: "center",
    alignItems: "flex-end",
  },
}));

const Categories = () => {
  const { classes } = useStyles();
  const [sortBy, setSortBy] = useState<string>("active");
  const ctx = api.useContext();
  const { data: items, isLoading } = api.categories.getAll.useQuery();
  const [opened, { open, close }] = useDisclosure(false);
  const [editCategoryId, setEditCategoryId] = useState<number | undefined>();

  const handleToggleActive = () => {
    console.log("go");
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Row align="center" justify="center">
        <Text transform="uppercase" weight={600} size={24}>
          Categories
        </Text>
      </Row>
      <div className={classes.filterContainer}>
        <Button
          disabled={isLoading}
          onClick={() => void ctx.orders.getAll.invalidate()}
        >
          Add new
        </Button>
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
              <th>Code</th>
              <th>Order</th>
              <th>Name (ENG)</th>
              <th>Name (SPA)</th>
              <th>Parent</th>
              <th>Subcategories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr key={item.id}>
                <td>{item.code}</td>
                <td>{item.order}</td>
                <td>{item.nameEn}</td>
                <td>{item.nameEs}</td>
                <td>{item.parentCategory ? item.parentCategory?.code : "-"}</td>
                <td>{item.subCategories?.length}</td>
                <td style={{ display: "flex", gap: 12 }}>
                  <Button
                    disabled={isLoading}
                    onClick={() => {
                      setEditCategoryId(item.id);
                      open();
                    }}
                  >
                    <Edit size={24} strokeWidth={1.5} color={"white"} />
                  </Button>
                  <Button
                    disabled={isLoading}
                    color="red"
                    onClick={() => void ctx.orders.getAll.invalidate()}
                  >
                    <Trash size={24} strokeWidth={1.5} color={"white"} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {editCategoryId && (
        <ModalEditCategory
          isOpen={opened}
          onClose={close}
          itemId={editCategoryId}
        />
      )}
    </>
  );
};
export default Categories;
