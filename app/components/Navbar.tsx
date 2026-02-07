"use client";

import Link from "next/link";
import { Coins, Info, Settings } from "lucide-react";
import { useCoins } from "../context/CoinContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Navbar() {
    const { totalCoins } = useCoins();
    const [isPopping, setIsPopping] = useState(false);

    // Trigger pop animation when coins change
    useEffect(() => {
        setIsPopping(true);
        const timer = setTimeout(() => setIsPopping(false), 300);
        return () => clearTimeout(timer);
    }, [totalCoins]);

    return (
        <nav className="w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
            <Link href="/" className="text-2xl font-extrabold text-indigo-600 tracking-tight hover:opacity-80 transition-opacity">
                Math Masters
            </Link>

            <div className="flex items-center gap-4">
                <Link href="/about" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors" title="About">
                    <Info size={20} />
                </Link>
                <Link href="/settings" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors" title="Settings">
                    <Settings size={20} />
                </Link>

                <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
                    <motion.div
                        animate={isPopping ? { scale: 1.5, rotate: 20 } : { scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                        <Coins className="text-amber-500 fill-amber-500" size={24} />
                    </motion.div>

                    <AnimatePresence mode="wait">
                        <motion.span
                            key={totalCoins}
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 10, opacity: 0 }}
                            className="font-bold text-slate-700 text-lg min-w-[30px] text-right"
                        >
                            {totalCoins}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    );
}
