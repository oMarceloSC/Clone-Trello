import { useState } from "react";
import type { FormEvent } from "react";

type CreateListFormProps = {
    isSubmitting: boolean;
    onSubmit: (title: string) => Promise<boolean>;
    onCancel: () => void;
};

export function CreateListForm({
    isSubmitting,
    onSubmit,
    onCancel,
}: CreateListFormProps) {
    const [title, setTitle] = useState("");
    const [validationError, setValidationError] =
        useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        const normalizedTitle = title.trim();

        if (!normalizedTitle) {
            setValidationError("Informe o título da List.");
            return;
        }

        if (normalizedTitle.length > 100) {
            setValidationError("O título da List deve ter no máximo 100 caracteres.");
            return;
        }

        setValidationError(null);

        const success = await onSubmit(normalizedTitle);

        if (success) {
            setTitle("");
        }
    }

    return (
        <form
            className="create-list-form"
            aria-busy={isSubmitting}
            onSubmit={(event) => {
                void handleSubmit(event);
            }}
        >
            <label
                className="create-list-label"
                htmlFor="create-list-title"
            >
                Título da List
            </label>

            <input
                id="create-list-title"
                className="create-list-input"
                type="text"
                value={title}
                onChange={(event) => {
                    setTitle(event.target.value);
                    setValidationError(null);
                }}
                placeholder="Ex.: A fazer"
                maxLength={100}
                disabled={isSubmitting}
                autoFocus
                aria-invalid={Boolean(validationError)}
                aria-describedby={validationError ? "create-list-title-error" : undefined}
            />

            {validationError && (
                <p id="create-list-title-error" className="create-list-error" role="alert">
                    {validationError}
                </p>
            )}

            <div className="create-list-actions">
                <button
                    type="submit"
                    className="primary-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Criando..." : "Criar List"}
                </button>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
}
