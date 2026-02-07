"use client";

import { motion } from "framer-motion";

interface BladeProps {
    path: { x: number; y: number }[];
}

export default function Blade({ path }: BladeProps) {
    if (path.length < 2) return null;

    // Convert path points to SVG path string
    const d = path.reduce(
        (acc, point, index) =>
            index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`,
        ""
    );

    return (
        <svg className="pointer-events-none absolute inset-0 z-50 h-full w-full overflow-visible">
            <motion.path
                d={d}
                fill="none"
                stroke="cyan"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.1 }}
                style={{ filter: "drop-shadow(0 0 8px cyan)" }}
            />
        </svg>
    );
}
