"use client";

import { useGamification } from "../../context/GamificationContext";
import { useCoins } from "../../context/CoinContext";
import { useState } from "react";
import { Gauge, Target, Trophy, Award, Lock, Plus, RefreshCw } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

export default function ProgressionSimulation() {
    const {
        level, currentXP, maxXP, avatarStats, missions, badges,
        addXP, debugSetLevel, debugSetXP, resetAllProgress,
        completeMission, unlockBadge, updateAvatarStat
    } = useGamification();

    const { totalCoins, addCoins: globalAddCoins, spendCoins } = useCoins();

    const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'achievement'>('daily');

    // Radar Chart Helpers
    const stats = [
        { key: 'logic', label: 'Logic', val: avatarStats.logic },
        { key: 'creativity', label: 'Create', val: avatarStats.creativity },
        { key: 'focus', label: 'Focus', val: avatarStats.focus },
        { key: 'memory', label: 'Memory', val: avatarStats.memory }
    ];

    const getPoint = (value: number, index: number, total: number, radius: number) => {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        const r = (value / 100) * radius;
        return {
            x: 100 + Math.cos(angle) * r,
            y: 100 + Math.sin(angle) * r
        };
    };

    const polyPoints = stats.map((s, i) => {
        const p = getPoint(s.val, i, stats.length, 80);
        return `${p.x},${p.y}`;
    }).join(" ");

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col gap-2 mb-8">
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <Gauge size={32} className="text-indigo-600" />
                        Progression Simulation
                    </h1>
                    <p className="text-slate-500">Sandbox tool for balancing levels, XP, and badges.</p>
                </div>

                {/* 1. GOD MODE PANEL */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Target size={16} /> God Mode Controls
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Level & XP */}
                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-slate-500 uppercase">Level & XP</label>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-2xl text-slate-700">Lvl</span>
                                <input
                                    type="number"
                                    value={level}
                                    onChange={(e) => debugSetLevel(parseInt(e.target.value) || 1)}
                                    className="w-20 p-2 border border-slate-200 rounded-lg font-mono font-bold text-lg"
                                />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>XP: {Math.floor(currentXP)}</span>
                                    <span>Max: {maxXP}</span>
                                </div>
                                <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                    <div
                                        className="h-full bg-indigo-500 transition-all duration-300"
                                        style={{ width: `${Math.min(100, (currentXP / maxXP) * 100)}%` }}
                                    />
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button onClick={() => addXP(50)} className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-bold rounded">+50 XP</button>
                                    <button onClick={() => addXP(200)} className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-bold rounded">+200 XP</button>
                                </div>
                            </div>
                        </div>

                        {/* Coins */}
                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-slate-500 uppercase">Currency</label>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-2xl text-amber-500">$</span>
                                <div className="font-mono font-bold text-2xl text-slate-700">{totalCoins}</div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => globalAddCoins(100)} className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-bold rounded flex items-center gap-1"><Plus size={12} /> 100</button>
                                <button onClick={() => spendCoins(50)} className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded">Spend 50</button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 md:col-start-4">
                            <label className="block text-xs font-bold text-slate-500 uppercase">System</label>
                            <button
                                onClick={resetAllProgress}
                                className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl border border-red-200 flex items-center justify-center gap-2 transition-colors"
                            >
                                <RefreshCw size={18} /> Reset All Progress
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* 2. MISSIONS BOARD */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-[500px]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                <Trophy className="text-amber-500" /> Active Missions
                            </h2>
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                {(['daily', 'weekly', 'achievement'] as const).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setActiveTab(t)}
                                        className={clsx(
                                            "px-3 py-1 rounded-md text-xs font-bold transition-all capitalize",
                                            activeTab === t ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                        )}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                            {missions.filter(m => m.type === activeTab).map(mission => (
                                <div key={mission.id} className={clsx(
                                    "p-4 rounded-xl border flex justify-between items-center transition-all",
                                    mission.isClaimed ? "bg-slate-50 border-slate-100 opacity-60" : "bg-white border-slate-200 shadow-xs"
                                )}>
                                    <div>
                                        <h3 className={clsx("font-bold text-sm", mission.isClaimed ? "text-slate-400" : "text-slate-700")}>{mission.title}</h3>
                                        <div className="flex gap-3 mt-2 text-xs font-bold">
                                            <span className="text-indigo-500">{mission.rewardXP} XP</span>
                                            <span className="text-amber-500">{mission.rewardCoins} Coins</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => completeMission(mission.id)}
                                        disabled={mission.isClaimed}
                                        className={clsx(
                                            "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                            mission.isClaimed
                                                ? "bg-slate-200 text-slate-400"
                                                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md hover:scale-105 active:scale-95"
                                        )}
                                    >
                                        {mission.isClaimed ? "Claimed" : "Complete"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. BADGES & AVATAR */}
                    <div className="flex flex-col gap-8">

                        {/* Badges */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-6">
                                <Award className="text-indigo-500" /> Badges
                            </h2>
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                                {badges.map(badge => (
                                    <circle
                                        key={badge.id}
                                        onClick={() => unlockBadge(badge.id)}
                                        title={badge.isUnlocked ? badge.name : `Locked: ${badge.condition}`}
                                        className={clsx(
                                            "aspect-square rounded-full flex items-center justify-center border-2 transition-all relative group cursor-pointer",
                                            badge.isUnlocked
                                                ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-inner"
                                                : "bg-slate-100 border-slate-200 text-slate-300 grayscale"
                                        )}
                                    >
                                        <Award size={24} />
                                        {!badge.isUnlocked && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50 rounded-full">
                                                <Lock size={16} />
                                            </div>
                                        )}
                                    </circle>
                                ))}
                            </div>
                        </div>

                        {/* Avatar Stats */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex-1 flex flex-col md:flex-row gap-8 items-center">

                            {/* Stats Controls */}
                            <div className="flex-1 w-full space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Avatar Stats</h3>
                                {(Object.keys(avatarStats) as Array<keyof typeof avatarStats>).map(stat => (
                                    <div key={stat} className="flex items-center gap-4">
                                        <span className="w-20 text-xs font-bold text-slate-600 capitalize">{stat}</span>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={avatarStats[stat]}
                                            onChange={(e) => updateAvatarStat(stat, parseInt(e.target.value))}
                                            className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                        />
                                        <span className="w-8 text-xs font-mono text-right text-slate-500">{avatarStats[stat]}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Radar Chart */}
                            <div className="relative w-[200px] h-[200px] flex items-center justify-center">
                                {/* Background Grid */}
                                <svg width="200" height="200" className="absolute inset-0">
                                    {[20, 40, 60, 80].map(r => (
                                        <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#e2e8f0" strokeWidth="1" />
                                    ))}
                                    {/* Axis Lines */}
                                    <line x1="100" y1="20" x2="100" y2="180" stroke="#e2e8f0" />
                                    <line x1="20" y1="100" x2="180" y2="100" stroke="#e2e8f0" />

                                    {/* Data Polygon */}
                                    <polygon points={polyPoints} fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="2" />

                                    {/* Points */}
                                    {stats.map((s, i) => {
                                        const p = getPoint(s.val, i, stats.length, 80);
                                        return <circle key={s.key} cx={p.x} cy={p.y} r="3" fill="#6366f1" />;
                                    })}
                                </svg>

                                {/* Labels */}
                                <div className="absolute top-0 text-[10px] font-bold text-slate-400">LOGIC</div>
                                <div className="absolute bottom-0 text-[10px] font-bold text-slate-400">FOCUS</div>
                                <div className="absolute left-0 text-[10px] font-bold text-slate-400">MEM</div>
                                <div className="absolute right-0 text-[10px] font-bold text-slate-400">CRE</div>
                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
