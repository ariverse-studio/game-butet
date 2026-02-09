"use client";

import React, { useState } from "react";
import { useGamification, Mission } from "../../context/GamificationContext";
import {
    Trophy,
    Plus,
    Trash2,
    Zap,
    Target as TargetIcon,
    Puzzle,
    Coins,
    Star,
    LayoutDashboard,
    ChevronRight,
    Search
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

const REWARD_MAP = {
    Low: { xp: 50, coins: 20 },
    Medium: { xp: 150, coins: 60 },
    High: { xp: 400, coins: 150 }
};

export default function MissionSimulator() {
    const { missions, addMission, deleteMission } = useGamification();

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [logic, setLogic] = useState("");
    const [target, setTarget] = useState("");
    const [type, setType] = useState<'daily' | 'weekly' | 'achievement'>('daily');
    const [rewardLevel, setRewardLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');

    const handleCreateMission = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const rewards = REWARD_MAP[rewardLevel];

        addMission({
            title: name,
            description: desc,
            logicBuilder: logic,
            target: target,
            type: type,
            rewardLevel: rewardLevel,
            rewardXP: rewards.xp,
            rewardCoins: rewards.coins
        });

        setName("");
        setDesc("");
        setLogic("");
        setTarget("");
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 sm:p-10 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-indigo-600">
                            <Puzzle size={20} />
                            <span className="text-xs font-black uppercase tracking-widest">Logic Sandbox</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mission Designer</h1>
                        <p className="text-slate-500 font-medium">Create and balance quest logic for your players.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left: Designer Form */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-10"
                        >
                            <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                                <Plus className="text-indigo-500" /> New Mission
                            </h2>

                            <form onSubmit={handleCreateMission} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Mission Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Daily Warmup"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold transition-all text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Description</label>
                                    <textarea
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        placeholder="Explain the mission to the user..."
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold transition-all text-sm h-24 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Logic Builder</label>
                                        <input
                                            type="text"
                                            value={logic}
                                            onChange={(e) => setLogic(e.target.value)}
                                            placeholder="event.trigger"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Target</label>
                                        <input
                                            type="text"
                                            value={target}
                                            onChange={(e) => setTarget(e.target.value)}
                                            placeholder="x = 1"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Mission Type</label>
                                        <select
                                            value={type}
                                            onChange={(e) => setType(e.target.value as any)}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="achievement">Achievement</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Reward Pacing</label>
                                        <select
                                            value={rewardLevel}
                                            onChange={(e) => setRewardLevel(e.target.value as any)}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                                        >
                                            <option value="Low">Low (50 XP)</option>
                                            <option value="Medium">Medium (150 XP)</option>
                                            <option value="High">High (400 XP)</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100/50"
                                >
                                    Generate Mission Card
                                </button>
                            </form>
                        </motion.div>
                    </div>

                    {/* Right: Mission List */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Repository</h2>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <Search size={14} /> {missions.length} Missions
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <AnimatePresence mode="popLayout">
                                {missions.map((m) => (
                                    <motion.div
                                        key={m.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all"
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={clsx(
                                                        "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                                                        m.type === 'daily' ? "bg-green-100 text-green-600" :
                                                            m.type === 'weekly' ? "bg-blue-100 text-blue-600" :
                                                                "bg-purple-100 text-purple-600"
                                                    )}>
                                                        {m.type}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                        <Zap size={10} /> {m.logicBuilder || 'manual'}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-black text-slate-800">{m.title}</h3>
                                                <p className="text-slate-500 text-sm mt-1 mb-4">{m.description || 'No description provided.'}</p>

                                                <div className="flex flex-wrap gap-4 mt-auto">
                                                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                                        <Star size={14} className="text-indigo-500" />
                                                        <span className="text-xs font-black text-slate-700">+{m.rewardXP} XP</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                                        <Coins size={14} className="text-amber-500" />
                                                        <span className="text-xs font-black text-slate-700">+{m.rewardCoins}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                                        <TargetIcon size={14} className="text-red-400" />
                                                        <span className="text-xs font-black text-slate-700 font-mono">{m.target || 'None'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => deleteMission(m.id)}
                                                className="p-3 bg-red-50 text-red-500 rounded-2xl opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}

                                {missions.length === 0 && (
                                    <div className="p-20 text-center border-4 border-dashed border-slate-100 rounded-[3rem]">
                                        <Trophy size={48} className="mx-auto text-slate-200 mb-4" />
                                        <p className="text-slate-400 font-bold">Your mission repository is empty.</p>
                                        <p className="text-slate-300 text-sm">Start designing above to populate the game world.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
