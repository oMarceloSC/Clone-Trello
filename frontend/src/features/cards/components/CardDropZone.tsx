import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

type CardDropZoneProps = {
    listId: string;
    disabled: boolean;
    children: ReactNode;
};

export function CardDropZone({
    listId,
    disabled,
    children,
}: CardDropZoneProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: `card-list:${listId}`,
        disabled,
        data: {
            type: "card-list",
            listId,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={`card-drop-zone${
                isOver ? " is-drop-target" : ""
            }`}
            data-list-id={listId}
        >
            {children}
        </div>
    );
}