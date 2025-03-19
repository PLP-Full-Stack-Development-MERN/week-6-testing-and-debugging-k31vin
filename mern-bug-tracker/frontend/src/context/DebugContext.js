import React, { createContext, useState, useContext } from 'react';

const DebugContext = createContext();

export const DebugProvider = ({ children }) => {
const [debugMode, setDebugMode] = useState(
    localStorage.getItem('debugMode') === 'true'
);

const toggleDebugMode = () => {
    const newMode = !debugMode;
    setDebugMode(newMode);
    localStorage.setItem('debugMode', newMode.toString());
};

return (
    <DebugContext.Provider value={{ debugMode, toggleDebugMode }}>
    {children}
    </DebugContext.Provider>
);
};

export const useDebugMode = () => useContext(DebugContext);