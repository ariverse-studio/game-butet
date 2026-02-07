import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ProtractorProps {
    angle: number; // User's current angle
    target?: number | null; // The mystery target (only shown in result phase)
    showResult: boolean;
    isInteractive?: boolean;
}

export default function Protractor({ angle, target, showResult, isInteractive = true }: ProtractorProps) {
    const radius = 120;
    const center = 150;

    // Convert degrees to radians for coordinate calculation
    const toRad = (deg: number) => (deg - 90) * (Math.PI / 180);

    // Calculate arc path for target wedge
    const getWedgePath = (deg: number) => {
        const x = center + radius * Math.cos(toRad(deg));
        const y = center + radius * Math.sin(toRad(deg));
        const largeArc = deg > 180 ? 1 : 0;
        // Move to center, Line to top (0 deg), Arc to angle, Close to center
        return `M ${center} ${center} L ${center} ${center - radius} A ${radius} ${radius} 0 ${largeArc} 1 ${x} ${y} Z`;
    };

    return (
        <div className="relative w-[300px] h-[300px] select-none">
            <svg width="300" height="300" viewBox="0 0 300 300">
                {/* Background Circle */}
                <circle cx={center} cy={center} r={radius} fill="white" stroke="#e2e8f0" strokeWidth="2" />

                {/* Tick Marks (every 30 deg) */}
                {Array.from({ length: 12 }).map((_, i) => {
                    const deg = i * 30;
                    const x1 = center + (radius - 10) * Math.cos(toRad(deg));
                    const y1 = center + (radius - 10) * Math.sin(toRad(deg));
                    const x2 = center + radius * Math.cos(toRad(deg));
                    const y2 = center + radius * Math.sin(toRad(deg));
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cbd5e1" strokeWidth="2" />;
                })}

                {/* Base Line (0 deg / Top) -> Actually convention says 0 is usually Right... 
                    But user request said Top line. Let's assume standard compass? 
                    Actually standard math angle 0 is Right. 
                    Let's stick to standard math: 0 is Right (3 o'clock). 
                    Wait, let's look at the code above: toRad(deg) - 90 implies 0 is Top (12 o'clock).
                    Let's stick to 0 = Top as the "Start" for intuitive UI.
                */}
                <line x1={center} y1={center} x2={center} y2={center - radius} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />

                {/* Target Wedge (Revealed ONLY on result or maybe distinct style?) 
                    Ideally we show a "Target Zone" at start? 
                    User request: "Target Zone: A semi-transparent colored wedge".
                    So YES, show target zone immediately? Or is that the answer?
                    "A target angle is shown, and the player must align their 'Beam' to match it."
                    Okay, so the target IS visible. The challenge is matching dragging the slider to overlap it?
                    Wait, if I see the wedge, I just drag the line to the wedge edge. That's too easy?
                    Maybe "A dashed line indicating the mystery angle"?
                    "User is shown a target angle... align their Beam to match it."
                    Usually these games show a number "45 deg" and user has to estimate visual 45.
                    OR show a line at 45, and user has to type "45".
                    
                    Re-reading request: 
                    "Target Zone: A semi-transparent colored wedge or a dashed line indicating the mystery angle."
                    "Player's Beam: A solid line... rotates based on user input."
                    
                    Okay, so the visual target IS ON SCREEN. The user has to Match it.
                    The skill is motor control + reading the protractor? 
                    OR is the protractor blank? "A large, clean circle".
                    If there are no numbers, then yes, estimation is the skill.
                */}

                {/* Target Dashed Line */}
                {target && (
                    <g>
                        {/* Wedge Area */}
                        <path d={getWedgePath(target)} fill="rgba(99, 102, 241, 0.1)" />
                        {/* Target Line */}
                        <motion.line
                            x1={center} y1={center}
                            x2={center + radius * Math.cos(toRad(target))}
                            y2={center + radius * Math.sin(toRad(target))}
                            stroke="#6366f1"
                            strokeWidth="3"
                            strokeDasharray="6 6"
                        />
                    </g>
                )}

                {/* User Beam */}
                <motion.line
                    animate={{
                        x2: center + radius * Math.cos(toRad(angle)),
                        y2: center + radius * Math.sin(toRad(angle))
                    }}
                    x1={center} y1={center}
                    stroke={showResult ? (angle === target ? "#10b981" : "#ef4444") : "#0f172a"}
                    strokeWidth="4"
                    strokeLinecap="round"
                />

                {/* Center Pivot */}
                <circle cx={center} cy={center} r="6" fill="#0f172a" />
            </svg>

            {/* Angle Value Display (Floating) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-16 font-mono text-xs text-slate-400">
                {angle}°
            </div>
        </div>
    );
}
