import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";

type Props = {
  isSubmitting: boolean;
  disabled: boolean;
  error: string | null;
  onSubmit: (title: string) => Promise<void>;
  onCancel: () => void;
};

export function CreateCardForm({ isSubmitting, disabled, error, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const feedback = validationError || error;

  useEffect(() => {
    if (!isSubmitting && !disabled) input.current?.focus();
  }, [isSubmitting, disabled]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || disabled) return;
    const normalized = title.trim();
    if (!normalized || normalized.length > 100) {
      setValidationError(!normalized ? "Informe o título do cartão." : "O título deve ter no máximo 100 caracteres.");
      input.current?.focus();
      return;
    }
    setValidationError(null);
    void onSubmit(normalized);
  }

  return (
    <form className="create-card-form" onSubmit={submit} aria-busy={isSubmitting}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          if (!isSubmitting) onCancel();
        }
      }}>
      <label htmlFor={id}>Título do cartão</label>
      <input ref={input} id={id} value={title} maxLength={100}
        disabled={isSubmitting || disabled} aria-invalid={Boolean(feedback)}
        aria-describedby={feedback ? `${id}-error` : undefined}
        onChange={(event) => { setTitle(event.target.value); setValidationError(null); }} />
      {feedback && <p id={`${id}-error`} className="card-error" role="alert">{feedback}</p>}
      <div className="card-form-actions">
        <button type="submit" className="primary-button" disabled={isSubmitting || disabled}>
          {isSubmitting ? "Adicionando..." : "Adicionar cartão"}
        </button>
        <button type="button" className="secondary-button" disabled={isSubmitting} onClick={onCancel}>Cancelar</button>
      </div>
      {isSubmitting && <span className="card-feedback" role="status">Criando cartão...</span>}
    </form>
  );
}
