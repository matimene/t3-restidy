export type ParsedCategory = {
  name: string;
  code: string;
};

export type CartItem = {
  itemId: number;
  qty: number;
  notes?: string;
};
