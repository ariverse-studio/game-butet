"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Crosshair, Zap, RotateCcw } from "lucide-react";
import { useCoins } from "../../context/CoinContext";
import { useSound } from "../../hooks/useSound";
import confetti from "canvas-confetti";
import clsx from "clsx";

// --- Constants ---
const PROJECTILE_SPEED = 12;
const ENEMY_BASE_SPEED = 0.5;
const FIRE_COOLDOWN = 400; // ms

interface GameObject {
    id: number;
    angle: number; // Degrees
    distance: number; // From center
    type: "enemy" | "projectile";
    speed: number;
}

export default function AngleDefenseGame() {
    const { addCoins } = useCoins();

    // SFX
    const playLaser = useSound("https://cdn.pixabay.com/audio/2022/03/10/audio_c29668582b.mp3"); // Laser pew
    const playExplosion = useSound("https://cdn.pixabay.com/audio/2021/08/04/audio_03d6d02d08.mp3"); // Explosion
    const playClick = useSound("https://cdn.pixabay.com/audio/2025/05/23/audio_ec08d1525d.mp3");

    // Game State
    const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
    const [score, setScore] = useState(0);
    const [turretAngle, setTurretAngle] = useState(0);
    const [enemies, setEnemies] = useState<GameObject[]>([]);
    const [projectiles, setProjectiles] = useState<GameObject[]>([]);
    const [lastFired, setLastFired] = useState(0);

    // Refs for Loop
    const requestRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);
    const spawnTimerRef = useRef<number>(0);
    const enemiesRef = useRef<GameObject[]>([]);
    const projectilesRef = useRef<GameObject[]>([]);
    const gameStateRef = useRef<"menu" | "playing" | "gameover">("menu");

    // Sync refs with state for the loop
    useEffect(() => {
        enemiesRef.current = enemies;
        projectilesRef.current = projectiles;
        gameStateRef.current = gameState;
    }, [enemies, projectiles, gameState]);

    const startGame = () => {
        setScore(0);
        setEnemies([]);
        setProjectiles([]);
        setGameState("playing");
        setTurretAngle(0);
        lastTimeRef.current = performance.now();
        spawnTimerRef.current = 0;
    };

    const spawnEnemy = () => {
        const id = Date.now() + Math.random();
        const angle = Math.floor(Math.random() * 360);
        const speed = ENEMY_BASE_SPEED + (score / 500); // Difficulty ramp

        setEnemies(prev => [
            ...prev,
            { id, angle, distance: 100, type: "enemy", speed } // Distance in %
        ]);
    };

    const fireProjectile = () => {
        const now = Date.now();
        if (now - lastFired < FIRE_COOLDOWN) return;

        playLaser();
        setLastFired(now);

        const id = now + Math.random();
        setProjectiles(prev => [
            ...prev,
            { id, angle: turretAngle, distance: 0, type: "projectile", speed: PROJECTILE_SPEED }
        ]);
    };

    // --- Game Loop ---
    const update = useCallback((time: number) => {
        if (gameStateRef.current !== "playing") return;

        const deltaTime = time - lastTimeRef.current;
        lastTimeRef.current = time;

        // 1. Spawning
        spawnTimerRef.current += deltaTime;
        // Spawn rate scales slightly with score to get harder
        const spawnRate = Math.max(1500, 3000 - (score * 5));
        if (spawnTimerRef.current > spawnRate) {
            spawnEnemy();
            spawnTimerRef.current = 0;
        }

        // 2. Move Projectiles
        setProjectiles(prevProps => {
            return prevProps
                .map(p => ({ ...p, distance: p.distance + (p.speed / 3) }))
                .filter(p => p.distance < 110); // Remove if off screen
        });

        // 3. Move Enemies & Check Collisions
        setEnemies(prevEnemies => {
            const nextEnemies: GameObject[] = [];
            const destroyedIndices = new Set<number>();
            let gameOver = false;

            prevEnemies.forEach((enemy, enemyIdx) => {
                // Move
                const newDist = enemy.distance - enemy.speed;

                // Check Game Over
                if (newDist < 10) {
                    gameOver = true;
                }

                // Check Collision with Projectiles
                // We use refs here because projectiles rely on state updates which might be batched
                // But for simplicity in this loop, we can check against the CURRENT state of projectiles?
                // Actually, state updates in React are async.
                // Best approach in React Loop: Check against the projectiles we just calculated?
                // For this simple ver, let's just use the `projectilesRef` or strict math.

                // Let's check against `projectilesRef.current` which might be one frame behind, or 
                // we handle collision in a separate effect?
                // BETTER: Do it all in one state update if possible, or use Refs for positions.
                // Given the constraints, let's use a "Collision Step" approach.
            });

            if (gameOver) {
                setGameState("gameover");
                return prevEnemies;
            }

            return prevEnemies.map(e => ({ ...e, distance: e.distance - e.speed })).filter(e => e.distance > 0);
        });

        // --- Redoing Logic for Synchronous Update ---
        // React State is not ideal for complex physics loops due to closures.
        // We will move "Physics" to Refs, and only "Render" from State.

        requestRef.current = requestAnimationFrame(update);
    }, [score]);


    // --- Revised Game Loop using Refs for Physics ---
    useEffect(() => {
        if (gameState === "playing") {
            const loop = (time: number) => {
                const dt = time - lastTimeRef.current;
                lastTimeRef.current = time;

                // SPAWN
                spawnTimerRef.current += dt;
                const currentScore = parseInt(document.getElementById('score-hidden')?.innerText || "0");
                const spawnRate = Math.max(1000, 3000 - (currentScore * 10));

                if (spawnTimerRef.current > spawnRate) {
                    const id = Date.now() + Math.random();
                    const angle = Math.floor(Math.random() * 360);
                    const speed = ENEMY_BASE_SPEED + (currentScore / 1000);
                    enemiesRef.current.push({ id, angle, distance: 100, type: "enemy", speed });
                    spawnTimerRef.current = 0;
                }

                // UPDATE PROJECTILES
                projectilesRef.current = projectilesRef.current
                    .map(p => ({ ...p, distance: p.distance + (p.speed / 3) }))
                    .filter(p => p.distance < 110);

                // UPDATE ENEMIES
                let gameOver = false;
                enemiesRef.current = enemiesRef.current
                    .map(e => ({ ...e, distance: e.distance - e.speed }));

                // COLLISIONS
                const hitEnemies = new Set<number>();
                const hitProjectiles = new Set<number>();
                const HIT_ANGLE_TOLERANCE = 12; // Degrees
                const HIT_DIST_TOLERANCE = 5; // Pixels in %

                projectilesRef.current.forEach(p => {
                    enemiesRef.current.forEach(e => {
                        if (hitEnemies.has(e.id) || hitProjectiles.has(p.id)) return;

                        // Check if they are at similar distance
                        if (Math.abs(p.distance - e.distance) < HIT_DIST_TOLERANCE) {
                            // Check angle difference (handle 359 vs 1 wrap-around)
                            let angleDiff = Math.abs(p.angle - e.angle);
                            if (angleDiff > 180) angleDiff = 360 - angleDiff;

                            if (angleDiff < HIT_ANGLE_TOLERANCE) {
                                // HIT!
                                hitEnemies.add(e.id);
                                hitProjectiles.add(p.id);

                                // Effects
                                playExplosion();
                                setScore(s => s + 100);
                                addCoins(10);
                            }
                        }
                    });
                });

                // Remove hits
                enemiesRef.current = enemiesRef.current.filter(e => !hitEnemies.has(e.id));
                projectilesRef.current = projectilesRef.current.filter(p => !hitProjectiles.has(p.id));

                // Check Game Over
                enemiesRef.current.forEach(e => {
                    if (e.distance < 10) gameOver = true;
                });

                if (gameOver) {
                    setGameState("gameover");
                    enemiesRef.current = [];
                    projectilesRef.current = [];
                } else {
                    // Sync to State for Render
                    setEnemies([...enemiesRef.current]);
                    setProjectiles([...projectilesRef.current]);
                    requestRef.current = requestAnimationFrame(loop);
                }
            };

            requestRef.current = requestAnimationFrame(loop);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [gameState]);


    // Handlers
    const handleFire = () => {
        if (gameState !== "playing") return;
        const now = Date.now();
        if (now - lastFired < FIRE_COOLDOWN) return;

        playLaser();
        setLastFired(now);
        projectilesRef.current.push({
            id: now + Math.random(),
            angle: turretAngle,
            distance: 20,
            type: "projectile",
            speed: PROJECTILE_SPEED
        });
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans overflow-hidden">
            {/* Hidden Score for Ref Access hack */}
            <div id="score-hidden" className="hidden">{score}</div>

            {/* Header */}
            <header className="p-4 bg-slate-800/80 backdrop-blur border-b border-slate-700 flex justify-between items-center sticky top-0 z-50">
                <Link href="/" className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                    <ArrowLeft className="text-slate-400" />
                </Link>
                <div className="font-bold text-slate-200 text-lg tracking-wider flex items-center gap-4">
                    ANGLE DEFENSE
                    <span className="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full text-sm border border-indigo-500/30">
                        Score: {score}
                    </span>
                </div>
                <button onClick={startGame} className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400">
                    <RotateCcw size={20} />
                </button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4 relative">

                {/* Game Container */}
                <div className="relative w-full max-w-[600px] aspect-square">

                    {/* RADAR BACKGROUND */}
                    <div className="absolute inset-0 rounded-full border border-slate-700/50 overflow-hidden">
                        {/* Grid Lines */}
                        {[0, 45, 90, 135].map(deg => (
                            <div
                                key={deg}
                                className="absolute top-1/2 left-1/2 w-full h-px bg-slate-800 -translate-x-1/2 -translate-y-1/2"
                                style={{ transform: `translate(-50%, -50%) rotate(${deg}deg)` }}
                            />
                        ))}
                        {[20, 40, 60, 80, 100].map(dia => (
                            <div
                                key={dia}
                                className="absolute top-1/2 left-1/2 border border-slate-800/50 rounded-full -translate-x-1/2 -translate-y-1/2"
                                style={{ width: `${dia}%`, height: `${dia}%` }}
                            />
                        ))}

                        {/* Labels */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-slate-600 font-mono text-xs">270°</div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-600 font-mono text-xs">90°</div>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-mono text-xs">180°</div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 font-mono text-xs">0° (360°)</div>
                    </div>

                    {/* PROJECTILES */}
                    {projectiles.map(p => (
                        <div
                            key={p.id}
                            className="absolute w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]"
                            style={{
                                top: `${50 + Math.sin(p.angle * Math.PI / 180) * p.distance / 2}%`,
                                left: `${50 + Math.cos(p.angle * Math.PI / 180) * p.distance / 2}%`,
                                transform: 'translate(-50%, -50%)' // Center the dot
                            }}
                        />
                    ))}

                    {/* ENEMIES */}
                    {enemies.map(e => (
                        <div
                            key={e.id}
                            className="absolute w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full border-2 border-red-300 shadow-md flex items-center justify-center"
                            style={{
                                top: `${50 + Math.sin(e.angle * Math.PI / 180) * e.distance / 2}%`,
                                left: `${50 + Math.cos(e.angle * Math.PI / 180) * e.distance / 2}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <span className="text-[6px] sm:text-[8px] text-white font-bold opacity-50">{e.angle}°</span>
                        </div>
                    ))}

                    {/* PLAYER TURRET */}
                    <div
                        className="absolute w-0 h-0 border-l-[10px] sm:border-l-[15px] border-l-transparent border-r-[10px] sm:border-r-[15px] border-r-transparent border-b-[30px] sm:border-b-[40px] border-b-indigo-500 blur-[1px] opacity-50"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) rotate(${turretAngle + 90}deg)`,
                            transformOrigin: '50% 50% 0px'
                        }}
                    />
                    {/* Active Turret visual */}
                    <div
                        className="absolute w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-end"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) rotate(${turretAngle}deg)`,
                            transformOrigin: 'center center'
                        }}
                    >
                        {/* Triangle Ship */}
                        <div className="w-0 h-0 border-t-[8px] sm:border-t-[10px] border-t-transparent border-b-[8px] sm:border-b-[10px] border-b-transparent border-l-[25px] sm:border-l-[30px] border-l-cyan-400 relative z-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                            {/* Guide Line */}
                            {gameState === "playing" && (
                                <div className="absolute top-1/2 left-0 w-[150px] sm:w-[300px] h-px bg-cyan-500/20 -z-10 -translate-y-1/2 origin-left pointer-events-none" />
                            )}
                        </div>
                    </div>

                    {/* Game Over Screen */}
                    {gameState === "gameover" && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50 animate-in fade-in zoom-in duration-300 rounded-full">
                            <h2 className="text-4xl font-bold text-red-500 mb-2">GAME OVER</h2>
                            <p className="text-2xl text-white mb-6">Score: {score}</p>
                            <button
                                onClick={startGame}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                            >
                                <RotateCcw size={20} /> Try Again
                            </button>
                        </div>
                    )}

                    {/* Menu Screen */}
                    {gameState === "menu" && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-8 text-center rounded-full">
                            <Crosshair size={64} className="text-cyan-400 mb-4 animate-spin-slow" />
                            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-indigo-500 mb-4 drop-shadow-[0_2px_10px_rgba(6,182,212,0.5)]">
                                ANGLE DEFENSE
                            </h1>
                            <p className="text-slate-300 mb-8 max-w-md text-lg">
                                Master your geometry to survive! Aim your turret to match the enemy's angle and
                                <span className="text-yellow-400 font-bold ml-1">FIRE</span>!
                            </p>
                            <button
                                onClick={startGame}
                                className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white text-xl rounded-full font-bold shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 group relative overflow-hidden"
                            >
                                <span className="relative z-10">START DEFENSE</span>
                                <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    )}

                </div>

                {/* CONTROLS */}
                <div className="w-full max-w-2xl bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 mt-6 flex flex-col gap-6">
                    <div className="flex justify-between items-center px-2 text-xs font-mono text-slate-400">
                        <span>0°</span>
                        <div className="text-2xl font-bold text-cyan-400 font-sans tracking-widest">{turretAngle}°</div>
                        <span>360°</span>
                    </div>

                    <input
                        type="range"
                        min="0"
                        max="359"
                        value={turretAngle}
                        onChange={(e) => setTurretAngle(parseInt(e.target.value))}
                        className="w-full h-4 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 pointer-events-auto"
                        disabled={gameState !== "playing"}
                    />

                    <button
                        onMouseDown={handleFire}
                        onTouchStart={handleFire}
                        disabled={gameState !== "playing"}
                        className={clsx(
                            "w-full py-6 rounded-xl font-black text-2xl tracking-widest transition-all shadow-lg active:scale-[0.98] border-b-4",
                            gameState === "playing"
                                ? "bg-red-600 hover:bg-red-500 active:bg-red-700 text-white border-red-800 active:border-red-900 shadow-red-900/50"
                                : "bg-slate-700 text-slate-500 border-slate-800 cursor-not-allowed"
                        )}
                    >
                        FIRE CANNON
                    </button>
                </div>

            </main>
        </div>
    );
}
