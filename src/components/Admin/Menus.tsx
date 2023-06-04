import { createStyles, rem, Button, Table, Text } from "@mantine/core";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../Primary/LoadingSpinner";
import { useState } from "react";
import { Reload } from "tabler-icons-react";
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
    padding: theme.spacing.xs,
    gap: rem(12),
    justifyContent: "center",
    alignItems: "flex-end",
  },
}));

const Menus = () => {
  const { classes } = useStyles();
  const [sortBy, setSortBy] = useState<string>("active");

  const ctx = api.useContext();
  const { data: items, isLoading } = api.menus.getAll.useQuery();

  const handleToggleActive = () => {
    console.log("go");
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Row align="center" justify="center">
        <Text>Menus</Text>
      </Row>
      <div className={classes.filterContainer}>
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
              <th>Name (ENG)</th>
              <th>Name (SPA)</th>
              <th>Sections</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr key={item.id}>
                <td>{item.active ? "Active" : "Disabled"}</td>
                <td>{item.nameEn}</td>
                <td>{item.nameEs}</td>
                <td>
                  {item.sections
                    ?.map((menuSection) => menuSection.nameEn)
                    .join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};
export default Menus;
