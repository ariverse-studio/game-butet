"use client";

import {
  Sword,
  Shapes,
  Scale,
  Cpu,
  Compass,
  Scissors,
  BarChart3,
  Dna
} from "lucide-react";
import GameCard from "./components/GameCard";

export default function Home() {
  const games = [
    {
      title: "Factor Ninja",
      status: "active" as const,
      icon: Sword,
      color: "bg-red-500",
      href: "/factor-ninja"
    },
    {
      title: "The Pattern Bridge",
      status: "locked" as const,
      icon: Dna, // Representing sequences/patterns
      color: "bg-blue-500",
    },
    {
      title: "Algebra Balance",
      status: "locked" as const,
      icon: Scale,
      color: "bg-green-500",
    },
    {
      title: "Function Machine",
      status: "locked" as const,
      icon: Cpu,
      color: "bg-purple-500",
    },
    {
      title: "Angle Commander",
      status: "locked" as const,
      icon: Compass,
      color: "bg-yellow-500",
    },
    {
      title: "Shape Slicer",
      status: "locked" as const,
      icon: Scissors,
      color: "bg-pink-500",
    },
    {
      title: "Data Detective",
      status: "locked" as const,
      icon: BarChart3,
      color: "bg-indigo-500",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl sm:text-7xl font-extrabold text-indigo-600 mb-4 tracking-tight drop-shadow-sm">
            Math Masters
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            Select a game to start your training!
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard
              key={game.title}
              title={game.title}
              status={game.status}
              icon={game.icon}
              color={game.color}
              href={game.href}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
