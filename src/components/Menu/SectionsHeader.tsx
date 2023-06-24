import { Text, Collapse, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type RouterOutputs } from "~/utils/api";
import { ChevronDown, ChevronUp } from "tabler-icons-react";
import { GradientDivider, Row } from "../Primary";
import { useRouter } from "next/router";
import { getFieldTranslation } from "~/utils/hooks/useFieldTranslation";

type MenuWithSections = RouterOutputs["menus"]["getAll"][number];

const SectionsHeader = ({ menu }: { menu: MenuWithSections }) => {
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Box w="100%" mx="auto">
      <Row mr={24} ml={24} justify="space-between" onClick={toggle}>
        <Text transform="uppercase" size={18} color="white">
          Categories
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
            onClick={() => {
              void router.push({
                pathname: `/menu/${menu.slug}/${section.slug}`,
                query: { token: router.query.token },
              });
              toggle();
            }}
          >
            {getFieldTranslation(section, "name", router)}
          </Text>
        ))}
      </Collapse>
      <GradientDivider mt={12} gradient={1} />
    </Box>
  );
};

export default SectionsHeader;
