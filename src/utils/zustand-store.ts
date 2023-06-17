import { create } from "zustand";

export type CartItem = {
  itemId: number;
  quantity: number;
  notes?: string;
};

interface StoreDispatch {
  editCartItem: (cartItem: CartItem) => void;
  cleanCart: () => void;
  deleteCartItem: (id: number) => void;
}

interface StoreState {
  cart: CartItem[];
  dispatch: StoreDispatch;
}

const useStore = create<StoreState>()((set, get) => ({
  cart: [],
  dispatch: {
    editCartItem: (cartItem) => {
      const isInCart = get().cart.find(
        (item) => item.itemId === cartItem.itemId
      );
      set((state) => ({
        cart: isInCart
          ? state.cart.map((item) =>
              item.itemId === cartItem.itemId ? cartItem : item
            )
          : [...state.cart, cartItem],
      }));
    },
    deleteCartItem: (id) =>
      set((state) => ({
        cart: state.cart.filter((item) => item.itemId !== id),
      })),
    cleanCart: () => set({ cart: [] }),
  },
}));

export default useStore;
