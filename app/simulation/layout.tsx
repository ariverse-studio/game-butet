"use client";

import { EconomyProvider } from "@/app/context/EconomyContext";

export default function SimulationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <EconomyProvider>{children}</EconomyProvider>;
}
