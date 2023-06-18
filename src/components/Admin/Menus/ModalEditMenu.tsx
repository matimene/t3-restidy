import { TextInput, LoadingOverlay, Modal, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { type RouterOutputs, api } from "~/utils/api";
import { Row } from "~/components/Primary";
import { LoadingSpinner } from "~/components/Primary/LoadingSpinner";
import BooleanChip from "~/components/Primary/BooleanChip";

type MenuWithSections = RouterOutputs["menus"]["getAll"][number];

const ModalEditMenu = ({
  isOpen,
  onClose,
  id,
}: {
  id: number;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const ctx = api.useContext();
  const { data: menus, isLoading: isLoadingMenus } =
    api.menus.getAll.useQuery();
  const [newBody, setNewBody] = useState<MenuWithSections>();

  const { mutate: editMenu, isLoading: isEditingMenu } =
    api.menus.edit.useMutation({
      onSuccess: () => {
        void ctx.menus.getAll.invalidate();
        onClose();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError;
        window.alert(errorMessage);
      },
    });

  useEffect(() => {
    const menu = menus?.find((item) => item.id === id) as MenuWithSections;
    setNewBody(menu);
  }, [menus, id]);

  if (!newBody) return <LoadingSpinner />;

  const handleEditField = (key: string, value: any) =>
    setNewBody((curr) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      if (curr) return { ...curr, [key]: value };
    });

  const handleEditMenu = () => editMenu(newBody);

  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit menu" centered>
      <LoadingOverlay
        visible={isLoadingMenus || isEditingMenu}
        overlayBlur={2}
        transitionDuration={500}
      />
      <BooleanChip
        value={newBody.active}
        onChange={(value) => handleEditField("active", value)}
      />
      <TextInput
        label="Slug"
        value={newBody?.slug ?? ""}
        onChange={({ target }) => handleEditField("slug", target?.value || "")}
      />
      <TextInput
        label="Name (ENG)"
        value={newBody?.nameEn ?? ""}
        onChange={({ target }) =>
          handleEditField("nameEn", target?.value || "")
        }
      />
      <TextInput
        label="Name (SPA)"
        value={newBody?.nameEs ?? ""}
        onChange={({ target }) =>
          handleEditField("nameEs", target?.value || "")
        }
      />
      <Row justify="center" marginTop={12}>
        <Button
          disabled={isLoadingMenus || isEditingMenu}
          onClick={handleEditMenu}
        >
          Save
        </Button>
      </Row>
    </Modal>
  );
};

export default ModalEditMenu;
