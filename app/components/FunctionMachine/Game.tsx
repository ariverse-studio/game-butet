"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Check } from "lucide-react";
import { useCoins } from "../../context/CoinContext";
import { useSound } from "../../hooks/useSound";
import { generateFunction, calculateOutput, FunctionRule } from "./functionLogic";
import DataTable from "./DataTable";
import MachineVisual from "./MachineVisual";
import confetti from "canvas-confetti";
import clsx from "clsx";

export default function FunctionMachineGame() {
    const { addCoins } = useCoins();

    // SFX
    const playSuccess = useSound("https://cdn.pixabay.com/audio/2021/08/09/audio_7232134569.mp3");
    const playError = useSound("https://cdn.pixabay.com/audio/2025/05/31/audio_e9d22d9131.mp3");
    const playClick = useSound("https://cdn.pixabay.com/audio/2025/05/23/audio_ec08d1525d.mp3");
    const playProcess = useSound("https://cdn.pixabay.com/audio/2022/03/15/audio_7318c4e426.mp3"); // Mechanical sound

    // Game State
    const [level, setLevel] = useState(1);
    const [rule, setRule] = useState<FunctionRule | null>(null);
    const [history, setHistory] = useState<{ input: number; output: number }[]>([]);
    const [phase, setPhase] = useState<"investigate" | "deduce">("investigate");

    // Animation State
    const [currentInput, setCurrentInput] = useState<number | null>(null);
    const [currentOutput, setCurrentOutput] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [machineState, setMachineState] = useState<"idle" | "success" | "error">("idle");

    // Inputs
    const [testInputs, setTestInputs] = useState<number[]>([]);
    const [targetInput, setTargetInput] = useState<number | null>(null);
    const [userAnswer, setUserAnswer] = useState("");

    // Initialize Level
    useEffect(() => {
        startLevel(level);
    }, [level]);

    const startLevel = (lvl: number) => {
        const newRule = generateFunction(lvl);
        setRule(newRule);
        setHistory([]);
        setPhase("investigate");
        setMachineState("idle");
        setUserAnswer("");
        setCurrentInput(null);
        setCurrentOutput(null);

        // Generate random test inputs (avoid duplicates)
        const inputs = new Set<number>();
        while (inputs.size < 3) {
            inputs.add(Math.floor(Math.random() * 10) + 1);
        }
        setTestInputs(Array.from(inputs).sort((a, b) => a - b));

        // Generate target for deduction
        let target = Math.floor(Math.random() * 10) + 1;
        while (inputs.has(target)) {
            target = Math.floor(Math.random() * 10) + 1; // Ensure target wasn't a test input
        }
        setTargetInput(target);
    };

    const runMachine = async (inputVal: number, isDeduction = false) => {
        if (!rule || isProcessing) return;

        playProcess();
        setIsProcessing(true);
        setCurrentInput(inputVal);
        setCurrentOutput(null);
        setMachineState("idle");

        // 1. Input slides in (visual handled by component state)
        await new Promise(r => setTimeout(r, 600));

        // 2. Process
        const out = calculateOutput(inputVal, rule);
        setCurrentOutput(out);
        setIsProcessing(false);

        // 3. Output slides out
        await new Promise(r => setTimeout(r, 400));

        // Update history
        setHistory(prev => [...prev, { input: inputVal, output: out }]);

        if (!isDeduction) {
            // Remove used test input
            setTestInputs(prev => prev.filter(n => n !== inputVal));

            // If ran out of test inputs, or just done enough, maybe auto-switch? 
            // For now, let user switch manually or when all inputs used.
            if (testInputs.length <= 1) { // checking 1 because state update hasn't reflected yet
                setTimeout(() => setPhase("deduce"), 500);
            }
        }
    };

    const checkDeduction = () => {
        if (!rule || !targetInput) return;

        const answer = parseInt(userAnswer, 10);
        const correct = calculateOutput(targetInput, rule);

        if (answer === correct) {
            playSuccess();
            setMachineState("success");
            addCoins(20 + (level * 5)); // Reward scales with level
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#8b5cf6', '#d946ef'] // Blue/Purple/Pink theme
            });
            setTimeout(() => {
                setLevel(l => l + 1);
            }, 2000);
        } else {
            playError();
            setMachineState("error");
            setTimeout(() => setMachineState("idle"), 1000);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
            {/* Header */}
            <header className="p-6 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-50">
                <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="text-slate-500" />
                </Link>
                <div className="font-bold text-slate-600 text-lg tracking-wider">
                    FUNCTION MACHINE <span className="text-indigo-500 ml-2">LVL {level}</span>
                </div>
                <button onClick={() => startLevel(level)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                    <RefreshCw size={20} />
                </button>
            </header>

            <main className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full p-4 gap-8 items-start justify-center mt-8">

                {/* Left: The Machine */}
                <div className="flex-1 flex flex-col items-center w-full">

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 w-full flex flex-col items-center gap-8 min-h-[400px] justify-center">
                        <MachineVisual
                            input={currentInput}
                            output={currentOutput}
                            isProcessing={isProcessing}
                            state={machineState}
                        />

                        {/* Controls */}
                        <div className="w-full max-w-md">
                            {phase === "investigate" ? (
                                <div className="flex flex-col gap-4 text-center">
                                    <p className="text-slate-500 font-medium">Test these inputs to find the rule:</p>
                                    <div className="flex justify-center gap-4">
                                        {testInputs.map(num => (
                                            <button
                                                key={num}
                                                onClick={() => { playClick(); runMachine(num); }}
                                                disabled={isProcessing}
                                                className="w-16 h-16 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 font-bold text-xl border-2 border-slate-200 hover:border-indigo-200 transition-all active:scale-95 disabled:opacity-50"
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setPhase("deduce")}
                                        className="mt-4 text-indigo-500 font-bold hover:underline text-sm"
                                    >
                                        I know the rule! Skip to Solve &rarr;
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6 items-center animate-in slide-in-from-bottom-4 duration-500">
                                    <p className="text-slate-600 text-lg font-medium">
                                        If input is <span className="font-bold text-indigo-600 text-2xl mx-1">{targetInput}</span>, output is?
                                    </p>

                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && checkDeduction()}
                                            className="w-32 p-4 text-center text-2xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                                            placeholder="?"
                                            autoFocus
                                        />
                                        <button
                                            onClick={checkDeduction}
                                            className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                                        >
                                            <Check size={32} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setPhase("investigate")}
                                        className="text-slate-400 font-medium hover:text-slate-600 text-sm"
                                    >
                                        &larr; Need more tests?
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Right: Data Table */}
                <div className="w-full md:w-80 flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                            <span className="w-2 h-6 bg-indigo-500 rounded-full" />
                            Data Log
                        </h3>
                        <DataTable history={history} />
                    </div>
                </div>

            </main>
        </div>
    );
}
