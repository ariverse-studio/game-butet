import { ReactNode } from "react";

interface ScaleProps {
    children: ReactNode;
    reading: number; // The weight displayed
}

export default function Scale({ children, reading }: ScaleProps) {
    return (
        <div className="flex flex-col items-center justify-end">

            {/* Objects on Scale */}
            <div className="mb-[-4px] flex flex-wrap justify-center items-end gap-1 min-h-[100px] px-8">
                {children}
            </div>

            {/* The Digital Scale Body */}
            <div className="relative flex flex-col items-center">
                {/* Top Plate */}
                <div className="w-48 sm:w-64 h-4 bg-slate-300 rounded-lg shadow-sm z-10" />

                {/* Main Body */}
                <div className="w-40 sm:w-56 h-20 sm:h-24 bg-slate-800 rounded-b-xl flex items-center justify-center p-3 sm:p-4 shadow-xl border-t-8 border-slate-700">
                    {/* Digital Display */}
                    <div className="bg-emerald-100 text-emerald-900 font-mono text-2xl sm:text-4xl px-4 sm:px-6 py-1 sm:py-2 rounded shadow-inner border-2 border-slate-600 min-w-[100px] sm:min-w-[120px] text-center">
                        {reading}
                    </div>
                </div>

                {/* Feet */}
                <div className="w-full flex justify-between px-6 -mt-2">
                    <div className="w-8 h-4 bg-slate-900 rounded-b-lg" />
                    <div className="w-8 h-4 bg-slate-900 rounded-b-lg" />
                </div>
            </div>

        </div>
    );
}
