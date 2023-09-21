import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    async function signOut() {
        try {
            setUser(null);
            await AsyncStorage.removeItem("user");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
