import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import type { BoardList } from "../types/list.types";

type ListColumnProps = {
  list: BoardList;
  canEdit: boolean;
  onUpdate: (listId: string, title: string) => Promise<boolean>;
  isDeleting: boolean;
  onDelete: (listId: string) => void;
  dragHandle?: ReactNode;
  controlsDisabled?: boolean;
};

export function ListColumn({ list, canEdit, onUpdate, isDeleting, onDelete, dragHandle, controlsDisabled = false }: ListColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = useRef(false);
  const active = useRef(false);
  const restoreFocus = useRef(false);
  const editButton = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const errorId = useId();

  useEffect(() => {
    active.current = true;
    return () => { active.current = false; };
  }, []);

  useEffect(() => {
    if (isEditing && canEdit && !isSubmitting) input.current?.focus();
    else if (!isEditing && restoreFocus.current) {
      editButton.current?.focus();
      restoreFocus.current = false;
    }
  }, [isEditing, canEdit, isSubmitting]);

  function closeEditor() {
    if (pending.current) return;
    restoreFocus.current = true;
    setIsEditing(false);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canEdit || pending.current || isDeleting || controlsDisabled) return;
    const normalizedTitle = title.trim();
    if (!normalizedTitle || normalizedTitle.length > 100) {
      setError(!normalizedTitle ? "Informe o título da List." : "O título da List deve ter no máximo 100 caracteres.");
      input.current?.focus();
      return;
    }
    if (normalizedTitle === list.title) {
      closeEditor();
      return;
    }
    pending.current = true;
    setIsSubmitting(true);
    setError(null);
    try {
      const success = await onUpdate(list.id, normalizedTitle);
      if (active.current && success) {
        restoreFocus.current = true;
        setIsEditing(false);
      }
    } catch (updateError) {
      if (active.current) setError(updateError instanceof Error ? updateError.message : "Não foi possível salvar o título da List. Tente novamente.");
    } finally {
      pending.current = false;
      if (active.current) setIsSubmitting(false);
    }
  }

  return (
    <div className="board-list-column">
      <div className="board-list-header">
        {!isEditing && dragHandle}
        {isEditing && canEdit ? (
          <form className="edit-list-form" aria-busy={isSubmitting}
            onSubmit={(event) => { void handleSubmit(event); }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closeEditor();
              }
            }}>
            <label className="create-list-label" htmlFor={titleId}>Título da List</label>
            <input ref={input} id={titleId} className="create-list-input" type="text"
              value={title} maxLength={100} disabled={isSubmitting || controlsDisabled}
              aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined}
              onChange={(event) => { setTitle(event.target.value); setError(null); }} />
            {error && <p id={errorId} className="create-list-error" role="alert">{error}</p>}
            <div className="create-list-actions">
              <button className="primary-button" type="submit" disabled={isSubmitting || controlsDisabled}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </button>
              <button className="secondary-button" type="button" disabled={isSubmitting} onClick={closeEditor}>Cancelar</button>
            </div>
            {isSubmitting && <span className="edit-list-status" role="status">Salvando título...</span>}
          </form>
        ) : (
          <>
            <h3 className="board-list-title">{list.title}</h3>
            {canEdit && <div className="board-list-header-actions">
              <button ref={editButton} type="button" className="board-list-edit-button" disabled={isDeleting || controlsDisabled}
              aria-label={`Editar título da List ${list.title}`} onClick={() => {
                setTitle(list.title);
                setError(null);
                setIsEditing(true);
              }}>Editar</button>
              <button type="button" className="board-list-edit-button board-list-delete-button"
                aria-label={`Excluir List ${list.title}`} disabled={isSubmitting || isDeleting || controlsDisabled}
                onClick={() => onDelete(list.id)}>Excluir</button>
            </div>}
          </>
        )}
      </div>

      <div className="board-list-content">
        <p className="board-list-empty">
          Nenhum cartão nesta lista.
        </p>
      </div>
    </div>
  );
}
