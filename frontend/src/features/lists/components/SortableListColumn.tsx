import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ComponentProps } from "react";
import { ListColumn } from "./ListColumn";

type Props = ComponentProps<typeof ListColumn> & { sortingDisabled: boolean };

export function SortableListColumn({ sortingDisabled, ...props }: Props) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging, isOver } = useSortable({
    id: props.list.id,
    disabled: sortingDisabled,
  });
  return (
    <div ref={setNodeRef}
      className={`board-list-sortable${isDragging ? " is-dragging" : ""}${isOver && !isDragging ? " is-drop-target" : ""}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}>
      <ListColumn {...props} dragHandle={props.canEdit ? (
        <button ref={setActivatorNodeRef} type="button" className="board-list-drag-handle"
          {...attributes} {...listeners} disabled={sortingDisabled}
          aria-label={`Mover List ${props.list.title}`} title="Arraste para mover ou use Espaço e as setas">⠿</button>
      ) : undefined} />
    </div>
  );
}
