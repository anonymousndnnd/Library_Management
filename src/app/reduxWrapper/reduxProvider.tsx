'use client';

import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import { useState, useEffect } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

export function Providers({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<any>(null);
  const [persistor, setPersistor] = useState<any>(null);

  useEffect(() => {
    const s = makeStore();
    const p = persistStore(s);
    setStore(s);
    setPersistor(p);
  }, []);

  if (!store || !persistor) return null; // wait until store & persistor ready

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
