import { useEffect, useId, useRef } from "react";
import type { RefObject } from "react";
import type { BoardList } from "../types/list.types";

type DeleteListModalProps = {
  list: BoardList;
  isDeleting: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
  fallbackFocus: RefObject<HTMLElement | null>;
};

export function DeleteListModal({ list, isDeleting, error, onCancel, onConfirm, fallbackFocus }: DeleteListModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const fallbackElement = fallbackFocus.current;
    element?.showModal();
    cancelButton.current?.focus();
    return () => {
      element?.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
      else if (fallbackElement?.isConnected) fallbackElement.focus();
    };
  }, [fallbackFocus]);

  useEffect(() => {
    if (isDeleting) dialog.current?.focus();
    else cancelButton.current?.focus();
  }, [isDeleting]);

  return (
    <dialog ref={dialog} className="modal-backdrop delete-list-dialog" tabIndex={-1}
      aria-labelledby={titleId} aria-describedby={descriptionId} aria-modal="true"
      aria-busy={isDeleting}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (!first) {
          event.preventDefault();
          event.currentTarget.focus();
        } else if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === event.currentTarget)) {
          event.preventDefault();
          first.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        if (!isDeleting) onCancel();
      }}>
      <div className="modal-card">
        <header className="modal-header">
          <h2 id={titleId}>Excluir List</h2>
          <button type="button" className="modal-close-button" aria-label="Fechar modal"
            disabled={isDeleting} onClick={onCancel}>×</button>
        </header>
        <div className="delete-board-content">
          <div className="delete-board-warning" id={descriptionId}>
            <strong>Você está prestes a excluir:</strong>
            <span className="delete-list-name">{list.title}</span>
            <p>A exclusão desta List é permanente e não poderá ser desfeita.</p>
          </div>
          {error && <div className="api-error" role="alert">{error}</div>}
          {isDeleting && <p className="edit-list-status" role="status">Excluindo List...</p>}
          <footer className="modal-actions">
            <button ref={cancelButton} type="button" className="secondary-button"
              disabled={isDeleting} onClick={onCancel}>Cancelar</button>
            <button type="button" className="danger-button" disabled={isDeleting} onClick={onConfirm}>
              {isDeleting ? "Excluindo..." : "Excluir definitivamente"}
            </button>
          </footer>
        </div>
      </div>
    </dialog>
  );
}
