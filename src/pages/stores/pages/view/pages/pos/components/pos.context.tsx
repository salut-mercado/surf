import {
  createContext,
  useContext,
  useRef,
  type PropsWithChildren,
} from "react";
import { useParams } from "wouter";
import { createStore, useStore, type StoreApi } from "zustand";

interface PosContextType {
  storeId: string;
  cart: Map<string, { count: number; priceOverride?: number; order: number }>;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const PosContext = createContext<StoreApi<PosContextType>>(null!);

const PosContextProvider = ({ children }: PropsWithChildren) => {
  const { id: storeId = "" } = useParams<{ id: string }>();
  const storeRef = useRef<StoreApi<PosContextType>>(null);
  const order = useRef(0);

  if (storeRef.current === null) {
    storeRef.current = createStore<PosContextType>((set) => ({
      storeId,
      cart: new Map(),
      addToCart: (id: string) =>
        set((state) => {
          const cart = new Map(state.cart);
          cart.set(id, {
            count: (cart.get(id)?.count ?? 0) + 1,
            order: cart.get(id)?.order ?? order.current++,
          });
          return { cart };
        }),
      removeFromCart: (id: string) =>
        set((s) => ({
          cart: new Map(s.cart).set(id, {
            count: Math.max(0, (s.cart.get(id)?.count ?? 0) - 1),
            order: s.cart.get(id)?.order ?? 0,
          }),
        })),
      clearCart: () => set({ cart: new Map() }),
    }));
  }

  return (
    <PosContext.Provider value={storeRef.current}>
      {children}
    </PosContext.Provider>
  );
};

const usePos = <T,>(selector: (state: PosContextType) => T) => {
  const store = useContext(PosContext);
  if (!store) {
    throw new Error("Missing StoreProvider");
  }
  return useStore(store, selector);
};

export { PosContextProvider, usePos };
