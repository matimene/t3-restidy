import { createStyles, rem } from "@mantine/core";
import { LoadingSpinner } from "~/components/Primary/LoadingSpinner";
import { type Menu } from "@prisma/client";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import useFieldTranslation from "~/utils/hooks/useFieldTranslation";
import I18NButton from "./Navbar/I18NButton";

const useStyles = createStyles((theme) => ({
  container: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: theme.spacing.xs,
    gap: rem(12),
  },
}));

const MenuItem = styled.div`
  padding: 72px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  filter: drop-shadow(0 0 0.75rem black);
  text-transform: uppercase;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 12px;
`;

const MenusList = ({
  menus,
  isLoading,
}: {
  menus: Menu[];
  isLoading: boolean;
}) => {
  const { toLocale } = useFieldTranslation();
  const router = useRouter();
  const { classes } = useStyles();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className={classes.container}>
      <I18NButton style={{ position: "absolute", top: 32, right: 64 }} />
      {menus?.map((menu) => (
        <MenuItem
          key={menu.id}
          onClick={() =>
            void router.push({
              pathname: `/menu/${menu.slug}`,
              query: { token: router.query.token },
            })
          }
        >
          {toLocale(menu, "name")}
        </MenuItem>
      ))}
    </div>
  );
};
export default MenusList;
