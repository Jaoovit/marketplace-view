import { createContext, useContext, useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        setIsLoggedIn(!!token);
        setUserId(storedUserId ? parseInt(storedUserId, 10) : null);
    }, []);

    const login = (token, id) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', id);
        setIsLoggedIn(true);
        setUserId(id);
    };

    const logout = async () => {
        try {
            await fetch(`${apiUrl}/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            setIsLoggedIn(false);
            setUserId(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


