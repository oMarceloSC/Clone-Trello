import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { listService } from "../services/list.service";
import type { BoardList } from "../types/list.types";
import { DndContext, MouseSensor, TouchSensor, KeyboardSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent, Announcements } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { SortableListColumn } from "./SortableListColumn";
import { CreateListForm } from "./CreateListForm";
import { DeleteListModal } from "./DeleteListModal";

type BoardListsProps = { boardId: string; canManageLists: boolean };

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    return typeof message === "string" && message.trim() ? message : fallback;
  }
  return "Ocorreu um erro inesperado. Tente novamente.";
}

export function BoardLists(props: BoardListsProps) {
  return <BoardListsContent key={props.boardId} {...props} />;
}

function BoardListsContent({ boardId, canManageLists }: BoardListsProps) {
  const [lists, setLists] = useState<BoardList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const generation = useRef(0);
  const creationPending = useRef(false);
  const updatesPending = useRef(new Set<string>());
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const deletionPending = useRef(false);
  const collection = useRef<HTMLElement>(null);
  const selectedList = lists.find((list) => list.id === selectedListId);
  const [isReordering, setIsReordering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [updatingCount, setUpdatingCount] = useState(0);
  const [reorderError, setReorderError] = useState<string | null>(null);
  const [reorderStatus, setReorderStatus] = useState("");
  const [needsSync, setNeedsSync] = useState(false);
  const reorderPending = useRef(false);
  const dragPending = useRef(false);
  const controlsDisabled = isReordering || isDragging || needsSync;
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const sortingDisabled = !canManageLists || isCreating || isDeleting || isReordering || needsSync || updatingCount > 0 || Boolean(selectedList);
  const announcements: Announcements = {
    onDragStart: ({ active }) => `List ${lists.find((list) => list.id === active.id)?.title ?? ""} selecionada para mover.`,
    onDragOver: ({ over }) => over ? `Posição de destino: ${lists.findIndex((list) => list.id === over.id) + 1} de ${lists.length}.` : "Fora da área de destino.",
    onDragEnd: ({ over }) => over ? "Movimento concluído. Aguarde a confirmação da ordem." : "Movimento cancelado.",
    onDragCancel: () => "Movimento cancelado. A ordem foi preservada.",
  };
  const [previousPermission, setPreviousPermission] = useState(canManageLists);
  if (previousPermission !== canManageLists) {
    setPreviousPermission(canManageLists);
    if (!canManageLists) {
      setSelectedListId(null);
      setIsDragging(false);
    }
  }

  useEffect(() => {
    if (!canManageLists) {
      dragPending.current = false;
    }
  }, [canManageLists]);

  useEffect(() => {
    const requestGeneration = ++generation.current;
    let isActive = true;
    async function loadLists() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await listService.list(boardId);
        if (isActive) setLists([...result].sort((a, b) => a.position - b.position));
      } catch (loadError) {
        if (isActive) setError(getErrorMessage(loadError, "Não foi possível carregar as listas."));
      } finally {
        if (isActive) setIsLoading(false);
      }
    }
    void loadLists();
    return () => {
      isActive = false;
      generation.current = requestGeneration + 1;
    };
  }, [boardId]);

  async function handleCreateList(title: string): Promise<boolean> {
    if (!canManageLists || isLoading || error || creationPending.current || deletionPending.current || reorderPending.current || dragPending.current || needsSync) return false;
    creationPending.current = true;
    const requestGeneration = generation.current;
    setIsCreating(true);
    setCreateError(null);
    try {
      const newList = await listService.create(boardId, { title });
      if (generation.current !== requestGeneration) return false;
      setLists((currentLists) => [...currentLists, newList].sort((a, b) => a.position - b.position));
      setIsCreateFormOpen(false);
      return true;
    } catch (creationError) {
      if (generation.current === requestGeneration) {
        setCreateError(getErrorMessage(creationError, "Não foi possível criar a List."));
      }
      return false;
    } finally {
      if (generation.current === requestGeneration) {
        creationPending.current = false;
        setIsCreating(false);
      }
    }
  }

  async function handleUpdateList(listId: string, title: string): Promise<boolean> {
    if (!canManageLists || isLoading || error || updatesPending.current.has(listId) || deletionPending.current || reorderPending.current || dragPending.current || needsSync) return false;
    const currentList = lists.find((list) => list.id === listId);
    if (!currentList) return false;
    if (currentList.title === title) return true;

    updatesPending.current.add(listId);
    setUpdatingCount(updatesPending.current.size);
    const requestGeneration = generation.current;
    try {
      const updatedList = await listService.update(listId, { title });
      if (generation.current !== requestGeneration) return false;
      setLists((currentLists) => currentLists.map((list) => list.id === listId ? updatedList : list));
      return true;
    } catch (updateError) {
      if (generation.current !== requestGeneration) return false;
      throw new Error(getErrorMessage(updateError, "Não foi possível salvar o título da List. Tente novamente."), { cause: updateError });
    } finally {
      if (generation.current === requestGeneration) {
        updatesPending.current.delete(listId);
        setUpdatingCount(updatesPending.current.size);
      }
    }
  }

  function openDeleteModal(listId: string) {
    if (!canManageLists || deletionPending.current || reorderPending.current || dragPending.current || needsSync || !lists.some((list) => list.id === listId && list.boardId === boardId)) return;
    setSelectedListId(listId);
    setDeleteError(null);
    setDeleteSuccess(null);
  }

  function closeDeleteModal() {
    if (deletionPending.current) return;
    setSelectedListId(null);
    setDeleteError(null);
  }

  async function handleDeleteList() {
    if (!canManageLists || !selectedList || selectedList.boardId !== boardId || deletionPending.current || reorderPending.current || dragPending.current || needsSync) return;
    if (creationPending.current || updatesPending.current.size > 0) {
      setDeleteError("Aguarde a criação ou edição em andamento e tente novamente.");
      return;
    }
    const listId = selectedList.id;
    const requestGeneration = generation.current;
    deletionPending.current = true;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await listService.delete(listId);
      if (generation.current !== requestGeneration) return;
      // O backend preserva a ordem e renumera as posições a partir de zero.
      setLists((currentLists) => currentLists.filter((list) => list.id !== listId)
        .map((list, position) => ({ ...list, position })));
      setSelectedListId(null);
      setDeleteSuccess("List excluída com sucesso.");
    } catch (deletionError) {
      if (generation.current === requestGeneration) {
        setDeleteError(getErrorMessage(deletionError, "Não foi possível excluir a List. Tente novamente."));
      }
    } finally {
      if (generation.current === requestGeneration) {
        deletionPending.current = false;
        setIsDeleting(false);
      }
    }
  }

  async function reconcileLists(requestGeneration: number) {
    const confirmed = await listService.list(boardId);
    if (generation.current !== requestGeneration) return;
    setLists([...confirmed].sort((a, b) => a.position - b.position));
    setNeedsSync(false);
  }

  async function retrySync() {
    if (reorderPending.current) return;
    reorderPending.current = true;
    setIsReordering(true);
    const requestGeneration = generation.current;
    try {
      await reconcileLists(requestGeneration);
      if (generation.current === requestGeneration) setReorderError("Lists sincronizadas. Confira a ordem antes de tentar novamente.");
    } catch {
      if (generation.current === requestGeneration) setReorderError("Não foi possível sincronizar as Lists. Tente novamente.");
    } finally {
      if (generation.current === requestGeneration) {
        reorderPending.current = false;
        setIsReordering(false);
      }
    }
  }

  async function handleDragEnd({ active, over }: DragEndEvent) {
    const wasDragging = dragPending.current;
    dragPending.current = false;
    setIsDragging(false);
    if (!wasDragging || !canManageLists || !over || active.id === over.id || reorderPending.current || creationPending.current || deletionPending.current || updatesPending.current.size || needsSync) return;
    const from = lists.findIndex((list) => list.id === active.id);
    const to = lists.findIndex((list) => list.id === over.id);
    if (from < 0 || to < 0) return;
    const previousLists = lists;
    const nextLists = arrayMove(lists, from, to).map((list, position) => ({ ...list, position }));
    const requestGeneration = generation.current;
    reorderPending.current = true;
    setIsReordering(true);
    setReorderError(null);
    setReorderStatus("Salvando ordem das Lists...");
    setLists(nextLists);
    try {
      const confirmed = await listService.reorder(boardId, { listIds: nextLists.map((list) => list.id) });
      if (generation.current !== requestGeneration) return;
      setLists([...confirmed].sort((a, b) => a.position - b.position));
      setReorderStatus("Ordem das Lists salva com sucesso.");
    } catch (reorderFailure) {
      if (generation.current !== requestGeneration) return;
      setLists(previousLists);
      setReorderStatus("");
      setReorderError(getErrorMessage(reorderFailure, "Não foi possível salvar a ordem das Lists."));
      // Uma falha de rede pode ocorrer depois de o servidor confirmar o PATCH.
      try {
        await reconcileLists(requestGeneration);
        if (generation.current === requestGeneration) setReorderError("Não foi possível confirmar o movimento. As Lists foram sincronizadas com o servidor; confira a ordem.");
      } catch {
        if (generation.current === requestGeneration) {
          setNeedsSync(true);
          setReorderError("Não foi possível confirmar a ordem. A ordem anterior foi restaurada localmente. Sincronize as Lists para continuar.");
        }
      }
    } finally {
      if (generation.current === requestGeneration) {
        reorderPending.current = false;
        setIsReordering(false);
      }
    }
  }

  if (isLoading) return <p className="board-list-empty" role="status">Carregando listas...</p>;
  if (error) return <p className="create-list-error" role="alert">{error}</p>;

  return (
    <div className="board-lists-container">
      <p className="edit-list-status" role="status">{deleteSuccess}</p>
      <p className="edit-list-status" role="status">{reorderStatus}</p>
      {reorderError && <p className="create-list-error" role="alert">{reorderError}</p>}
      {needsSync && <button type="button" className="secondary-button" disabled={isReordering}
        onClick={() => { void retrySync(); }}>Sincronizar Lists</button>}
      {canManageLists && createError && <p className="create-list-error" role="alert">{createError}</p>}
      <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToHorizontalAxis]}
        accessibility={{ announcements, screenReaderInstructions: { draggable: "Para mover uma List, pressione Espaço ou Enter. Use as setas para a esquerda e direita. Pressione Espaço ou Enter para soltar, ou Escape para cancelar." } }}
        onDragStart={() => {
          if (sortingDisabled || creationPending.current || deletionPending.current || updatesPending.current.size || reorderPending.current) return;
          dragPending.current = true;
          setIsDragging(true);
          setReorderError(null);
          setReorderStatus("");
        }}
        onDragCancel={() => { dragPending.current = false; setIsDragging(false); }}
        onDragEnd={(event) => { void handleDragEnd(event); }}>
      <SortableContext items={lists.map((list) => list.id)} strategy={horizontalListSortingStrategy}>
      <section ref={collection} tabIndex={-1} className="board-lists-columns" aria-label="Listas do Board" aria-busy={isReordering}>
        {lists.length === 0 && (
          <div className="board-lists-empty">
            <div className="board-lists-empty-icon" aria-hidden="true">L</div>
            <h3>Nenhuma List disponível</h3>
            <p>Este Board ainda não possui listas.</p>
          </div>
        )}
        {lists.map((list) => (
          <SortableListColumn key={list.id} list={list} canEdit={canManageLists} onUpdate={handleUpdateList}
            isDeleting={isDeleting} onDelete={openDeleteModal} controlsDisabled={controlsDisabled} sortingDisabled={sortingDisabled} />
        ))}
        {canManageLists && (
          <div className="board-list-create-column">
            {isCreateFormOpen ? (
              <CreateListForm
                isSubmitting={isCreating || isDeleting || controlsDisabled}
                onSubmit={handleCreateList}
                onCancel={() => {
                  if (creationPending.current || deletionPending.current || reorderPending.current || dragPending.current) return;
                  setIsCreateFormOpen(false);
                  setCreateError(null);
                }}
              />
            ) : (
              <button type="button" className="board-list-add-button" disabled={isDeleting || controlsDisabled} onClick={() => {
                setCreateError(null);
                setIsCreateFormOpen(true);
              }}>+ Adicionar outra List</button>
            )}
          </div>
        )}
      </section>
      </SortableContext>
      </DndContext>
      {canManageLists && selectedList && (
        <DeleteListModal list={selectedList} isDeleting={isDeleting} error={deleteError}
          onCancel={closeDeleteModal} onConfirm={() => { void handleDeleteList(); }} fallbackFocus={collection} />
      )}
    </div>
  );
}
