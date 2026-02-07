import type { Metadata } from "next";
import AngleCommanderGame from "../components/AngleCommander/Game";

export const metadata: Metadata = {
    title: "Angle Commander | Math Masters",
    description: "Master your estimation skills!",
};

export default function AngleCommanderPage() {
    return <AngleCommanderGame />;
}
