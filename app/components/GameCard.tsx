"use client";

import { motion } from "framer-motion";
import { LucideIcon, Lock } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

interface GameCardProps {
    title: string;
    status: "active" | "locked";
    icon: LucideIcon;
    color: string; // e.g., "bg-orange-500"
    href?: string;
    onClick?: () => void;
}

export default function GameCard({
    title,
    status,
    icon: Icon,
    color,
    href = "#",
    onClick,
}: GameCardProps) {
    const isLocked = status === "locked";

    const CardContent = (
        <motion.div
            whileHover={!isLocked ? { scale: 1.05, rotate: 1 } : {}}
            whileTap={!isLocked ? { scale: 0.95 } : {}}
            className={clsx(
                "relative flex flex-col items-center justify-center p-6 rounded-3xl h-48 sm:h-56 shadow-lg border-b-8 transition-colors w-full",
                isLocked
                    ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                    : `${color} border-black/20 text-white cursor-pointer`
            )}
            onClick={!isLocked ? onClick : undefined}
        >
            {isLocked && (
                <div className="absolute top-4 right-4">
                    <Lock className="w-6 h-6 opacity-50" />
                </div>
            )}

            <div className={clsx("p-4 rounded-full bg-white/20 mb-4", isLocked && "grayscale")}>
                <Icon size={40} className="text-current" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-center leading-tight tracking-tight">
                {title}
            </h3>

            {isLocked && (
                <span className="mt-2 text-xs font-bold uppercase tracking-widest opacity-60">
                    Coming Soon
                </span>
            )}
        </motion.div>
    );

    if (isLocked) {
        return <div>{CardContent}</div>;
    }

    if (onClick) {
        return <div className="w-full">{CardContent}</div>;
    }

    return <Link href={href} className="w-full text-none">{CardContent}</Link>;
}
