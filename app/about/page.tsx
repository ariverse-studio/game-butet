import Link from "next/link";
import { ArrowLeft, Gamepad2, Heart } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <header className="p-6 bg-white border-b border-slate-200 flex items-center gap-4 sticky top-0 z-50">
                <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="text-slate-500" />
                </Link>
                <h1 className="font-bold text-xl text-slate-700">About</h1>
            </header>

            <main className="max-w-2xl mx-auto p-6 mt-8 flex flex-col gap-8">

                {/* Hero */}
                <div className="text-center py-12">
                    <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200 rotate-3">
                        <Gamepad2 size={40} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Math Masters</h1>
                    <p className="text-lg text-slate-500 font-medium">v1.0.0</p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
                    <p className="leading-relaxed text-slate-600">
                        <strong className="text-indigo-600">Math Masters</strong> is a fun, interactive platform designed to make learning mathematics engaging through gamification.
                        Inspired by platforms like Brilliant.org and GeoGebra, we aim to build intuition over rote memorization.
                    </p>

                    <hr className="border-slate-100" />

                    <h3 className="font-bold text-slate-800 text-lg">Our Games</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <span className="w-2 h-2 rounded-full bg-red-500" /> Factor Ninja
                        </li>
                        <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <span className="w-2 h-2 rounded-full bg-orange-500" /> Pattern Bridge
                        </li>
                        <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <span className="w-2 h-2 rounded-full bg-blue-500" /> Algebra Balance
                        </li>
                        <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <span className="w-2 h-2 rounded-full bg-purple-500" /> Function Machine
                        </li>
                        <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" /> Angle Commander
                        </li>
                        <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Data Detective
                        </li>
                    </ul>

                    <hr className="border-slate-100" />

                    <div className="text-center">
                        <p className="text-slate-500 text-sm mb-2">Developed with <Heart size={14} className="inline text-red-500 fill-red-500" /> by</p>
                        <h4 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            Ariverse Studio
                        </h4>
                    </div>
                </div>

                <div className="text-center text-slate-400 text-sm">
                    &copy; {new Date().getFullYear()} Ariverse Studio. All rights reserved.
                </div>

            </main>
        </div>
    );
}
