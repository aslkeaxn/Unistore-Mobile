import { createContext, useContext, useState } from "react";

const StoreContext = createContext(null);

export function useStore() {
    return useContext(StoreContext);
}

export function StoreProvider({ children }) {
    const [store, setStore] = useState(null);

    return (
        <StoreContext.Provider value={{ store, setStore }}>
            {children}
        </StoreContext.Provider>
    );
}
