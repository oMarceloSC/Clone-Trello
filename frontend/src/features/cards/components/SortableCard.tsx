
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Card } from "../types/card.types";

type SortableCardProps = {
  card: Card;
  disabled: boolean;
  canDrag: boolean;
  onOpen: (cardId: string) => void;
};

export function SortableCard({
  card,
  disabled,
  canDrag,
  onOpen,
}: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: `card:${card.id}`,
    disabled: !canDrag || disabled,
    data: {
      type: "card",
      cardId: card.id,
      listId: card.listId,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`board-card-sortable${
        isDragging ? " is-dragging" : ""
      }${
        isOver && !isDragging ? " is-drop-target" : ""
      }`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="board-card-sortable-content">
        <button
          type="button"
          className="board-card"
          aria-haspopup="dialog"
          disabled={disabled}
          onClick={() => onOpen(card.id)}
        >
          {card.title}
        </button>

        {canDrag && !disabled && (
          <button
            ref={setActivatorNodeRef}
            type="button"
            className="board-card-drag-handle"
            {...attributes}
            {...listeners}
            aria-label={`Mover cartão ${card.title}`}
            title="Arraste para mover o cartão"
          >
            ⠿
          </button>
        )}
      </div>
    </div>
  );
}