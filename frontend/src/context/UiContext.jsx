/**
 * Global UI primitives for the prototype: drawer, modal, toasts.
 */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const UiContext = createContext(null);

export function UiProvider({ children }) {
  const [drawer, setDrawer] = useState(null);
  const [modal, setModal] = useState(null);
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((type, icon, message) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((t) => [...t, { id, type, icon, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(
    () => ({
      drawer,
      setDrawer,
      modal,
      setModal,
      toasts,
      pushToast,
    }),
    [drawer, modal, toasts, pushToast],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi requires UiProvider');
  return ctx;
}
