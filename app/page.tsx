"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scissors } from "lucide-react";
import GameCard from "./components/GameCard";
import GameInstructions from "./components/GameInstructions";
import { GAMES_DATA, GameMetadata } from "./data/gamesData";

export default function Home() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<GameMetadata | null>(null);

  const activeGames = GAMES_DATA.map(game => ({
    ...game,
    status: "active" as const
  }));

  // Add locked games if necessary
  const allGames = [
    ...activeGames,
    {
      id: "shape-slicer",
      title: "Shape Slicer",
      status: "locked" as const,
      icon: Scissors,
      color: "bg-pink-500",
      href: "/#",
      design: "",
      howToPlay: ""
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-indigo-600 mb-4 tracking-tight drop-shadow-sm">
            Math Masters
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium">
            Select a game to start your training!
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allGames.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              status={game.status}
              icon={game.icon}
              color={game.color}
              href={game.href}
              onClick={game.status !== "locked" ? () => setSelectedGame(game as GameMetadata) : undefined}
            />
          ))}
        </div>

        <GameInstructions
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          onStart={() => {
            if (selectedGame) {
              router.push(selectedGame.href);
            }
          }}
        />
      </div>
    </main>
  );
}
