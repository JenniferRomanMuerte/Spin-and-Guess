// src/hooks/useRoundInfoMessages.js
import { useCallback, useEffect, useRef } from "react";

export const useRoundInfoMessages = (setMessage) => {
  // Guarda el id del timeout activo (si hay)
  const timeoutRef = useRef(null);

  // Cola para encadenar mensajes sin que se pisen
  const queueRef = useRef(Promise.resolve());

  // Guarda el resolve del enqueue que esté “en curso”
  const pendingResolveRef = useRef(null);

  // Cancela el timeout actual (si existe)
  const cancelTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Limpia el mensaje (y cancela timeouts)
  const clear = useCallback(() => {
    cancelTimeout();
    setMessage("");
  }, [cancelTimeout, setMessage]);

  // Resetea la cola de mensajes (corta todo lo pendiente)
  const resetQueue = useCallback(() => {
    cancelTimeout();
    setMessage("");

    if (pendingResolveRef.current) {
      pendingResolveRef.current();
      pendingResolveRef.current = null;
    }

    queueRef.current = Promise.resolve();
  }, [cancelTimeout, setMessage]);

  // Muestra un mensaje fijo (no se borra solo)
  const show = useCallback(
    (text) => {
      cancelTimeout();
      setMessage(text);
    },
    [cancelTimeout, setMessage]
  );

  // Muestra un mensaje temporal (se borra solo)
  const showTemp = useCallback(
    (text, ms = 3000) => {
      cancelTimeout();
      setMessage(text);

      timeoutRef.current = setTimeout(() => {
        setMessage("");
        timeoutRef.current = null;
      }, ms);
    },
    [cancelTimeout, setMessage]
  );

  // Encola un mensaje: espera ms y luego deja pasar al siguiente
  // (Opcional: autoClear para limpiar al final)
  const enqueue = useCallback(
    (text, ms = 2000, { autoClear = false } = {}) => {
      queueRef.current = queueRef.current.then(
        () =>
          new Promise((resolve) => {
            pendingResolveRef.current = resolve;
            cancelTimeout();
            setMessage(text);

            timeoutRef.current = setTimeout(() => {
              pendingResolveRef.current = null;
              timeoutRef.current = null;
              if (autoClear) setMessage("");
              resolve();
            }, ms);
          })
      );

      return queueRef.current;
    },
    [cancelTimeout, setMessage]
  );

  // Limpieza al desmontar el componente
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (pendingResolveRef.current) {
        pendingResolveRef.current();
        pendingResolveRef.current = null;
      }
    };
  }, []);

  return { show, showTemp, enqueue, clear, resetQueue, cancelTimeout };
};
