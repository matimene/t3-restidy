import { SimpleGrid, Text, createStyles, rem } from "@mantine/core";
import { type RouterOutputs } from "~/utils/api";
import { LoadingSpinner } from "~/components/Primary/LoadingSpinner";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { url } from "inspector";
import menu from "~/pages/menu";

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

const SectionItem = styled.div<{ img?: string | null }>`
  padding: 24px;
  text-transform: uppercase;
  font-size: 20px;
  font-weight: 600;
  border: 2px solid white;
  cursor: pointer;
  border-radius: 38vw;
  height: 38vw;
  width: 38vw;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;

  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)),
    url(${({ img }) => img});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
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
    <div className={classes.container}>
      <SimpleGrid cols={2}>
        {menu?.sections?.map((section) => (
          <div key={section.id}>
            <SectionItem
              img={section.img}
              onClick={() =>
                void router.push({
                  pathname: `/menu/${menu.slug}/${section.slug}`,
                  query: { token: router.query.token },
                })
              }
            >
              <Text align="center" transform="uppercase" color="white">
                {section.nameEn}
              </Text>
            </SectionItem>
          </div>
        ))}
      </SimpleGrid>
    </div>
  );
};
export default SectionsList;
