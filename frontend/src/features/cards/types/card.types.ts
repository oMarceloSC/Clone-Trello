
export type Card = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  isArchived: boolean;
  dueDate: string | null;
  listId: string;
  createdAt: string;
  updatedAt: string;
};

export type CardDetails = Card & {
  list: { id: string; title: string; boardId: string };
};

export type CreateCardInput = { title: string };
export type CreateCardResponse = { message: string; card: Card };
export type ListCardsResponse = { cards: Card[] };
export type GetCardResponse = { card: CardDetails };