import React, { createContext, useState, useEffect } from "react";
import { authApi, setToken, getToken, removeToken, getStoredUser, setStoredUser, removeStoredUser } from "../services/api";

export const loginContextObj = createContext();

function LoginContext({ children }) {
    const [currentUser, setCurrentUser] = useState(() => getStoredUser());
    const [loginStatus, setLoginStatus] = useState(() => Boolean(getToken() && getStoredUser()));
    const [loginError, setLoginError] = useState(null);

    // Check token validity on mount
    useEffect(() => {
        const token = getToken();
        if (token) {
            authApi.getMe()
                .then(user => {
                    setCurrentUser(user);
                    setStoredUser(user);
                    setLoginStatus(true);
                })
                .catch(() => {
                    // Token expired or invalid
                    removeToken();
                    removeStoredUser();
                    setCurrentUser(null);
                    setLoginStatus(false);
                });
        }
    }, []);

    // Sync currentUser changes to localStorage
    const handleSetCurrentUser = (user) => {
        setCurrentUser(user);
        if (user) {
            setStoredUser(user);
        } else {
            removeStoredUser();
        }
    };

    // User login
    async function userLogin({ username, password }) {
        try {
            setLoginError(null);
            const response = await authApi.login({ username, password });
            
            if (response && response.token && response.user) {
                setToken(response.token);
                handleSetCurrentUser(response.user);
                setLoginStatus(true);
                setLoginError(null);
                return response.user;
            } else {
                throw new Error("Invalid login response");
            }
        } catch (err) {
            console.error("Login failed:", err);
            const errorMessage = err.message || "UserName or password not correct";
            setLoginError({ message: errorMessage });
            setLoginStatus(false);
            return null;
        }
    }

    // User logout
    function userLogout() {
        removeToken();
        removeStoredUser();
        setCurrentUser(null);
        setLoginError(null);
        setLoginStatus(false);
    }

    return (
        <div>
            <loginContextObj.Provider
                value={{
                    currentUser,
                    setCurrentUser: handleSetCurrentUser,
                    loginStatus,
                    loginError,
                    userLogin,
                    userLogout
                }}
            >
                {children}
            </loginContextObj.Provider>
        </div>
    );
}

export default LoginContext;
