import React, { createContext, useContext, useState, useCallback } from "react";
import { clsx } from "clsx";

/**
 * Toast Context
 */
const ToastContext = createContext(null);

/**
 * Toast Provider
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /**
   * Add a new toast
   */
  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  /**
   * Remove a toast
   */
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * Convenience methods
   */
  const showSuccess = useCallback(
    (message) => addToast(message, "success"),
    [addToast],
  );
  const showError = useCallback(
    (message) => addToast(message, "error"),
    [addToast],
  );
  const showWarning = useCallback(
    (message) => addToast(message, "warning"),
    [addToast],
  );
  const showInfo = useCallback(
    (message) => addToast(message, "info"),
    [addToast],
  );

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

/**
 * Toast Container
 */
function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

/**
 * Individual Toast
 */
function Toast({ toast, onRemove }) {
  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500 text-white",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div
      className={clsx(
        "px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-[200px] animate-slide-down",
        typeStyles[toast.type],
      )}
    >
      <span>{icons[toast.type]}</span>
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="opacity-70 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}

/**
 * Hook to use toast
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export default ToastProvider;
