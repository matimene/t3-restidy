import { SimpleGrid, createStyles, rem } from "@mantine/core";
import { type RouterOutputs } from "~/utils/api";
import { LoadingSpinner } from "~/components/Primary/LoadingSpinner";
import styled from "@emotion/styled";
import { useRouter } from "next/router";

type MenuWithSections = RouterOutputs["menus"]["getAll"][number];

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

const SectionItem = styled.div`
  padding: 24px;
  text-transform: uppercase;
  font-size: 20px;
  font-weight: 600;
  border: 1px solid white;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  border-radius: 150px;
  height: 150px;
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
`;

const SectionsList = ({
  menu,
  isLoading,
}: {
  menu: MenuWithSections;
  isLoading: boolean;
}) => {
  const router = useRouter();
  const { classes } = useStyles();

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className={classes.container}>
        <SimpleGrid cols={2}>
          {menu?.sections.map((section) => (
            <SectionItem
              key={section.id}
              onClick={() =>
                void router.push(`/menu/${menu.slug}/${section.slug}`)
              }
            >
              {section.nameEn}
            </SectionItem>
          ))}
        </SimpleGrid>
      </div>
    </>
  );
};
export default SectionsList;
