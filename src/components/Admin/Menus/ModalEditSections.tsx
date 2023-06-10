import {
  LoadingOverlay,
  Modal,
  Button,
  Text,
  MultiSelect,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { type RouterOutputs, api } from "~/utils/api";
import { Row } from "~/components/Primary";
import { type MenuSections } from "@prisma/client";
import { LoadingSpinner } from "~/components/Primary/LoadingSpinner";
import { Edit, Trash } from "tabler-icons-react";
import { toast } from "react-hot-toast";

type MenuWithSections = RouterOutputs["menus"]["getAll"][number];
type NewMenuSections = Omit<MenuSections, "id"> & { id?: number };

const Section = ({
  item,
  isNew,
  onEdit,
  onDelete,
}: {
  item: MenuSections | NewMenuSections;
  isNew: boolean;
  onEdit(section: MenuSections | NewMenuSections): void;
  onDelete(): void;
}) => {
  const [isEditingProps, setIsEditingProps] = useState(isNew);
  const itemIds = item?.itemIds?.split(";") || [];

  const { data: products, isLoading: isLoadingProducts } =
    api.items.getAll.useQuery();
  const productsData = products?.map((item) => ({
    label: `${item.sku} (${item?.titleEn ?? ""})`,
    value: item.id.toString(),
  }));

  const handleEditField = (key: string, value: any) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    onEdit({ ...item, [key]: value });

  const handlePopDeleteToast = () => {
    toast(
      (t) => (
        <div>
          <div style={{ textAlign: "center" }}>
            Are you sure you want to delete section{" "}
            <b>{item.nameEn?.toUpperCase()}</b>
          </div>
          <Row gap={12} justify="center" marginTop={12}>
            <Button onClick={() => toast.dismiss(t.id)}>Cancel</Button>
            <Button
              onClick={() => {
                onDelete();
                toast.dismiss(t.id);
              }}
              color="red"
            >
              Delete
            </Button>
          </Row>
        </div>
      ),
      {
        position: "top-center",
        duration: 60000,
      }
    );
  };

  if (!productsData || isLoadingProducts) return <LoadingSpinner />;

  return (
    <div style={{ overflow: "visible", marginBottom: 24 }}>
      <Row justify="center" align="center" gap={12} marginBottom={12}>
        <Button
          variant="outline"
          compact
          onClick={() => setIsEditingProps(!isEditingProps)}
        >
          <Text size={12} weight={600} transform="uppercase" mr={6}>
            {item?.nameEn}
          </Text>
          <Edit />
        </Button>
        {!isNew && (
          <Button compact onClick={handlePopDeleteToast} color="red">
            <Trash size={20} />
          </Button>
        )}
      </Row>
      {isEditingProps && (
        <div style={{ marginBottom: 12 }}>
          <Row gap={12}>
            <TextInput
              label="Order"
              value={item?.order}
              onChange={({ target }) =>
                handleEditField("order", parseInt(target?.value) || 0)
              }
            />
            <TextInput
              label="Image URL"
              value={item?.img ?? ""}
              onChange={({ target }) =>
                handleEditField("img", target?.value || "")
              }
            />
          </Row>
          <TextInput
            label="Name (ENG)"
            value={item?.nameEn ?? ""}
            onChange={({ target }) =>
              handleEditField("nameEn", target?.value || "")
            }
          />
          <TextInput
            label="Name (SPA)"
            value={item?.nameEs ?? ""}
            onChange={({ target }) =>
              handleEditField("nameEs", target?.value || "")
            }
          />
        </div>
      )}
      <MultiSelect
        data={productsData}
        limit={20}
        searchable
        dropdownPosition="bottom"
        placeholder="Pick products"
        value={itemIds}
        onChange={(ids) => handleEditField("itemIds", ids.join(";"))}
      />
    </div>
  );
};

const ModalEditSections = ({
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
  const menu = menus?.find((item) => item.id === id) as MenuWithSections;
  const [menuSections, setMenuSections] = useState<
    NewMenuSections[] | MenuSections[]
  >(menu.sections);
  const { mutate: createSection } = api.menus.createSection.useMutation({
    onError: (e) => {
      const errorMessage = e.data?.zodError;
      window.alert(errorMessage);
    },
  });
  const { mutate: editSection } = api.menus.editSection.useMutation({
    onError: (e) => {
      const errorMessage = e.data?.zodError;
      window.alert(errorMessage);
    },
  });
  const { mutate: deleteSection } = api.menus.deleteSection.useMutation({
    onSuccess: () => {
      void ctx.menus.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError;
      window.alert(errorMessage);
    },
  });

  const handleAddSection = () =>
    setMenuSections((curr) => [
      ...curr,
      {
        nameEn: "New section",
        menuId: id,
        order: 99,
        itemIds: "",
        nameEs: "",
        img: "",
      },
    ]);

  const handleEditSection = (
    section: MenuSections | NewMenuSections,
    index: number
  ) =>
    setMenuSections((curr) =>
      curr.map((item, i) => (i === index ? section : item))
    );

  const handleSaveSections = () => {
    menuSections.map((section) => {
      if (!section?.id) createSection(section);
      else editSection(section as MenuSections);
    });
    void ctx.menus.getAll.invalidate();
    onClose();
  };

  if (!menu) return <LoadingSpinner />;

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={`'${menu?.nameEn || "Menu"}' sections`}
      centered
      styles={{ content: { overflow: "visible" } }}
    >
      <LoadingOverlay
        visible={isLoadingMenus}
        overlayBlur={2}
        transitionDuration={500}
      />
      {/* {menu.sections?.map((section) => (
        <Section key={section.id} item={section} isNew={false} />
      ))} */}
      {menuSections?.map((section, index) => (
        <Section
          key={`section-${index}`}
          item={section}
          isNew={!section?.id}
          onEdit={(section: MenuSections | NewMenuSections) =>
            handleEditSection(section, index)
          }
          onDelete={() => section?.id && deleteSection({ id: section.id })}
        />
      ))}
      <Row justify="center" marginTop={24} gap={12}>
        <Button
          disabled={isLoadingMenus}
          fullWidth
          color={"green.8"}
          onClick={handleAddSection}
        >
          New section
        </Button>
        <Button
          disabled={isLoadingMenus}
          fullWidth
          onClick={handleSaveSections}
        >
          Save
        </Button>
      </Row>
    </Modal>
  );
};

export default ModalEditSections;
