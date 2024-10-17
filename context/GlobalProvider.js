import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // New function to fetch the current user
    const fetchCurrentUser = async () => {
        try {
            const res = await getCurrentUser();
            if (res) {
                setIsLoggedIn(true);
                setUser(res);
                return res; // Return the user object
            } else {
                setIsLoggedIn(false);
                setUser(null);
                return null; // Return null
            }
        } catch (error) {
            console.error(error);
            setIsLoggedIn(false);
            setUser(null);
            return null; // Return null on error
        }
    };    

    useEffect(() => {
        fetchCurrentUser()
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <GlobalContext.Provider 
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading,
                fetchCurrentUser, // Add fetchCurrentUser to context
            }}>
            {children}
        </GlobalContext.Provider>
    );
}

export default GlobalProvider;