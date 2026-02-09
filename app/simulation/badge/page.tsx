"use client";

import React, { useState } from "react";
import { useGamification, Badge } from "../../context/GamificationContext";
import {
    Award,
    Plus,
    Trash2,
    Zap,
    Palette,
    Shield,
    Flame,
    Crown,
    Sparkles,
    Search,
    Lock
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

const TIER_STYLES = {
    common: { bg: "bg-amber-100", border: "border-amber-200", text: "text-amber-800", iconBg: "bg-amber-500", label: "Common", desc: "Bronze / Wood Finish" },
    rare: { bg: "bg-blue-100", border: "border-blue-200", text: "text-blue-800", iconBg: "bg-blue-500", label: "Rare", desc: "Silver / Light Blue" },
    epic: { bg: "bg-purple-100", border: "border-purple-200", text: "text-purple-800", iconBg: "bg-purple-500", label: "Epic", desc: "Gold / Purple" },
    legendary: { bg: "bg-red-100", border: "border-red-200", text: "text-red-800", iconBg: "bg-red-500", label: "Legendary", desc: "Crimson / Neon" },
    mythic: { bg: "bg-slate-900", border: "border-slate-800", text: "text-white", iconBg: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500", label: "Mythic", desc: "Holographic / Obsidian" }
};

export default function BadgeSimulator() {
    const { badges, addBadge, deleteBadge } = useGamification();

    const [name, setName] = useState("");
    const [tier, setTier] = useState<Badge['tier']>('common');
    const [color, setColor] = useState("#8B4513");
    const [trigger, setTrigger] = useState("");
    const [icon, setIcon] = useState("");
    const [condition, setCondition] = useState("");

    const handleCreateBadge = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        addBadge({
            name,
            tier,
            color,
            trigger,
            icon: icon || "Award",
            condition: condition || "Challenge completion",
        });

        setName("");
        setTrigger("");
        setIcon("");
        setCondition("");
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 sm:p-10 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-rose-500">
                            <Shield size={20} />
                            <span className="text-xs font-black uppercase tracking-widest">Prestige System</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Badge Lab</h1>
                        <p className="text-slate-500 font-medium">Design achievements and prestige markers for top performers.</p>
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
                                <Palette className="text-rose-500" /> Badge Architect
                            </h2>

                            <form onSubmit={handleCreateBadge} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Badge Tier</label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {(Object.keys(TIER_STYLES) as Array<keyof typeof TIER_STYLES>).map((t) => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setTier(t)}
                                                className={clsx(
                                                    "py-3 rounded-xl text-[8px] font-black uppercase transition-all border-2",
                                                    tier === t ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-100 bg-slate-50 text-slate-400"
                                                )}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Badge Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. Speed Demon"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold transition-all text-sm"
                                        />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Dominant Color</label>
                                        <input
                                            type="color"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            className="w-full h-14 p-1 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Logic Trigger</label>
                                    <input
                                        type="text"
                                        value={trigger}
                                        onChange={(e) => setTrigger(e.target.value)}
                                        placeholder="e.g. streak.extended(30)"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Icon Concept</label>
                                    <input
                                        type="text"
                                        value={icon}
                                        onChange={(e) => setIcon(e.target.value)}
                                        placeholder="e.g. Glowing Sword"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Unlock Condition (UI)</label>
                                    <input
                                        type="text"
                                        value={condition}
                                        onChange={(e) => setCondition(e.target.value)}
                                        placeholder="Display text for locked state"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-5 bg-rose-500 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-rose-100/50"
                                >
                                    Mint Badge Prototype
                                </button>
                            </form>
                        </motion.div>
                    </div>

                    {/* Right: Badge Gallery */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Badge Repository</h2>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <Award size={14} /> {badges.length} Prototypes
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {badges.map((b) => {
                                    const style = TIER_STYLES[b.tier as keyof typeof TIER_STYLES] || TIER_STYLES.common;
                                    return (
                                        <motion.div
                                            key={b.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className={clsx(
                                                "relative group p-6 rounded-[2.5rem] border flex flex-col items-center text-center transition-all",
                                                style.bg, style.border
                                            )}
                                        >
                                            <div
                                                className={clsx(
                                                    "w-16 h-16 rounded-3xl flex items-center justify-center mb-4 text-white shadow-lg",
                                                    style.iconBg
                                                )}
                                                style={b.color && b.tier !== 'mythic' ? { backgroundColor: b.color } : {}}
                                            >
                                                {b.tier === 'mythic' ? <Crown size={32} /> :
                                                    b.tier === 'legendary' ? <Flame size={32} /> :
                                                        b.tier === 'epic' ? <Sparkles size={32} /> :
                                                            <Award size={32} />}
                                            </div>

                                            <div className={clsx("text-[8px] font-black uppercase tracking-[0.2em] mb-1", style.text)}>
                                                {b.tier}
                                            </div>
                                            <h3 className={clsx("text-sm font-black leading-tight mb-2", b.tier === 'mythic' ? 'text-white' : 'text-slate-900')}>
                                                {b.name}
                                            </h3>

                                            <div className="mt-4 px-3 py-1 bg-white/20 rounded-lg text-[9px] font-mono font-bold opacity-60">
                                                {b.trigger || 'manual'}
                                            </div>

                                            <button
                                                onClick={() => deleteBadge(b.id)}
                                                className="absolute -top-2 -right-2 p-2 bg-slate-900 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 shadow-lg"
                                            >
                                                <Trash2 size={12} />
                                            </button>

                                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors rounded-[2.5rem] pointer-events-none" />
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {badges.length === 0 && (
                                <div className="col-span-full p-20 text-center border-4 border-dashed border-slate-100 rounded-[3rem]">
                                    <Lock size={48} className="mx-auto text-slate-200 mb-4" />
                                    <p className="text-slate-400 font-bold">No achievements designed yet.</p>
                                    <p className="text-slate-300 text-sm">Use the architect to mint your first badge.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
