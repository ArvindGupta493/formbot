import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes

const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
}

// function contant all logics
export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    }

    const theme = isDarkMode ? "dark" : "light";

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [isDarkMode]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Adding PropTypes validation
ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired, // This ensures children is required and is a valid node
};

