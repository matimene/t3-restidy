import useStore from "~/utils/zustand-store";

const useCart = (itemId: number) => {
  const { cart, dispatch } = useStore();
  const handleEditCart = ({
    quantity,
    notes,
  }: {
    quantity?: number;
    notes?: string;
  }) => {
    if (quantity === 0) return dispatch.deleteCartItem(itemId);

    const existingItem = cart.find((item) => item.itemId === itemId);
    const cartItem = {
      itemId,
      quantity: quantity || existingItem?.quantity || 1,
      notes,
    };
    dispatch.editCartItem(cartItem);
  };

  return { handleEditCart };
};

export default useCart;
