"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGamification } from "../context/GamificationContext";
import { CheckCircle, Info, X } from "lucide-react";

export default function ToastContainer() {
    const { notifications, dismissNotification } = useGamification();

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {notifications.map((n) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        layout
                        className="pointer-events-auto bg-white border border-slate-200 shadow-lg rounded-xl p-4 flex items-center gap-3 min-w-[300px]"
                    >
                        <div className={`p-2 rounded-full ${n.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                            {n.type === 'success' ? <CheckCircle size={20} /> : <Info size={20} />}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-700">{n.message}</p>
                        </div>
                        <button
                            onClick={() => dismissNotification(n.id)}
                            className="text-slate-400 hover:text-slate-600"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
