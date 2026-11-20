
import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";

import { cardService } from "../services/card.service";
import type { CardDetails } from "../types/card.types";
import { getCardError } from "../utils/card-error";

type Props = {
  cardId: string;
  onClose: () => void;
  canEdit?: boolean;
};

function toDateTimeLocal(value: string | null): string {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );

  return localDate.toISOString().slice(0, 16);
}

export function CardDetailsModal({
  cardId,
  onClose,
  canEdit = false,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  const titleId = useId();
  const titleInputId = useId();
  const descriptionInputId = useId();
  const dueDateInputId = useId();

  const [card, setCard] = useState<CardDetails | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const [attempt, setAttempt] = useState(0);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const isBusy = isSaving || isArchiving || isDeleting;

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;

    element?.showModal();
    closeButton.current?.focus();

    return () => {
      element?.close();

      if (
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected
      ) {
        previousFocus.focus();
      }
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setIsLoading(true);
    setError(null);
    setSaveError(null);
    setArchiveError(null);
    setDeleteError(null);
    setCard(null);
    setIsEditing(false);
    setIsConfirmingDelete(false);

    void cardService
      .get(cardId, controller.signal)
      .then((result) => {
        if (!active) return;

        setCard(result);
      })
      .catch((failure: unknown) => {
        if (!active) return;

        setError(
          getCardError(
            failure,
            "Não foi possível carregar o cartão. Tente novamente.",
          ),
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [cardId, attempt]);

  function startEditing() {
    if (!card || !canEdit || card.isArchived || isBusy) {
      return;
    }

    setTitle(card.title);
    setDescription(card.description ?? "");
    setDueDate(toDateTimeLocal(card.dueDate ?? null));

    setSaveError(null);
    setArchiveError(null);
    setDeleteError(null);
    setIsConfirmingDelete(false);
    setIsEditing(true);
  }

  function cancelEditing() {
    if (isBusy) return;

    setSaveError(null);
    setIsEditing(false);
  }

  async function saveChanges(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!card || !canEdit || card.isArchived || isBusy) {
      return;
    }

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setSaveError("O título do cartão é obrigatório.");
      return;
    }

    if (normalizedTitle.length > 100) {
      setSaveError("O título deve ter no máximo 100 caracteres.");
      return;
    }

    let normalizedDueDate: string | null = null;

    if (dueDate) {
      const parsedDate = new Date(dueDate);

      if (Number.isNaN(parsedDate.getTime())) {
        setSaveError("Informe uma data de entrega válida.");
        return;
      }

      normalizedDueDate = parsedDate.toISOString();
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await cardService.update(card.id, {
        title: normalizedTitle,
        description,
        dueDate: normalizedDueDate,
      });

      const updatedCard = await cardService.get(card.id);

      setCard(updatedCard);
      setIsEditing(false);
    } catch (failure: unknown) {
      setSaveError(
        getCardError(
          failure,
          "Não foi possível salvar as alterações. Tente novamente.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function archiveCard() {
    if (!card || !canEdit || card.isArchived || isBusy) {
      return;
    }

    setIsArchiving(true);
    setArchiveError(null);

    try {
      await cardService.archive(card.id);
      onClose();
    } catch (failure: unknown) {
      setArchiveError(
        getCardError(
          failure,
          "Não foi possível arquivar o cartão. Tente novamente.",
        ),
      );
    } finally {
      setIsArchiving(false);
    }
  }

  async function deleteCard() {
    if (!card || !canEdit || isBusy || !isConfirmingDelete) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await cardService.delete(card.id);
      onClose();
    } catch (failure: unknown) {
      setDeleteError(
        getCardError(
          failure,
          "Não foi possível excluir o cartão. Tente novamente.",
        ),
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function cancelDelete() {
    if (isBusy) return;

    setIsConfirmingDelete(false);
    setDeleteError(null);
  }

  const displayDueDate = card?.dueDate
    ? new Date(card.dueDate)
    : null;

  return (
    <dialog
      ref={dialog}
      className="modal-backdrop card-details-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();

        if (isBusy) return;

        if (isConfirmingDelete) {
          cancelDelete();
          return;
        }

        onClose();
      }}
    >
      <section className="modal-card">
        <header className="modal-header">
          <h2 id={titleId}>
            {card?.title ?? "Detalhes do cartão"}
          </h2>

          <button
            ref={closeButton}
            type="button"
            className="modal-close-button"
            aria-label="Fechar detalhes do cartão"
            disabled={isBusy}
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div
          className="card-details-content"
          aria-busy={isLoading || isBusy}
        >
          {isLoading && (
            <p className="card-feedback" role="status">
              Carregando cartão...
            </p>
          )}

          {error && (
            <>
              <p className="card-error" role="alert">
                {error}
              </p>

              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setAttempt((value) => value + 1);
                }}
              >
                Tentar novamente
              </button>
            </>
          )}

          {card && !isEditing && (
            <>
              <dl>
                <dt>Lista</dt>
                <dd>{card.list.title}</dd>

                {displayDueDate && (
                  <>
                    <dt>Data de entrega</dt>
                    <dd>
                      {Number.isNaN(displayDueDate.getTime())
                        ? "Data indisponível"
                        : displayDueDate.toLocaleString("pt-BR")}
                    </dd>
                  </>
                )}
              </dl>

              <div>
                <h3>Descrição</h3>
                <p className="card-description">
                  {card.description || "Sem descrição."}
                </p>
              </div>

              {card.isArchived && (
                <p className="card-feedback" role="status">
                  Este cartão está arquivado.
                </p>
              )}

              {archiveError && (
                <p className="card-error" role="alert">
                  {archiveError}
                </p>
              )}

              {!isConfirmingDelete && canEdit && (
                <div>
                  {!card.isArchived && (
                    <>
                      <button
                        type="button"
                        className="secondary-button"
                        disabled={isBusy}
                        onClick={startEditing}
                      >
                        Editar cartão
                      </button>

                      <button
                        type="button"
                        className="secondary-button"
                        disabled={isBusy}
                        onClick={() => void archiveCard()}
                      >
                        {isArchiving
                          ? "Arquivando..."
                          : "Arquivar cartão"}
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    className="secondary-button"
                    disabled={isBusy}
                    onClick={() => {
                      setDeleteError(null);
                      setIsConfirmingDelete(true);
                    }}
                  >
                    Excluir cartão
                  </button>
                </div>
              )}

              {isConfirmingDelete && canEdit && (
                <div
                  className="card-delete-confirmation"
                  role="group"
                  aria-label="Confirmar exclusão do cartão"
                >
                  <h3>Excluir cartão permanentemente?</h3>

                  <p>
                    Esta ação não pode ser desfeita. O cartão
                    será removido permanentemente.
                  </p>

                  {deleteError && (
                    <p className="card-error" role="alert">
                      {deleteError}
                    </p>
                  )}

                  <div>
                    <button
                      type="button"
                      className="secondary-button"
                      disabled={isBusy}
                      onClick={cancelDelete}
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      className="secondary-button"
                      disabled={isBusy}
                      onClick={() => void deleteCard()}
                    >
                      {isDeleting
                        ? "Excluindo..."
                        : "Excluir permanentemente"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {card && isEditing && canEdit && (
            <form
              onSubmit={(event) => void saveChanges(event)}
            >
              <div>
                <label htmlFor={titleInputId}>
                  Título
                </label>

                <input
                  id={titleInputId}
                  type="text"
                  value={title}
                  maxLength={100}
                  required
                  disabled={isBusy}
                  onChange={(event) => {
                    setTitle(event.target.value);
                  }}
                />
              </div>

              <div>
                <label htmlFor={descriptionInputId}>
                  Descrição
                </label>

                <textarea
                  id={descriptionInputId}
                  value={description}
                  rows={5}
                  disabled={isBusy}
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                />
              </div>

              <div>
                <label htmlFor={dueDateInputId}>
                  Data de entrega
                </label>

                <input
                  id={dueDateInputId}
                  type="datetime-local"
                  value={dueDate}
                  disabled={isBusy}
                  onChange={(event) => {
                    setDueDate(event.target.value);
                  }}
                />
              </div>

              {saveError && (
                <p className="card-error" role="alert">
                  {saveError}
                </p>
              )}

              <div>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={isBusy}
                >
                  {isSaving
                    ? "Salvando..."
                    : "Salvar alterações"}
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  disabled={isBusy}
                  onClick={cancelEditing}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </dialog>
  );
}
