import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); // State to handle errors

    // Function to fetch the current user
    const fetchCurrentUser = async () => {
        setIsLoading(true);
        setError(null); // Reset error state before fetching
        try {
            const res = await getCurrentUser();
            if (res) {
                setIsLoggedIn(true);
                setUser(res);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            setError("Failed to fetch user data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Effect to fetch current user on component mount
    useEffect(() => {
        fetchCurrentUser();
    }, []);

    // Optional: Function to update user data
    const updateUser = (userData) => {
        setUser(userData);
    };

    return (
        <GlobalContext.Provider 
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading,
                error,
                fetchCurrentUser,
                updateUser
            }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;