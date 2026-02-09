"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Trophy, Star } from "lucide-react";
import { useCoins } from "@/app/context/CoinContext";
import confetti from "canvas-confetti";

// ============================================
// TYPES & INTERFACES
// ============================================

type GameMode = "guess-degree" | "find-angle";
type DifficultyLevel = 1 | 2 | 3;

interface AngleOption {
    degree: number;
    id: string;
}

interface Round {
    mode: GameMode;
    targetDegree: number;
    options: AngleOption[];
    correctId: string;
}

// ============================================
// GAME CONFIGURATION
// ============================================

const DIFFICULTY_ANGLES: Record<DifficultyLevel, number[]> = {
    1: [30, 45, 60, 90, 180], // Common angles
    2: [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 180], // Increments of 15
    3: Array.from({ length: 18 }, (_, i) => (i + 1) * 10), // 10 to 180 by 10s
};

const COINS_PER_CORRECT = 10;
const ROUNDS_PER_GAME = 10;

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateDistractors(
    target: number,
    pool: number[],
    count: number
): number[] {
    const distractors: number[] = [];
    const available = pool.filter((d) => d !== target);

    while (distractors.length < count && available.length > 0) {
        const idx = Math.floor(Math.random() * available.length);
        const distractor = available.splice(idx, 1)[0];
        distractors.push(distractor);
    }

    return distractors;
}

function generateRound(level: DifficultyLevel): Round {
    const mode: GameMode = Math.random() > 0.5 ? "guess-degree" : "find-angle";
    const anglePool = DIFFICULTY_ANGLES[level];
    const targetDegree = getRandomElement(anglePool);

    if (mode === "guess-degree") {
        // Show one angle, 4 degree options
        const distractors = generateDistractors(targetDegree, anglePool, 3);
        const allOptions = [targetDegree, ...distractors]
            .sort(() => Math.random() - 0.5)
            .map((deg, idx) => ({
                degree: deg,
                id: `opt-${idx}`,
            }));

        const correctId =
            allOptions.find((opt) => opt.degree === targetDegree)?.id || "";

        return {
            mode,
            targetDegree,
            options: allOptions,
            correctId,
        };
    } else {
        // Show 3 angles, find the target
        const distractors = generateDistractors(targetDegree, anglePool, 2);
        const allOptions = [targetDegree, ...distractors]
            .sort(() => Math.random() - 0.5)
            .map((deg, idx) => ({
                degree: deg,
                id: `opt-${idx}`,
            }));

        const correctId =
            allOptions.find((opt) => opt.degree === targetDegree)?.id || "";

        return {
            mode,
            targetDegree,
            options: allOptions,
            correctId,
        };
    }
}

// ============================================
// ANGLE SVG COMPONENT
// ============================================

interface AngleSVGProps {
    degree: number;
    state?: "neutral" | "correct" | "wrong";
    animate?: boolean;
    size?: number;
}

function AngleSVG({
    degree,
    state = "neutral",
    animate = false,
    size = 200,
}: AngleSVGProps) {
    const centerX = size / 2;
    const centerY = size / 2;
    const armLength = size * 0.35;
    const arcRadius = size * 0.15;

    // First arm: horizontal to the right
    const arm1X = centerX + armLength;
    const arm1Y = centerY;

    // Second arm: rotated by degree
    const radians = (degree * Math.PI) / 180;
    const arm2X = centerX + armLength * Math.cos(radians);
    const arm2Y = centerY - armLength * Math.sin(radians); // SVG Y is inverted

    // Arc path
    const largeArcFlag = degree > 180 ? 1 : 0;
    const arcPath = `
        M ${centerX + arcRadius} ${centerY}
        A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 0 ${centerX + arcRadius * Math.cos(radians)} ${centerY - arcRadius * Math.sin(radians)}
    `;

    const strokeColor =
        state === "correct"
            ? "#10b981"
            : state === "wrong"
                ? "#ef4444"
                : "#000000";

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="mx-auto"
        >
            {/* Arm 1 (horizontal) */}
            <line
                x1={centerX}
                y1={centerY}
                x2={arm1X}
                y2={arm1Y}
                stroke={strokeColor}
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* Arm 2 (angled) */}
            <line
                x1={centerX}
                y1={centerY}
                x2={arm2X}
                y2={arm2Y}
                stroke={strokeColor}
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* Arc */}
            <motion.path
                d={arcPath}
                fill="none"
                stroke={strokeColor}
                strokeWidth="2"
                initial={animate ? { pathLength: 0 } : { pathLength: 1 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Center dot */}
            <circle cx={centerX} cy={centerY} r="3" fill={strokeColor} />
        </svg>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function AngleMaster() {
    const { addCoins } = useCoins();

    const [level, setLevel] = useState<DifficultyLevel>(1);
    const [roundIndex, setRoundIndex] = useState(0);
    const [currentRound, setCurrentRound] = useState<Round | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // Generate initial round
    useEffect(() => {
        setCurrentRound(generateRound(level));
    }, [level]);

    const handleAnswer = (id: string) => {
        if (selectedId || !currentRound) return;

        setSelectedId(id);
        const isCorrect = id === currentRound.correctId;
        setFeedback(isCorrect ? "correct" : "wrong");

        if (isCorrect) {
            setScore((prev) => prev + 1);
            addCoins(COINS_PER_CORRECT);
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.6 },
            });
        }

        // Move to next round after delay
        setTimeout(() => {
            if (roundIndex + 1 >= ROUNDS_PER_GAME) {
                setGameOver(true);
            } else {
                setRoundIndex((prev) => prev + 1);
                setCurrentRound(generateRound(level));
                setSelectedId(null);
                setFeedback(null);
            }
        }, 2000);
    };

    const resetGame = () => {
        setRoundIndex(0);
        setScore(0);
        setGameOver(false);
        setSelectedId(null);
        setFeedback(null);
        setCurrentRound(generateRound(level));
    };

    if (gameOver) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
                >
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                    <h2 className="text-3xl font-bold mb-2">Game Complete!</h2>
                    <p className="text-gray-600 mb-6">
                        You scored <span className="font-bold text-2xl text-blue-600">{score}</span> out of {ROUNDS_PER_GAME}
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={resetGame}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                        >
                            Play Again
                        </button>
                        <button
                            onClick={() => {
                                setLevel((prev) =>
                                    prev < 3 ? ((prev + 1) as DifficultyLevel) : 1
                                );
                                resetGame();
                            }}
                            className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
                        >
                            Level {level < 3 ? level + 1 : 1}
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!currentRound) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Angle Master
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="bg-white px-4 py-2 rounded-lg shadow">
                            <span className="text-sm text-gray-600">Level</span>
                            <span className="ml-2 font-bold text-lg">{level}</span>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg shadow">
                            <span className="text-sm text-gray-600">Round</span>
                            <span className="ml-2 font-bold text-lg">
                                {roundIndex + 1}/{ROUNDS_PER_GAME}
                            </span>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-lg shadow flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className="font-bold text-lg">{score}</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                        className="bg-blue-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                            width: `${((roundIndex + 1) / ROUNDS_PER_GAME) * 100}%`,
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Game Content */}
            <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={roundIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {currentRound.mode === "guess-degree" ? (
                            <GuessDegreeMode
                                round={currentRound}
                                selectedId={selectedId}
                                feedback={feedback}
                                onAnswer={handleAnswer}
                            />
                        ) : (
                            <FindAngleMode
                                round={currentRound}
                                selectedId={selectedId}
                                feedback={feedback}
                                onAnswer={handleAnswer}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

// ============================================
// MODE A: GUESS THE DEGREE
// ============================================

interface ModeProps {
    round: Round;
    selectedId: string | null;
    feedback: "correct" | "wrong" | null;
    onAnswer: (id: string) => void;
}

function GuessDegreeMode({ round, selectedId, feedback, onAnswer }: ModeProps) {
    const angleState =
        selectedId === round.correctId
            ? "correct"
            : selectedId
                ? "wrong"
                : "neutral";

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
                What is the measure of this angle?
            </h2>

            {/* Angle Display */}
            <div className="mb-8 bg-gray-50 rounded-xl p-8 border-2 border-gray-200">
                <AngleSVG
                    degree={round.targetDegree}
                    state={angleState}
                    animate={true}
                    size={280}
                />
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
                {round.options.map((option) => {
                    const isSelected = selectedId === option.id;
                    const isCorrect = option.id === round.correctId;
                    const showCorrect = feedback && isCorrect;
                    const showWrong = feedback && isSelected && !isCorrect;

                    return (
                        <motion.button
                            key={option.id}
                            onClick={() => onAnswer(option.id)}
                            disabled={!!selectedId}
                            whileHover={!selectedId ? { scale: 1.02 } : {}}
                            whileTap={!selectedId ? { scale: 0.98 } : {}}
                            className={`
                                relative py-6 px-8 rounded-xl font-bold text-2xl
                                transition-all duration-300 border-3
                                ${showCorrect
                                    ? "bg-green-100 border-green-500 text-green-700"
                                    : showWrong
                                        ? "bg-red-100 border-red-500 text-red-700"
                                        : "bg-white border-gray-300 text-gray-900 hover:border-blue-500 hover:bg-blue-50"
                                }
                                ${selectedId ? "cursor-not-allowed" : "cursor-pointer"}
                            `}
                        >
                            {option.degree}°
                            {showCorrect && (
                                <Check className="absolute top-3 right-3 w-6 h-6 text-green-600" />
                            )}
                            {showWrong && (
                                <X className="absolute top-3 right-3 w-6 h-6 text-red-600" />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================
// MODE B: FIND THE ANGLE
// ============================================

function FindAngleMode({ round, selectedId, feedback, onAnswer }: ModeProps) {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
                Which one is{" "}
                <span className="text-blue-600 font-bold">
                    {round.targetDegree}°
                </span>
                ?
            </h2>

            {/* Angle Options */}
            <div className="grid grid-cols-3 gap-6">
                {round.options.map((option) => {
                    const isSelected = selectedId === option.id;
                    const isCorrect = option.id === round.correctId;
                    const showCorrect = feedback && isCorrect;
                    const showWrong = feedback && isSelected && !isCorrect;

                    const angleState = showCorrect
                        ? "correct"
                        : showWrong
                            ? "wrong"
                            : "neutral";

                    return (
                        <motion.button
                            key={option.id}
                            onClick={() => onAnswer(option.id)}
                            disabled={!!selectedId}
                            whileHover={!selectedId ? { scale: 1.05 } : {}}
                            whileTap={!selectedId ? { scale: 0.95 } : {}}
                            className={`
                                relative p-6 rounded-xl border-3 transition-all duration-300
                                ${showCorrect
                                    ? "bg-green-100 border-green-500"
                                    : showWrong
                                        ? "bg-red-100 border-red-500"
                                        : "bg-gray-50 border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                                }
                                ${selectedId ? "cursor-not-allowed" : "cursor-pointer"}
                            `}
                        >
                            <AngleSVG
                                degree={option.degree}
                                state={angleState}
                                animate={false}
                                size={180}
                            />
                            {showCorrect && (
                                <Check className="absolute top-3 right-3 w-6 h-6 text-green-600" />
                            )}
                            {showWrong && (
                                <X className="absolute top-3 right-3 w-6 h-6 text-red-600" />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
