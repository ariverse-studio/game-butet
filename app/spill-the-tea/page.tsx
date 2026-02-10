"use client";

import { CoinProvider } from "../context/CoinContext";
import Game from "../components/SpillTheTea/Game";
import { GamificationProvider } from "../context/GamificationContext";

export default function SpillTheTeaPage() {
    return (
        <CoinProvider>
            <GamificationProvider>
                <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                    <Game />
                </main>
            </GamificationProvider>
        </CoinProvider>
    );
}
