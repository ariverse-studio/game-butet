"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Trophy, Heart } from "lucide-react";
import Blade from "./Blade";
import NumberEntity from "./NumberEntity";
import { AnimatePresence } from "framer-motion";
import { useCoins } from "../../context/CoinContext";

// --- Game Constants & Helpers ---
const GRAVITY = 0.2;
const SPAWN_RATE = 1200; // ms
const MAX_LIVES = 3;

interface Entity {
    id: number;
    value: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
}

function isPrime(num: number): boolean {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

// Check collision between a line segment (p1 -> p2) and a circle (c)
function lineCircleIntersection(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    c: { x: number; y: number; r: number }
) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);

    if (len === 0) return false;

    const dot =
        ((c.x - p1.x) * dx + (c.y - p1.y) * dy) / Math.pow(len, 2);

    const closestX = p1.x + Math.max(0, Math.min(1, dot)) * dx;
    const closestY = p1.y + Math.max(0, Math.min(1, dot)) * dy;

    const distX = c.x - closestX;
    const distY = c.y - closestY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    return distance <= c.r;
}

export default function FactorNinjaGame() {
    const { addCoins } = useCoins();
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number | undefined>(undefined);
    const spawnTimerRef = useRef<number>(0);

    // Game State
    const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
    const [entities, setEntities] = useState<Entity[]>([]);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [bladePath, setBladePath] = useState<{ x: number; y: number }[]>([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(MAX_LIVES);

    // Mouse/Touch tracking
    const handlePointerMove = (e: React.PointerEvent) => {
        if (gameState !== "playing" || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setBladePath((prev) => {
            const newPath = [...prev, { x, y }];
            if (newPath.length > 8) newPath.shift(); // keep trail short
            return newPath;
        });
    };

    const handleSlice = (ent: Entity) => {
        const isPrimeNum = isPrime(ent.value);

        // Create particles
        const newParticles: Particle[] = [];
        const color = isPrimeNum ? "red" : "gold";
        const particleCount = 8;

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Math.random() * 5 + 2;
            newParticles.push({
                id: Date.now() + Math.random(),
                x: ent.x,
                y: ent.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                color
            });
        }
        setParticles(prev => [...prev, ...newParticles]);

        if (isPrimeNum) {
            // Bad Slice!
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(200);
            setLives((prev) => {
                const newLives = prev - 1;
                if (newLives <= 0) setGameState("gameover");
                return newLives;
            });
        } else {
            // Good Slice!
            setScore((prev) => prev + 10);
            addCoins(10);
        }
    };


    // --- Game Loop ---
    const gameLoop = useCallback((time: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = time;
        const deltaTime = time - lastTimeRef.current;
        lastTimeRef.current = time;

        // 1. Update Entities
        setEntities((prevEntities) => {
            return prevEntities
                .map((ent) => ({
                    ...ent,
                    x: ent.x + ent.vx,
                    y: ent.y + ent.vy,
                    vy: ent.vy + GRAVITY, // apply gravity
                }))
                .filter((ent) => ent.y < window.innerHeight + 200); // Remove if off-screen (bottom)
        });

        // 2. Update Particles
        setParticles((prev) =>
            prev
                .map(p => ({
                    ...p,
                    x: p.x + p.vx,
                    y: p.y + p.vy,
                    vy: p.vy + 0.1, // Gravity for particles
                    life: p.life - 0.02
                }))
                .filter(p => p.life > 0)
        );

        // 3. Spawning Logic
        if (gameState === "playing") { // Ensure we only spawn if playing
            spawnTimerRef.current += deltaTime;
            if (spawnTimerRef.current > SPAWN_RATE) {
                spawnEntity();
                spawnTimerRef.current = 0;
            }
        }

        requestRef.current = requestAnimationFrame(gameLoop);
    }, [gameState]);

    // Collision Detection Effect
    useEffect(() => {
        if (bladePath.length < 2 || entities.length === 0) return;

        const lastPoint = bladePath[bladePath.length - 1];
        const prevPoint = bladePath[bladePath.length - 2];

        const entitiesToRemove: number[] = [];

        entities.forEach((ent) => {
            if (
                lineCircleIntersection(prevPoint, lastPoint, {
                    x: ent.x,
                    y: ent.y,
                    r: ent.radius,
                })
            ) {
                handleSlice(ent);
                entitiesToRemove.push(ent.id);
            }
        });

        if (entitiesToRemove.length > 0) {
            setEntities((prev) => prev.filter((e) => !entitiesToRemove.includes(e.id)));
        }
    }, [bladePath, entities]);


    // Start/Stop Loop
    useEffect(() => {
        if (gameState === "playing") {
            requestRef.current = requestAnimationFrame(gameLoop);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameState, gameLoop]);

    const spawnEntity = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const id = Date.now() + Math.random();
        const value = Math.floor(Math.random() * 46) + 4; // 4 to 50
        const radius = 32;

        // Spawn at bottom, random X
        // Ensure we don't spawn too close to edges
        const x = Math.random() * (width - 100) + 50;
        const y = height + 50;

        // Velocity to throw it up and slightly inward
        const centerX = width / 2;
        const vx = (centerX - x) * 0.003 + (Math.random() - 0.5) * 2;
        const vy = -(Math.random() * 5 + 13); // Upward force

        setEntities((prev) => [...prev, { id, value, x, y, vx, vy, radius }]);
    };

    const startGame = () => {
        setScore(0);
        setLives(MAX_LIVES);
        setEntities([]);
        setBladePath([]);
        setParticles([]);
        setGameState("playing");
        lastTimeRef.current = undefined;
        spawnTimerRef.current = 0;
    };

    return (
        <div
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden bg-slate-900 touch-none select-none cursor-crosshair"
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerMove}
        >
            {/* Background UI */}
            <div className="absolute top-4 left-4 z-10 flex gap-4 text-white font-bold text-2xl drop-shadow-md">
                <Link href="/" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <ArrowLeft />
                </Link>
                <div className="flex items-center gap-2 select-none">
                    <Trophy className="text-yellow-400" /> {score}
                </div>
            </div>

            <div className="absolute top-4 right-4 z-10 flex gap-1">
                {Array.from({ length: MAX_LIVES }).map((_, i) => (
                    <Heart
                        key={i}
                        className={`transition-colors ${i < lives ? "fill-red-500 text-red-500" : "text-slate-700"}`}
                        size={32}
                    />
                ))}
            </div>

            {/* Game World - Render Particles first to be behind numbers */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        left: p.x,
                        top: p.y,
                        width: 12,
                        height: 12,
                        backgroundColor: p.color,
                        opacity: p.life,
                        transform: `scale(${p.life})`
                    }}
                />
            ))}

            <AnimatePresence>
                {entities.map((ent) => (
                    <NumberEntity
                        key={ent.id}
                        x={ent.x}
                        y={ent.y}
                        value={ent.value}
                        isPrime={isPrime(ent.value)}
                    />
                ))}
            </AnimatePresence>

            <Blade path={bladePath} />

            {/* Overlays */}
            {gameState === "menu" && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 text-white backdrop-blur-sm p-4 text-center">
                    <h1 className="text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500 mb-4 tracking-tighter -rotate-3 drop-shadow-lg">
                        FACTOR<br />NINJA
                    </h1>
                    <p className="mb-8 text-xl sm:text-2xl text-slate-200 max-w-lg leading-relaxed">
                        Slice <span className="text-yellow-400 font-bold">Composite Numbers</span>.<br />
                        Avoid <span className="text-red-500 font-bold">Prime Numbers</span>.
                    </p>
                    <button
                        onClick={startGame}
                        className="group relative px-10 py-5 bg-red-600 hover:bg-red-500 text-2xl font-bold rounded-full shadow-2xl transition-all hover:scale-105 hover:shadow-red-500/50"
                    >
                        <span className="relative z-10">PLAY GAME</span>
                        <div className="absolute inset-0 bg-white/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                    </button>
                </div>
            )}

            {gameState === "gameover" && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 text-white backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <h2 className="text-5xl font-bold mb-4 text-white">Game Over</h2>
                    <div className="text-4xl mb-8 font-mono text-yellow-400">Score: {score}</div>
                    <div className="flex gap-4">
                        <Link href="/" className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold transition-colors">
                            Menu
                        </Link>
                        <button
                            onClick={startGame}
                            className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                        >
                            <RefreshCw size={20} /> Try Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
