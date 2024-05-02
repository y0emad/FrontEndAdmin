import { createContext, useEffect, useState } from "react";

export const authContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null)
    useEffect(() => {
        if (localStorage.getItem("tkn") !== null) {

            setToken(localStorage.getItem("tkn"));
        }

    }, [])
    return <authContext.Provider value={{ token, setToken }}>
        {children}
    </authContext.Provider>
}