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
  pricingMode: "normal" | "special";
  cart: Map<string, { count: number; priceOverride?: number; order: number }>;
  customItems: Map<string, { name: string; barcode: string; price: number }>;
  setPricingMode: (mode: "normal" | "special") => void;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  addCustomItem: (id: string, data: { name: string; barcode: string; price: number }) => void;
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
      pricingMode: "normal",
      cart: new Map(),
      customItems: new Map(),
      setPricingMode: (mode: "normal" | "special") =>
        set({ pricingMode: mode }),
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
        set((s) => {
          const cart = new Map(s.cart);
          cart.set(id, {
            count: Math.max(0, (cart.get(id)?.count ?? 0) - 1),
            order: cart.get(id)?.order ?? 0,
          });
          if (cart.get(id)?.count === 0) {
            cart.delete(id);
          }
          return { cart };
        }),
      addCustomItem: (id: string, data: { name: string; barcode: string; price: number }) =>
        set((state) => {
          const customItems = new Map(state.customItems);
          customItems.set(id, data);
          const cart = new Map(state.cart);
          cart.set(id, {
            count: (cart.get(id)?.count ?? 0) + 1,
            priceOverride: data.price,
            order: cart.get(id)?.order ?? order.current++,
          });
          return { customItems, cart };
        }),
      clearCart: () => set({ cart: new Map(), customItems: new Map() }),
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
