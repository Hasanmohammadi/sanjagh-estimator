export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners: Set<Listener> = new Set();

function notify() {
  listeners.forEach(fn => fn([...toasts]));
}

export const toastEmitter = {
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    fn([...toasts]);
    return () => listeners.delete(fn);
  },
};

function show(message: string, type: ToastType = "info", duration = 5000) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const item: ToastItem = { id, message, type, duration };
  toasts = [...toasts, item];
  notify();

  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id);
    notify();
  }, duration);
}

export function dismiss(id: string) {
  toasts = toasts.filter(t => t.id !== id);
  notify();
}

const toast = {
  show,
  success: (message: string, duration?: number) => show(message, "success", duration),
  error: (message: string, duration?: number) => show(message, "error", duration),
  warning: (message: string, duration?: number) => show(message, "warning", duration),
  info: (message: string, duration?: number) => show(message, "info", duration),
};

export default toast;
