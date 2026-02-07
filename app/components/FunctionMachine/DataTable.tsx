import React from 'react';
import { motion } from 'framer-motion';

interface DataTableProps {
    history: { input: number; output: number }[];
}

export default function DataTable({ history }: DataTableProps) {
    return (
        <div className="w-full max-w-xs bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex bg-slate-50 border-b border-slate-200 p-3 font-bold text-slate-500 text-sm tracking-wide">
                <div className="flex-1 text-center border-r border-slate-200">INPUT (x)</div>
                <div className="flex-1 text-center">OUTPUT (y)</div>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
                {history.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm italic">
                        No data collected yet.
                    </div>
                ) : (
                    history.map((entry, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex border-b border-slate-100 last:border-0"
                        >
                            <div className="flex-1 p-3 text-center text-slate-700 font-mono text-lg border-r border-slate-100">
                                {entry.input}
                            </div>
                            <div className="flex-1 p-3 text-center text-indigo-600 font-bold font-mono text-lg">
                                {entry.output}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
