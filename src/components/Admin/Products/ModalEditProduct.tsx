import { LoadingOverlay, Modal } from "@mantine/core";
import { api } from "~/utils/api";
import { type Item } from "@prisma/client";
import ProductForm from "./ProductForm";

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

  const { mutate: editItem, isLoading: isLoadingMutation } =
    api.items.edit.useMutation({
      onSuccess: () => {
        void ctx.items.getAll.invalidate();
        onClose();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError;
        window.alert(errorMessage);
      },
    });

  const handleEditProduct = (newBody: Item) => newBody && editItem(newBody);

  return (
    <Modal
      size="xl"
      opened={isOpen}
      onClose={onClose}
      title="Edit product"
      centered
    >
      <LoadingOverlay
        visible={isLoadingProduct || isLoadingMutation}
        overlayBlur={2}
        transitionDuration={500}
      />
      <ProductForm
        submitLabel="Save changes"
        disabled={isLoadingProduct || isLoadingMutation}
        defaultValues={product}
        onSubmit={handleEditProduct}
      />
    </Modal>
  );
};

export default ModalEditProduct;
