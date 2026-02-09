"use client";

import React, { useState, useRef } from "react";
import {
    Plus,
    Minus,
    TrendingUp,
    TrendingDown,
    Wallet,
    Download,
    Upload,
    RotateCcw,
    History,
    AlertCircle,
    CheckCircle2,
    DollarSign
} from "lucide-react";
import { useEconomy, TransactionType, TransactionCategory, SimulationCard } from "../../context/EconomyContext";
import { motion, AnimatePresence } from "framer-motion";

// ============================================
// HELPERS & CONSTANTS
// ============================================

const RANDOM_NAMES: Record<string, string[]> = {
    LEARNING: [
        "Algebra Puzzles", "Angle Master Quiz", "Division Training",
        "Pattern Recognition", "Data Analysis Basics", "Logic Gate Challenge",
        "Fraction Fundamentals", "Geometry Genius"
    ],
    MINIGAME: [
        "Factor Ninja Highscore", "Coordinate Commando", "Equation Escape",
        "Prime Hunter", "Math Masters Run", "Number Smash"
    ],
    MISSION: [
        "Daily Challenge Complete", "Weekly Boss Defeated", "Secret Scroll Found",
        "Math Master Achievement", "Community Goal Met"
    ],
    AVATAR: [
        "Neon Cape", "Cyber Helmet", "Dragon Pet", "Golden Sword",
        "Galaxy Aura", "Stealth Boots", "Crystal Shield"
    ],
    UNLOCK_GAME: [
        "Calculus Level", "Secret Dungeon", "Pro Mode Access",
        "Multiplayer Arena", "Time Attack Mode"
    ]
};

const getRandomDesc = (cat: string) => {
    const names = RANDOM_NAMES[cat] || ["Unknown Activity"];
    return names[Math.floor(Math.random() * names.length)];
};

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    color: string;
    subValue?: string;
}

const StatCard = ({ title, value, icon: Icon, color, subValue }: StatCardProps) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">{title}</span>
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
        </div>
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        {subValue && (
            <div className="mt-2 text-xs text-slate-400 font-medium">
                {subValue}
            </div>
        )}
    </div>
);

export default function EconomyDashboard() {
    const {
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
        importData
    } = useEconomy();

    // Creator States
    const [itemType, setItemType] = useState<TransactionType>("INCOME");
    const [itemCategory, setItemCategory] = useState<TransactionCategory>("LEARNING");
    const [itemAmount, setItemAmount] = useState<string>("");

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const showMessage = (msg: string, type: "error" | "success") => {
        if (type === "error") setError(msg);
        else setSuccess(msg);
        setTimeout(() => {
            setError(null);
            setSuccess(null);
        }, 3000);
    };

    const handleCreateCard = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(itemAmount);
        if (isNaN(amount) || amount <= 0) {
            showMessage("Please enter a valid amount", "error");
            return;
        }

        addSimCard({
            type: itemType,
            category: itemCategory,
            amount
        });

        setItemAmount("");
        showMessage(`${itemCategory.toLowerCase()} card created!`, "success");
    };

    const handleExecuteAction = (card: SimulationCard) => {
        if (card.type === "EXPENSE" && balance < card.amount) {
            showMessage("Insufficient balance to perform this action!", "error");
            return;
        }

        const name = getRandomDesc(card.category);
        addTransaction({
            type: card.type,
            category: card.category,
            amount: card.amount,
            description: `${card.type === 'INCOME' ? 'Completed' : 'Purchased'} ${name}`
        });

        showMessage(`${name} recorded`, "success");
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                importData(content);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Economy Simulator</h1>
                        <p className="text-slate-500 font-medium">Create cards and click them to simulate game activities</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={exportData} className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition drop-shadow-sm">
                            <Download size={18} /> Export
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition drop-shadow-sm">
                            <Upload size={18} /> Import
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".json" />
                        <button onClick={clearData} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold border border-red-100 hover:bg-red-100 transition">
                            <RotateCcw size={18} /> Reset
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {(error || success) && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border shadow-sm ${error ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"
                                }`}
                        >
                            {error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                            <span className="font-bold">{error || success}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Column 1: Card Creator */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Plus className="text-blue-500" /> Card Creator
                            </h2>
                            <form onSubmit={handleCreateCard} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-widest">Type</label>
                                    <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl">
                                        <button
                                            type="button"
                                            onClick={() => { setItemType("INCOME"); setItemCategory("LEARNING"); }}
                                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${itemType === "INCOME" ? "bg-white text-green-600 shadow-sm" : "text-slate-400"}`}
                                        >Income</button>
                                        <button
                                            type="button"
                                            onClick={() => { setItemType("EXPENSE"); setItemCategory("AVATAR"); }}
                                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${itemType === "EXPENSE" ? "bg-white text-red-600 shadow-sm" : "text-slate-400"}`}
                                        >Expense</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-widest">Category</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {((itemType === "INCOME" ? ["LEARNING", "MINIGAME", "MISSION"] : ["AVATAR", "UNLOCK_GAME"]) as TransactionCategory[]).map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setItemCategory(cat)}
                                                className={`py-3 px-4 rounded-2xl text-xs font-black uppercase transition text-left flex items-center justify-between ${itemCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                                    }`}
                                            >
                                                {cat.replace("_", " ")}
                                                {itemCategory === cat && <CheckCircle2 size={16} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Coin Amount</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input
                                            type="number"
                                            value={itemAmount}
                                            onChange={(e) => setItemAmount(e.target.value)}
                                            placeholder="0"
                                            className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-black text-xl text-slate-800"
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition shadow-xl">
                                    Create Action
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Column 2: Action Center (The simulation hub) */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Action Center</h2>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{simCards.length} Tools Ready</span>
                            </div>

                            {simCards.length === 0 ? (
                                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
                                    <Wallet className="mx-auto mb-4 opacity-30" size={48} />
                                    <p className="font-bold">No action cards yet.</p>
                                    <p className="text-sm">Create some learning or store items on the left to start simulating!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <AnimatePresence>
                                        {simCards.map((card) => (
                                            <motion.div
                                                key={card.id}
                                                layout
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.9, opacity: 0 }}
                                                className="relative group"
                                            >
                                                <button
                                                    onClick={() => handleExecuteAction(card)}
                                                    className={`w-full p-5 rounded-3xl text-left transition-all border-b-4 active:border-b-0 active:translate-y-1 shadow-md ${card.type === "INCOME"
                                                        ? "bg-white border-green-500 hover:bg-green-50"
                                                        : "bg-white border-red-500 hover:bg-red-50"
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${card.type === "INCOME" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                            }`}>
                                                            {card.category.replace("_", " ")}
                                                        </span>
                                                        {card.type === "INCOME" ? <TrendingUp className="text-green-300" size={20} /> : <TrendingDown className="text-red-300" size={20} />}
                                                    </div>
                                                    <div className="text-2xl font-black text-slate-900">
                                                        {card.type === "INCOME" ? "+" : "-"}{card.amount}
                                                    </div>
                                                    <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Click to trigger</div>
                                                </button>

                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeSimCard(card.id); }}
                                                    className="absolute -top-2 -right-2 p-1.5 bg-slate-900 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                >
                                                    <Plus size={14} className="rotate-45" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Recent Activity Mini Log */}
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <History size={20} className="text-indigo-500" /> Recent Activity
                            </h3>
                            <div className="space-y-3">
                                {transactions.slice(0, 5).map(tx => (
                                    <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${tx.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'}`}>
                                                {tx.type === 'INCOME' ? <Plus size={14} className="text-green-600" /> : <Minus size={14} className="text-red-600" />}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-800 line-clamp-1">{tx.description}</div>
                                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{tx.category.replace("_", " ")}</div>
                                            </div>
                                        </div>
                                        <div className={`font-black ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.type === 'INCOME' ? '+' : '-'}{tx.amount}
                                        </div>
                                    </div>
                                ))}
                                {transactions.length === 0 && <p className="text-center text-slate-400 italic py-4 text-sm">No recorded data yet.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Stats & History */}
                    <div className="lg:col-span-4 space-y-6">
                        <StatCard
                            title="Current Balance"
                            value={balance.toLocaleString()}
                            icon={Wallet}
                            color="bg-indigo-600 shadow-indigo-200"
                        />

                        {/* Visual Breakdown */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Income Mix</h3>
                            <div className="space-y-6">
                                {["LEARNING", "MINIGAME", "MISSION"].map(cat => {
                                    const total = transactions.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0);
                                    const percent = totalIncome > 0 ? (total / totalIncome) * 100 : 0;
                                    return (
                                        <div key={cat}>
                                            <div className="flex justify-between text-xs font-black uppercase mb-2">
                                                <span className="text-slate-400">{cat}</span>
                                                <span className="text-slate-900">{percent.toFixed(0)}%</span>
                                            </div>
                                            <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="bg-indigo-500 h-full rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percent}%` }}
                                                    transition={{ duration: 1 }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Full History Redirect Card */}
                        <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200">
                            <h3 className="text-lg font-bold mb-2">Simulation Stats</h3>
                            <div className="space-y-4 my-6">
                                <div className="flex justify-between items-center text-sm font-medium opacity-60">
                                    <span>Total Income</span>
                                    <span>{totalIncome}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium opacity-60">
                                    <span>Total Spent</span>
                                    <span>{totalExpense}</span>
                                </div>
                                <div className="h-px bg-white/10" />
                                <div className="flex justify-between items-center font-bold">
                                    <span className="text-slate-400">Profit/Loss</span>
                                    <span className={balance >= 0 ? "text-green-400" : "text-red-400"}>
                                        {balance >= 0 ? '+' : ''}{balance}
                                    </span>
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center mt-4">Economy Balance Design Tool v2.2</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

