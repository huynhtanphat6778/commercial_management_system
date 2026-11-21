import { useEffect, useId, useRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
}

export function Button({ variant = 'primary', icon, className = '', children, ...props }: ButtonProps) {
  return (
    <button className={`button button--${variant} ${className}`} {...props}>
      {icon}
      {children}
    </button>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function Input({ label, hint, id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <label className="field" htmlFor={inputId}>
      <span className="field__label">{label}</span>
      <input id={inputId} className="input" {...props} />
      {hint && <span className="field__hint">{hint}</span>}
    </label>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({ label, options, id, ...props }: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <label className="field" htmlFor={selectId}>
      <span className="field__label">{label}</span>
      <select id={selectId} className="input select" {...props}>
        {options.map((option) => (
          <option value={option.value} key={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

export function Table({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="table-scroll">
      <table className="data-table" aria-label={label}>{children}</table>
    </div>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'positive' | 'warning' | 'negative' | 'accent';
}) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section ref={dialogRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1}>
        <div className="modal__head">
          <h2 id="modal-title" className="section-title">{title}</h2>
          <Button variant="quiet" aria-label="Đóng hộp thoại" onClick={onClose}>Đóng</Button>
        </div>
        {children}
      </section>
    </div>
  );
}

export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return <div className="toast" role="status" aria-live="polite">{message}</div>;
}

export function LoadingState({ label = 'Đang tải dữ liệu' }: { label?: string }) {
  return <div className="state-card" role="status"><span className="spinner" />{label}…</div>;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="state-card state-card--error" role="alert">
      <strong>Không tải được dữ liệu</strong>
      <span>{message}</span>
      {onRetry && <Button variant="secondary" onClick={onRetry}>Thử lại</Button>}
    </div>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return <div className="state-card"><strong>{title}</strong><span>{message}</span></div>;
}

export function ScreenHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="screen-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display-title">{title}</h1>
        {description && <p className="screen-heading__description">{description}</p>}
      </div>
      {action}
    </div>
  );
}
