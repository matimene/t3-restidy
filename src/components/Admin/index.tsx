import { createStyles } from "@mantine/core";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../Primary/LoadingSpinner";

const useStyles = createStyles((theme) => ({
  container: {
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    color: "white",
    fontSize: theme.fontSizes.md,
  },
}));

export const Dashboard = () => {
  const { classes } = useStyles();
  const { data: storeData, isLoading: storeLoading } =
    api.stores.loadDataByCode.useQuery();
  const { data: items, isLoading } = api.items.getAll.useQuery();

  if (storeLoading || isLoading) if (isLoading) return <LoadingSpinner />;

  return <div className={classes.container}>Admin dashboard</div>;
};
