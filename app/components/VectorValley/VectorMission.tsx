"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Target, Bot, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";

interface Point {
    x: number;
    y: number;
}

interface Level {
    start: Point;
    target: Point;
    walls: Point[];
}

const LEVELS: Level[] = [
    { start: { x: 1, y: 1 }, target: { x: 8, y: 8 }, walls: [] },
    { start: { x: 1, y: 1 }, target: { x: 8, y: 2 }, walls: [{ x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }] },
];

export default function VectorMission({ onComplete }: { onComplete: (score: number) => void }) {
    const [levelIdx, setLevelIdx] = useState(0);
    const [playerPos, setPlayerPos] = useState<Point>(LEVELS[0].start);
    const [dragVector, setDragVector] = useState<Point | null>(null);
    const [isMoving, setIsMoving] = useState(false);
    const [feedback, setFeedback] = useState<"crash" | "success" | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();

    const gridSize = 10;
    const cellSize = 60; // pixels per grid unit

    const currentLevel = LEVELS[levelIdx];

    useEffect(() => {
        setPlayerPos(currentLevel.start);
        setFeedback(null);
    }, [levelIdx, currentLevel]);

    const handlePointerDown = (e: React.PointerEvent) => {
        if (isMoving || feedback) return;
        setDragVector({ x: 0, y: 0 });
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragVector || isMoving || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + playerPos.x * cellSize + cellSize / 2;
        const centerY = rect.top + (gridSize - 1 - playerPos.y) * cellSize + cellSize / 2;

        const dx = (e.clientX - centerX) / cellSize;
        const dy = -(e.clientY - centerY) / cellSize; // Invert Y for Cartesian

        // Snap to grid
        setDragVector({
            x: Math.round(dx),
            y: Math.round(dy)
        });
    };

    const handlePointerUp = async () => {
        if (!dragVector || isMoving) {
            setDragVector(null);
            return;
        }

        const newPos = {
            x: playerPos.x + dragVector.x,
            y: playerPos.y + dragVector.y
        };

        // Check bounds
        if (newPos.x < 0 || newPos.x >= gridSize || newPos.y < 0 || newPos.y >= gridSize) {
            setFeedback("crash");
            setDragVector(null);
            return;
        }

        // Check walls (simple line-point check or just target point check for simplicity)
        // User asked for "Did the line cross a wall block?"
        // We'll check every integer step along the vector
        let crashed = false;
        const steps = Math.max(Math.abs(dragVector.x), Math.abs(dragVector.y));
        for (let i = 1; i <= steps; i++) {
            const ratio = i / steps;
            const checkPos = {
                x: Math.round(playerPos.x + dragVector.x * ratio),
                y: Math.round(playerPos.y + dragVector.y * ratio)
            };
            if (currentLevel.walls.some(w => w.x === checkPos.x && w.y === checkPos.y)) {
                crashed = true;
                break;
            }
        }

        setIsMoving(true);
        setDragVector(null);

        // Animate
        await controls.start({
            x: newPos.x * cellSize,
            y: (gridSize - 1 - newPos.y) * cellSize,
            transition: { duration: 0.8, ease: "easeInOut" }
        });

        setPlayerPos(newPos);
        setIsMoving(false);

        if (crashed) {
            setFeedback("crash");
        } else if (newPos.x === currentLevel.target.x && newPos.y === currentLevel.target.y) {
            setFeedback("success");
            setTimeout(() => {
                if (levelIdx + 1 < LEVELS.length) {
                    setLevelIdx(prev => prev + 1);
                } else {
                    onComplete(50);
                }
            }, 1500);
        }
    };

    const resetLevel = () => {
        setPlayerPos(currentLevel.start);
        setFeedback(null);
        controls.set({
            x: currentLevel.start.x * cellSize,
            y: (gridSize - 1 - currentLevel.start.y) * cellSize
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] px-6">
            <div className="mb-8 text-center">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Stage 2</div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Vector Mission</h3>
                <p className="text-slate-500 font-medium">Drag from the robot to plan your movement vector.</p>
            </div>

            <div
                ref={containerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="relative bg-white border border-slate-200 shadow-2xl rounded-xl p-0 touch-none select-none cursor-crosshair"
                style={{ width: gridSize * cellSize, height: gridSize * cellSize }}
            >
                {/* Grid Lines */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    {Array.from({ length: gridSize + 1 }).map((_, i) => (
                        <div key={`h-${i}`} className="absolute w-full h-px bg-slate-300" style={{ top: i * cellSize }} />
                    ))}
                    {Array.from({ length: gridSize + 1 }).map((_, i) => (
                        <div key={`v-${i}`} className="absolute h-full w-px bg-slate-300" style={{ left: i * cellSize }} />
                    ))}
                </div>

                {/* Target */}
                <div
                    className="absolute flex items-center justify-center text-red-500 animate-pulse"
                    style={{
                        left: currentLevel.target.x * cellSize,
                        top: (gridSize - 1 - currentLevel.target.y) * cellSize,
                        width: cellSize,
                        height: cellSize
                    }}
                >
                    <Target size={32} />
                </div>

                {/* Walls */}
                {currentLevel.walls.map((wall, i) => (
                    <div
                        key={i}
                        className="absolute bg-slate-900 rounded-sm"
                        style={{
                            left: wall.x * cellSize,
                            top: (gridSize - 1 - wall.y) * cellSize,
                            width: cellSize,
                            height: cellSize
                        }}
                    />
                ))}

                {/* Vector Arrow (During Drag) */}
                {dragVector && (
                    <svg
                        className="absolute inset-0 pointer-events-none z-10 overflow-visible"
                        style={{ width: '100%', height: '100%' }}
                    >
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#4f46e5" />
                            </marker>
                        </defs>
                        <line
                            x1={playerPos.x * cellSize + cellSize / 2}
                            y1={(gridSize - 1 - playerPos.y) * cellSize + cellSize / 2}
                            x2={(playerPos.x + dragVector.x) * cellSize + cellSize / 2}
                            y2={(gridSize - 1 - (playerPos.y + dragVector.y)) * cellSize + cellSize / 2}
                            stroke="#4f46e5"
                            strokeWidth="4"
                            strokeDasharray="8 4"
                            markerEnd="url(#arrowhead)"
                        />
                    </svg>
                )}

                {/* Vector Label */}
                {dragVector && (
                    <div
                        className="absolute z-20 bg-indigo-600 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg pointer-events-none whitespace-nowrap"
                        style={{
                            left: (playerPos.x + dragVector.x) * cellSize + cellSize,
                            top: (gridSize - 1 - (playerPos.y + dragVector.y)) * cellSize
                        }}
                    >
                        Vector: ({dragVector.x}x, {dragVector.y}y)
                    </div>
                )}

                {/* Player (Robot) */}
                <motion.div
                    animate={controls}
                    initial={{
                        x: playerPos.x * cellSize,
                        y: (gridSize - 1 - playerPos.y) * cellSize
                    }}
                    className="absolute flex items-center justify-center text-indigo-600 z-30"
                    style={{ width: cellSize, height: cellSize }}
                >
                    <Bot size={40} strokeWidth={2.5} />
                </motion.div>

                {/* Feedback Overlays */}
                <AnimatePresence>
                    {feedback === "crash" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-red-500/20 backdrop-blur-[2px] z-40 flex flex-col items-center justify-center p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                                <AlertTriangle size={32} />
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 mb-2">Collision Detected!</h4>
                            <p className="text-slate-600 font-medium mb-6 text-sm">You hit a wall or went out of bounds.</p>
                            <button
                                onClick={resetLevel}
                                className="px-6 py-3 bg-slate-900 text-white font-black rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition-all"
                            >
                                <RefreshCw size={18} /> RETRY MISSION
                            </button>
                        </motion.div>
                    )}
                    {feedback === "success" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-green-500/20 backdrop-blur-[2px] z-40 flex flex-col items-center justify-center p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-xl animate-bounce">
                                <ArrowRight size={32} />
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 mb-2">Target Reached!</h4>
                            <p className="text-slate-600 font-medium text-sm">Vector analysis complete.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Visual Legend */}
            <div className="mt-8 grid grid-cols-2 gap-8 max-w-md w-full">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity }}>
                            <ArrowRight size={18} />
                        </motion.div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technique</p>
                        <p className="text-xs font-bold text-slate-700">Drag to Aim</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <Bot size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Object</p>
                        <p className="text-xs font-bold text-slate-700">Snap to Grid</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
