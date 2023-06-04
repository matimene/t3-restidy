import { TextInput, LoadingOverlay, Modal, Button, Input } from "@mantine/core";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { type Category } from "@prisma/client";
import { Row } from "~/components/Primary";
import { ChevronDown } from "tabler-icons-react";
import { useId } from "@mantine/hooks";

const ModalEditCategory = ({
  itemId,
  isOpen,
  onClose,
}: {
  itemId: number;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const id = useId();
  const ctx = api.useContext();
  const { data: category, isLoading: isLoadingCategory } =
    api.categories.getOne.useQuery({
      id: itemId,
    });
  const { data: categories } = api.categories.getAll.useQuery();
  const [newBody, setNewBody] = useState<Category>();

  const { mutate: editCategory, isLoading: isLoadingMutation } =
    api.categories.edit.useMutation({
      onSuccess: (updatedCategory) => {
        setNewBody(updatedCategory);
        void ctx.categories.getAll.invalidate();
        onClose();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError;
        window.alert(errorMessage);
      },
    });

  useEffect(() => {
    setNewBody(category);
  }, [category]);

  const handleEditField = (key: string, value: any) =>
    setNewBody((curr) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      if (curr) return { ...curr, [key]: value };
    });

  const handleEditCategory = () => {
    if (newBody) editCategory(newBody);
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit category" centered>
      <LoadingOverlay
        visible={isLoadingCategory || isLoadingMutation}
        overlayBlur={2}
        transitionDuration={500}
      />
      <TextInput
        label="Order"
        value={newBody?.order}
        type="number"
        onChange={({ target }) =>
          handleEditField("order", parseInt(target?.value))
        }
      />
      <TextInput
        label="Name (ENG)"
        value={newBody?.nameEn || ""}
        onChange={({ target }) =>
          target?.value && handleEditField("nameEn", target?.value)
        }
      />
      <TextInput
        label="Name (SPA)"
        value={newBody?.nameEs || ""}
        onChange={({ target }) => handleEditField("nameEs", target?.value)}
      />
      <Input.Wrapper id={id} label="Parent">
        <Input
          component="select"
          rightSection={<ChevronDown size={14} stroke="1.5" />}
        >
          {categories
            ?.filter((item) => item.id !== category?.id)
            .map((cat) => {
              return (
                <option key={cat.id} value={cat.id}>{`${cat.code} (${
                  cat?.nameEn || cat.nameEs || ""
                })`}</option>
              );
            })}
        </Input>
      </Input.Wrapper>
      <Row justify="center" marginTop={12}>
        <Button
          uppercase
          disabled={isLoadingMutation}
          onClick={handleEditCategory}
        >
          Save
        </Button>
      </Row>
    </Modal>
  );
};

export default ModalEditCategory;
