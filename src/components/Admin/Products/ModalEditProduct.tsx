import { TextInput, LoadingOverlay, Modal, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { type Item } from "@prisma/client";
import { Row } from "~/components/Primary";
import { Reload } from "tabler-icons-react";

const ModalEditProduct = ({
  itemId,
  isOpen,
  onClose,
}: {
  itemId: number;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const ctx = api.useContext();
  const { data: product, isLoading: isLoadingProduct } =
    api.items.getOne.useQuery({
      id: itemId,
    });
  const [newBody, setNewBody] = useState<Item>();

  const { mutate: editItem, isLoading: isEditing } = api.items.edit.useMutation(
    {
      onSuccess: (updatedProduct) => {
        setNewBody(updatedProduct);
        void ctx.items.getAll.invalidate();
        onClose();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError;
        window.alert(errorMessage);
      },
    }
  );

  useEffect(() => {
    setNewBody(product);
  }, [product]);

  const handleEditField = (key: string, value: any) =>
    setNewBody((curr) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      if (curr) return { ...curr, [key]: value };
    });

  const handleEditProduct = () => {
    if (newBody) editItem(newBody);
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit product" centered>
      <LoadingOverlay
        visible={isLoadingProduct}
        overlayBlur={2}
        transitionDuration={500}
      />
      <TextInput
        label="SKU"
        value={newBody?.sku || ""}
        onChange={({ target }) => handleEditField("sku", target?.value)}
      />
      <TextInput
        label="Image URL"
        value={newBody?.img || ""}
        onChange={({ target }) =>
          target?.value && handleEditField("img", target?.value)
        }
      />
      <TextInput
        label="Title (ENG)"
        value={newBody?.titleEn || ""}
        onChange={({ target }) => handleEditField("titleEn", target?.value)}
      />
      <TextInput
        label="Title (SPA)"
        value={newBody?.titleEs || ""}
        onChange={({ target }) => handleEditField("titleEs", target?.value)}
      />
      <TextInput
        label="Description (ENG)"
        value={newBody?.descriptionEn || ""}
        onChange={({ target }) =>
          handleEditField("descriptionEn", target?.value)
        }
      />
      <TextInput
        label="Description (SPA)"
        value={newBody?.descriptionEs || ""}
        onChange={({ target }) =>
          handleEditField("descriptionEs", target?.value)
        }
      />
      <TextInput
        label="Category codes"
        value={newBody?.categoryCodes || ""}
        onChange={({ target }) =>
          handleEditField("categoryCodes", target?.value)
        }
      />
      <TextInput
        label="Price"
        type="number"
        value={newBody?.price || ""}
        onChange={({ target }) =>
          handleEditField("price", parseFloat(target?.value))
        }
      />
      <Row justify="center" marginTop={12}>
        <Button uppercase disabled={isEditing} onClick={handleEditProduct}>
          {isEditing ? (
            <Reload size={24} strokeWidth={1.5} color={"white"} />
          ) : (
            "Save"
          )}
        </Button>
      </Row>
    </Modal>
  );
};

export default ModalEditProduct;
