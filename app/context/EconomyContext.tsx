"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// ============================================
// TYPES & INTERFACES
// ============================================

export type TransactionType = "INCOME" | "EXPENSE";

export type TransactionCategory =
    | "LEARNING"
    | "MINIGAME"
    | "MISSION"
    | "AVATAR"
    | "UNLOCK_GAME";

export interface Transaction {
    id: string;
    type: TransactionType;
    category: TransactionCategory;
    amount: number;
    description: string;
    timestamp: string;
}

export interface SimulationCard {
    id: string;
    type: TransactionType;
    category: TransactionCategory;
    amount: number;
    expAmount?: number; // Optional EXP reward
    description: string;
}

interface EconomyContextType {
    transactions: Transaction[];
    simCards: SimulationCard[];
    balance: number;
    totalIncome: number;
    totalExpense: number;
    addTransaction: (tx: Omit<Transaction, "id" | "timestamp">) => void;
    addSimCard: (card: Omit<SimulationCard, "id">) => void;
    removeSimCard: (id: string) => void;
    clearData: () => void;
    exportData: () => void;
    importData: (jsonData: string) => void;
}

// ============================================
// CONTEXT
// ============================================

const EconomyContext = createContext<EconomyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "mathMastersEconomySim_v2";

export function EconomyProvider({ children }: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [simCards, setSimCards] = useState<SimulationCard[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Load
    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            try {
                const { txs, cards } = JSON.parse(saved);
                setTransactions(txs || []);
                setSimCards(cards || []);
            } catch (e) {
                console.error("Failed to parse economy simulation data", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // auto-save
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
                txs: transactions,
                cards: simCards
            }));
        }
    }, [transactions, simCards, isLoaded]);

    // CALCULATED STATS
    const totalIncome = transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // ACTIONS
    const addTransaction = (tx: Omit<Transaction, "id" | "timestamp">) => {
        const newTx: Transaction = {
            ...tx,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
        };
        setTransactions((prev) => [newTx, ...prev]);
    };

    const addSimCard = (card: Omit<SimulationCard, "id">) => {
        setSimCards((prev) => [...prev, { ...card, id: crypto.randomUUID() }]);
    };

    const removeSimCard = (id: string) => {
        setSimCards((prev) => prev.filter(c => c.id !== id));
    };

    const clearData = () => {
        if (window.confirm("Are you sure you want to clear all simulation data?")) {
            setTransactions([]);
            setSimCards([]);
        }
    };

    const exportData = () => {
        const dataStr = JSON.stringify({ transactions, simCards }, null, 2);
        const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
        const exportFileDefaultName = `economy_sim_export_${new Date().toISOString().split("T")[0]}.json`;

        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", exportFileDefaultName);
        linkElement.click();
    };

    const importData = (jsonData: string) => {
        try {
            const parsed = JSON.parse(jsonData);
            if (parsed.transactions && parsed.simCards) {
                setTransactions(parsed.transactions);
                setSimCards(parsed.simCards);
                alert("Data imported successfully!");
            } else if (Array.isArray(parsed)) {
                // Legacy support for older exports
                setTransactions(parsed);
                alert("Transactions imported (legacy format)");
            } else {
                throw new Error("Invalid format.");
            }
        } catch (e) {
            alert("Error importing data: " + (e instanceof Error ? e.message : "Invalid JSON"));
        }
    };

    return (
        <EconomyContext.Provider
            value={{
                transactions,
                simCards,
                balance,
                totalIncome,
                totalExpense,
                addTransaction,
                addSimCard,
                removeSimCard,
                clearData,
                exportData,
                importData,
            }}
        >
            {children}
        </EconomyContext.Provider>
    );
}

export function useEconomy() {
    const context = useContext(EconomyContext);
    if (!context) {
        throw new Error("useEconomy must be used within an EconomyProvider");
    }
    return context;
}
