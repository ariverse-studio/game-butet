"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface CoinContextType {
    totalCoins: number;
    addCoins: (amount: number) => void;
    spendCoins: (amount: number) => boolean;
}

const CoinContext = createContext<CoinContextType | undefined>(undefined);

export function CoinProvider({ children }: { children: React.ReactNode }) {
    // Initialize with 0 to avoid hydration mismatch, then load from local storage
    const [totalCoins, setTotalCoins] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("mathMastersCoins");
        if (saved) {
            setTotalCoins(parseInt(saved, 10));
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("mathMastersCoins", totalCoins.toString());
        }
    }, [totalCoins, isLoaded]);

    const addCoins = (amount: number) => {
        setTotalCoins((prev) => prev + amount);
    };

    const spendCoins = (amount: number) => {
        if (totalCoins >= amount) {
            setTotalCoins((prev) => prev - amount);
            return true;
        }
        return false;
    };

    return (
        <CoinContext.Provider value={{ totalCoins, addCoins, spendCoins }}>
            {children}
        </CoinContext.Provider>
    );
}

export function useCoins() {
    const context = useContext(CoinContext);
    if (context === undefined) {
        throw new Error("useCoins must be used within a CoinProvider");
    }
    return context;
}
