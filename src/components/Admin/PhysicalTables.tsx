import { createStyles, Select, rem, Button, Table, Text } from "@mantine/core";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../Primary/LoadingSpinner";
import { useState } from "react";
import { Reload } from "tabler-icons-react";
import { Row } from "~/components/Primary";

export const P_TABLES_SORT_BY = [
  {
    value: "active",
    label: "Status",
  },
  {
    value: "titleEn",
    label: "Title ENG",
  },
  {
    value: "titleEs",
    label: "Title ESP",
  },
  {
    value: "sku",
    label: "SKU",
  },
];

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

const PhysicalTables = () => {
  const { classes } = useStyles();
  const [sortBy, setSortBy] = useState<string>("active");

  const ctx = api.useContext();
  const { data: items, isLoading } = api.physicalTables.getAll.useQuery();

  const handleToggleActive = () => {
    console.log("go");
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Row align="center" justify="center">
        <Text>Physical Tables</Text>
      </Row>
      <div className={classes.filterContainer}>
        <Select
          label="Sort by"
          data={P_TABLES_SORT_BY}
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
              <th>Active</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr key={item.id}>
                <td>{item.active ? "Active" : "Disabled"}</td>
                <td>{item.name}</td>
                <td>Actions</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};
export default PhysicalTables;
