import { Text, Collapse, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type RouterOutputs } from "~/utils/api";
import { ChevronDown, ChevronUp } from "tabler-icons-react";
import { GradientDivider, Row } from "../Primary";
import router from "next/router";
import useFieldTranslation from "~/utils/hooks/useFieldTranslation";
import Link from "next/link";

type MenuWithSections = RouterOutputs["menus"]["getAll"][number];

const SectionsHeader = ({ menu }: { menu: MenuWithSections }) => {
  const { toLocale } = useFieldTranslation();
  const [opened, { toggle }] = useDisclosure(false);
  const { t } = useFieldTranslation();

  return (
    <Box w="100%" mx="auto">
      <Row
        mr={24}
        ml={24}
        justify="space-between"
        onClick={toggle}
        style={{ cursor: "pointer" }}
      >
        <Text transform="uppercase" size={18} color="white">
          {t("CATEGORIES")}
        </Text>
        {opened ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </Row>

      <Collapse
        in={opened}
        animateOpacity
        transitionDuration={200}
        transitionTimingFunction="ease"
      >
        {menu?.sections?.map((section) => (
          <Text
            align="center"
            transform="uppercase"
            size={16}
            key={section.id}
            my={12}
            color="white"
            style={{ cursor: "pointer" }}
            onClick={() => {
              void router.push({
                pathname: `/menu/${menu.slug}/${section.slug}`,
                query: { token: router.query.token },
              });
              toggle();
            }}
          >
            {toLocale(section, "name")}
          </Text>
        ))}
      </Collapse>
      <GradientDivider mt={12} gradient={1} />
    </Box>
  );
};

export default SectionsHeader;
