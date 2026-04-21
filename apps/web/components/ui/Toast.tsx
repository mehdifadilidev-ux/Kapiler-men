'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type ToastType = 'success' | 'error';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastContextValue {
  success: (title: string, message: string) => void;
  error: (title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((type: ToastType, title: string, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);

  const value: ToastContextValue = {
    success: (title, message) => push('success', title, message),
    error: (title, message) => push('error', title, message),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = toast.type === 'success';

  return (
    <div
      className={`pointer-events-auto border-l-4 bg-white p-4 shadow-lg ${
        isSuccess ? 'border-green-600' : 'border-red-600'
      }`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
            isSuccess ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {isSuccess ? '✓' : '!'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-montserrat text-sm font-semibold text-black">{toast.title}</p>
          <p className="mt-1 text-sm text-gray">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 text-gray hover:text-black"
          aria-label="Fermer"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
