"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SettingsContextType {
    defaultTime: number;
    setDefaultTime: (time: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [defaultTime, setDefaultTime] = useState(60); // Default 60 seconds
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("mathMastersSettings");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.defaultTime) setDefaultTime(parsed.defaultTime);
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("mathMastersSettings", JSON.stringify({ defaultTime }));
        }
    }, [defaultTime, isLoaded]);

    return (
        <SettingsContext.Provider value={{ defaultTime, setDefaultTime }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
