import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await fetch("/api/auth/me.php", {
                    credentials: "include",
                });
                const data = await response.json();

                if (data.success && data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, []);

    //connexion réussie
    const login = (userData) => {
        setUser(userData);
    };

    //  déconnexion
    const logout = async () => {
        try {
            await fetch("/api/auth/logout.php", { credentials: "include" });
        } catch (err) {
            console.error(err);//TODO TMP
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);