import { createStyles, rem, Button, Table, Text, Popover } from "@mantine/core";
import { api } from "~/utils/api";
import { Edit, Reload } from "tabler-icons-react";
import { ActionsContainer, Row } from "~/components/Primary";
import { LoadingSpinner } from "~/components/Primary/LoadingSpinner";
import { useDisclosure } from "@mantine/hooks";
import ModalEditMenu from "./ModalEditMenu";
import { useState } from "react";
import ModalEditSections from "./ModalEditSections";

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
  const [editingId, setEditingId] = useState<number | null>();
  const [opened, { open, close }] = useDisclosure(false);
  const [openedSections, { open: openSections, close: closeSections }] =
    useDisclosure(false);

  const ctx = api.useContext();
  const { data: menus, isLoading } = api.menus.getAll.useQuery();
  const { mutate: createMenu, isLoading: isCreatingMenu } =
    api.menus.create.useMutation({
      onSuccess: () => {
        void ctx.menus.getAll.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError;
        window.alert(errorMessage);
      },
    });

  const handleEditMenu = (id: number) => {
    setEditingId(id);
    open();
  };
  const handleEditSections = (id: number) => {
    setEditingId(id);
    openSections();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Row align="center" justify="center">
        <Text>Menus</Text>
      </Row>
      <div className={classes.filterContainer}>
        <Row>
          <Button
            disabled={isLoading || isCreatingMenu}
            onClick={() => void ctx.menus.getAll.invalidate()}
          >
            <Reload size={24} strokeWidth={1.5} color={"white"} />
          </Button>
        </Row>
        <Row>
          {menus || []?.length >= 2 ? (
            <Popover width={200} position="bottom" withArrow shadow="md">
              <Popover.Target>
                <Button disabled={isLoading || isCreatingMenu}>
                  Create new
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Text size="sm">You can only have 2 menus created at max.</Text>
              </Popover.Dropdown>
            </Popover>
          ) : (
            <Button
              disabled={isLoading || isCreatingMenu}
              onClick={() => createMenu({})}
            >
              Create new
            </Button>
          )}
        </Row>
      </div>
      <div className={classes.container}>
        <Table>
          <thead>
            <tr>
              <th>Active</th>
              <th>Name (ENG)</th>
              <th>Name (SPA)</th>
              <th>Sections</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menus?.map((item) => (
              <tr key={item.id} style={{ opacity: item.active ? 1 : 0.7 }}>
                <td>{item.active ? "Active" : "Disabled"}</td>
                <td>{item.nameEn}</td>
                <td>{item.nameEs}</td>
                <td>
                  {item.sections
                    ?.map(
                      (menuSection) =>
                        `${menuSection?.nameEn ?? ""} (${
                          menuSection?.itemIds?.split(";")?.length ?? 0
                        })`
                    )
                    .join(", ") || "NONE"}
                </td>
                <td>
                  <ActionsContainer>
                    <Button onClick={() => handleEditMenu(item.id)}>
                      <Edit size={24} strokeWidth={1.5} color={"white"} />
                      Menu
                    </Button>
                    <Button onClick={() => handleEditSections(item.id)}>
                      <Edit size={24} strokeWidth={1.5} color={"white"} />
                      Sections
                    </Button>
                  </ActionsContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {editingId && opened && (
        <ModalEditMenu isOpen={opened} onClose={close} id={editingId} />
      )}
      {editingId && openedSections && (
        <ModalEditSections
          isOpen={openedSections}
          onClose={closeSections}
          id={editingId}
        />
      )}
    </>
  );
};
export default Menus;
