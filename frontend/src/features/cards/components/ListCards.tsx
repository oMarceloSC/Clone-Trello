import { useEffect, useRef, useState } from "react";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { cardService } from "../services/card.service";
import type { Card } from "../types/card.types";
import { getCardError } from "../utils/card-error";

import { CreateCardForm } from "./CreateCardForm";
import { CardDetailsModal } from "./CardDetailsModal";
import { SortableCard } from "./SortableCard";
import { CardDropZone } from "./CardDropZone";

type Props = {
  listId: string;
  canCreate: boolean;
  canDrag?: boolean;
  disabled: boolean;
  refreshKey?: number;
};

const byPosition = (left: Card, right: Card) =>
  left.position - right.position ||
  left.id.localeCompare(right.id);

export function ListCards({
  listId,
  canCreate,
  canDrag = false,
  disabled,
  refreshKey = 0,
}: Props) {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(
    null,
  );

  const [selectedCardId, setSelectedCardId] = useState<
    string | null
  >(null);

  // Estados dos cartões arquivados.
  const [showArchived, setShowArchived] = useState(false);
  const [archivedCards, setArchivedCards] = useState<Card[]>([]);
  const [isLoadingArchived, setIsLoadingArchived] =
    useState(false);
  const [archivedError, setArchivedError] = useState<
    string | null
  >(null);
  const [archivedAttempt, setArchivedAttempt] = useState(0);
  const [restoringCardId, setRestoringCardId] = useState<
    string | null
  >(null);
  const [restoreError, setRestoreError] = useState<
    string | null
  >(null);

  const generation = useRef(0);
  const archivedGeneration = useRef(0);
  const pending = useRef(false);
  const restorePending = useRef(false);
  const addButton = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);

  // Carrega os cartões ativos.
  useEffect(() => {
    const request = ++generation.current;
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    void cardService
      .list(listId, controller.signal)
      .then((result) => {
        if (generation.current === request) {
          setCards([...result].sort(byPosition));
        }
      })
      .catch((failure: unknown) => {
        if (generation.current === request) {
          setError(
            getCardError(
              failure,
              "Não foi possível carregar os cartões.",
            ),
          );
        }
      })
      .finally(() => {
        if (generation.current === request) {
          setIsLoading(false);
        }
      });

    return () => {
      generation.current++;
      controller.abort();
    };
  }, [listId, attempt, refreshKey]);

  // Carrega os cartões arquivados somente quando a seção está aberta.
  useEffect(() => {
    const request = ++archivedGeneration.current;

    if (!showArchived) {
      setIsLoadingArchived(false);
      return;
    }

    const controller = new AbortController();

    setIsLoadingArchived(true);
    setArchivedError(null);

    void cardService
      .listArchived(listId, controller.signal)
      .then((result) => {
        if (archivedGeneration.current === request) {
          setArchivedCards([...result].sort(byPosition));
        }
      })
      .catch((failure: unknown) => {
        if (archivedGeneration.current === request) {
          setArchivedError(
            getCardError(
              failure,
              "Não foi possível carregar os cartões arquivados.",
            ),
          );
        }
      })
      .finally(() => {
        if (archivedGeneration.current === request) {
          setIsLoadingArchived(false);
        }
      });

    return () => {
      archivedGeneration.current++;
      controller.abort();
    };
  }, [listId, showArchived, archivedAttempt]);

  // Restaura o foco após fechar o formulário.
  useEffect(() => {
    if (!isFormOpen && restoreFocus.current) {
      addButton.current?.focus();
      restoreFocus.current = false;
    }
  }, [isFormOpen]);

  function closeForm() {
    if (pending.current) return;

    restoreFocus.current = true;
    setIsFormOpen(false);
    setCreateError(null);
  }

  async function createCard(title: string) {
    if (
      !canCreate ||
      disabled ||
      pending.current ||
      isLoading ||
      error
    ) {
      return;
    }

    pending.current = true;
    const request = generation.current;

    setIsCreating(true);
    setCreateError(null);

    try {
      const card = await cardService.create(listId, {
        title,
      });

      if (request !== generation.current) return;

      setCards((current) =>
        [
          ...current.filter((item) => item.id !== card.id),
          card,
        ].sort(byPosition),
      );

      restoreFocus.current = true;
      setIsFormOpen(false);
    } catch (failure: unknown) {
      if (request === generation.current) {
        setCreateError(
          getCardError(
            failure,
            "Não foi possível criar o cartão. Tente novamente.",
          ),
        );
      }
    } finally {
      pending.current = false;

      if (request === generation.current) {
        setIsCreating(false);
      }
    }
  }

  function closeCardDetails() {
    setSelectedCardId(null);
    setAttempt((value) => value + 1);
    setArchivedAttempt((value) => value +1);
  }

  function toggleArchived() {
    if (disabled || restorePending.current) return;

    setRestoreError(null);
    setShowArchived((current) => !current);
  }

  async function restoreCard(cardId: string) {
    if (
      !canCreate ||
      disabled ||
      restorePending.current ||
      isLoadingArchived ||
      archivedError
    ) {
      return;
    }

    restorePending.current = true;
    setRestoringCardId(cardId);
    setRestoreError(null);

    const request = archivedGeneration.current;
    const currentListId = listId;

    try {
      await cardService.restore(cardId);

      // Ignora atualizações caso a lista tenha mudado.
      if (
        archivedGeneration.current !== request ||
        currentListId !== listId
      ) {
        setArchivedAttempt((value) => value + 1);
        setAttempt((value) => value + 1);
        return;
      }

      setArchivedCards((current) =>
        current.filter((card) => card.id !== cardId),
      );

      // Reconsulta os cartões ativos após restaurar.
      setAttempt((value) => value + 1);
    } catch (failure: unknown) {
      setRestoreError(
        getCardError(
          failure,
          "Não foi possível restaurar o cartão.",
        ),
      );
    } finally {
      restorePending.current = false;
      setRestoringCardId(null);
    }
  }

  return (
    <div className="list-cards">
      {isLoading && (
        <p className="card-feedback" role="status">
          Carregando cartões...
        </p>
      )}

      {error && (
        <div>
          <p className="card-error" role="alert">
            {error}
          </p>

          <button
            type="button"
            className="card-add-button"
            disabled={disabled || isLoading || isCreating}
            onClick={() => {
              setAttempt((value) => value + 1);
            }}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <CardDropZone
          listId={listId}
          disabled={!canDrag || disabled}
        >
          <SortableContext
            items={cards.map((card) => `card:${card.id}`)}
            strategy={verticalListSortingStrategy}
            disabled={!canDrag || disabled}
          >
            {cards.length === 0 && (
              <p className="board-list-empty">
                Nenhum cartão nesta lista.
              </p>
            )}

            {cards.map((card) => (
              <SortableCard
                key={card.id}
                card={card}
                disabled={disabled}
                canDrag={canDrag && !disabled}
                onOpen={setSelectedCardId}
              />
            ))}
          </SortableContext>
        </CardDropZone>
      )}

      {canCreate &&
        (isFormOpen ? (
          <CreateCardForm
            isSubmitting={isCreating}
            disabled={
              disabled || isLoading || Boolean(error)
            }
            error={createError}
            onSubmit={createCard}
            onCancel={closeForm}
          />
        ) : (
          <button
            ref={addButton}
            type="button"
            className="card-add-button"
            disabled={
              disabled || isLoading || Boolean(error)
            }
            onClick={() => {
              setCreateError(null);
              setIsFormOpen(true);
            }}
          >
            + Adicionar cartão
          </button>
        ))}

      {/* Seção de cartões arquivados. */}
      <div className="list-archived-section">
        <button
          type="button"
          className="card-add-button"
          aria-expanded={showArchived}
          disabled={disabled || restoringCardId !== null}
          onClick={toggleArchived}
        >
          {showArchived
            ? "− Ocultar cartões arquivados"
            : "▸ Cartões arquivados"}
        </button>

        {showArchived && (
          <div className="list-archived-content">
            {isLoadingArchived && (
              <p className="card-feedback" role="status">
                Carregando cartões arquivados...
              </p>
            )}

            {archivedError && (
              <div>
                <p className="card-error" role="alert">
                  {archivedError}
                </p>

                <button
                  type="button"
                  className="card-add-button"
                  disabled={disabled || isLoadingArchived}
                  onClick={() => {
                    setArchivedAttempt((value) => value + 1);
                  }}
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {!isLoadingArchived && !archivedError && (
              <>
                {archivedCards.length === 0 && (
                  <p className="board-list-empty">
                    Nenhum cartão arquivado nesta lista.
                  </p>
                )}

                {archivedCards.map((card) => (
                  <div
                    key={card.id}
                    className="list-archived-card"
                  >
                    <span>{card.title}</span>

                    {canCreate && (
                      <button
                        type="button"
                        className="card-add-button"
                        disabled={
                          disabled ||
                          restoringCardId !== null
                        }
                        onClick={() => {
                          void restoreCard(card.id);
                        }}
                      >
                        {restoringCardId === card.id
                          ? "Restaurando..."
                          : "Restaurar"}
                      </button>
                    )}
                  </div>
                ))}
              </>
            )}

            {restoreError && (
              <p className="card-error" role="alert">
                {restoreError}
              </p>
            )}
          </div>
        )}
      </div>

      {selectedCardId && (
        <CardDetailsModal
          key={selectedCardId}
          cardId={selectedCardId}
          canEdit={canCreate && !disabled}
          onClose={closeCardDetails}
        />
      )}
    </div>
  );
}
