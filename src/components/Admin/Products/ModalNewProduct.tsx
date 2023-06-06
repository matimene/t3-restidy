import { LoadingOverlay, Modal } from "@mantine/core";
import { api } from "~/utils/api";
import { type Item } from "@prisma/client";
import ProductForm from "./ProductForm";

const ModalNewProduct = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const ctx = api.useContext();

  const { mutate: createItem, isLoading } = api.items.create.useMutation({
    onSuccess: () => {
      void ctx.items.getAll.invalidate();
      onClose();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError;
      window.alert(errorMessage);
    },
  });

  const handleEditProduct = (newBody: Item) => newBody && createItem(newBody);

  return (
    <Modal opened={isOpen} onClose={onClose} title="New product" centered>
      <LoadingOverlay
        visible={isLoading}
        overlayBlur={2}
        transitionDuration={500}
      />
      <ProductForm
        disabled={isLoading}
        onSubmit={handleEditProduct}
        submitLabel="Create"
      />
    </Modal>
  );
};

export default ModalNewProduct;
