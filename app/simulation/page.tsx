"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Coins,
    Gauge,
    ArrowRight,
    Zap,
    Database,
    Settings,
    LayoutDashboard
} from "lucide-react";

const SimulationCard = ({
    title,
    description,
    href,
    icon: Icon,
    color,
    tag
}: {
    title: string;
    description: string;
    href: string;
    icon: any;
    color: string;
    tag: string;
}) => (
    <Link href={href}>
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 h-full flex flex-col"
        >
            <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center mb-6 text-white shadow-lg`}>
                <Icon size={32} strokeWidth={2.5} />
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{tag}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-8">{description}</p>
            </div>

            <div className="flex items-center justify-between mt-auto">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-2 group-hover:gap-3 transition-all">
                    Open Module <ArrowRight size={18} className="text-indigo-500" />
                </span>
                <div className="p-2 bg-slate-50 rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <Settings size={14} className="opacity-40 group-hover:opacity-100" />
                </div>
            </div>
        </motion.div>
    </Link>
);

export default function SimulationHub() {
    const simulationModules = [
        {
            title: "Economy Simulator",
            description: "Balance coin rewards, store items, and transaction flows. Test player spending habits and income pacing.",
            href: "/simulation/economy",
            icon: Coins,
            color: "bg-gradient-to-br from-amber-400 to-orange-500",
            tag: "Financial Balance"
        },
        {
            title: "Progression Sandbox",
            description: "Debug level thresholds, XP distribution, and achievement triggers. Simulate player growth and mission cycles.",
            href: "/simulation/progression",
            icon: Gauge,
            color: "bg-gradient-to-br from-indigo-500 to-purple-600",
            tag: "Gamification Logic"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 p-8 sm:p-12 md:p-20 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <header className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 mb-6"
                        >
                            <div className="h-px w-8 bg-indigo-500" />
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600">Developer Cloud</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.9]"
                        >
                            Simulation <span className="text-indigo-600 underline decoration-indigo-200 decoration-8 underline-offset-8">Hub</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-8 text-xl text-slate-500 font-medium max-w-xl leading-relaxed"
                        >
                            Powerful sandbox tools designed to help you build, balance, and fine-tune complex game economies and player progression systems.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-4"
                    >
                        <div className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-4 px-6 shadow-sm">
                            <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                                <Zap size={20} fill="currentColor" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Environment</div>
                                <div className="text-sm font-bold text-slate-800">Local Dev Mode</div>
                            </div>
                        </div>
                    </motion.div>
                </header>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {simulationModules.map((module, idx) => (
                        <motion.div
                            key={module.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx + 0.4 }}
                        >
                            <SimulationCard {...module} />
                        </motion.div>
                    ))}

                    {/* Placeholder for future modules */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-slate-100/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center group hover:border-indigo-300 transition-colors"
                    >
                        <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-500 transition-colors">
                            <Database size={24} />
                        </div>
                        <h3 className="font-bold text-slate-500">More Coming Soon</h3>
                        <p className="text-xs text-slate-400 mt-2 max-w-[200px]">Inventory balancing and world logic simulations are in progress.</p>
                    </motion.div>
                </div>

                {/* Footer Quote */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-24 pt-12 border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-6"
                >
                    <div className="flex items-center gap-4 text-slate-400">
                        <LayoutDashboard size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest">Master Dashboard v2.4</span>
                    </div>
                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
                        MATH MASTERS / INTERNAL ACCESS ONLY
                    </div>
                </motion.footer>
            </div>
        </div>
    );
}
