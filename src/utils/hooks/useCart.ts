import useStore from "~/utils/zustand-store";

const useCart = (itemId: number) => {
  const { dispatch } = useStore();
  const handleEditCart = ({
    quantity,
    notes,
  }: {
    quantity: number;
    notes?: string;
  }) => {
    if (quantity === 0) return dispatch.deleteCartItem(itemId);

    const cartItem = {
      itemId,
      quantity,
      notes,
    };
    dispatch.editCartItem(cartItem);
  };

  return { handleEditCart };
};

export default useCart;
