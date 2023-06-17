import { Button, Group, Text, Collapse, Box, Divider } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type RouterOutputs } from "~/utils/api";
import { ChevronDown, ChevronUp } from "tabler-icons-react";
import { Row } from "../Primary";
import { useRouter } from "next/router";

type MenuWithSections = RouterOutputs["menus"]["getAll"][number];

const SectionsHeader = ({
  menu,
  isLoading,
}: {
  menu: MenuWithSections;
  isLoading: boolean;
}) => {
  const router = useRouter();
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Box w="100%" mx="auto">
      <Row mr={24} ml={24} justify="space-between" onClick={toggle}>
        <Text transform="uppercase" size={18}>
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
            onClick={() =>
              void router.push(`/menu/${menu.slug}/${section.slug}`)
            }
          >
            {section?.nameEn}
          </Text>
        ))}
      </Collapse>
      <Divider size="md" mt={12} />
    </Box>
  );
};

export default SectionsHeader;
