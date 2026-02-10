import BrainTug from "@/app/components/BrainTug/BrainTug";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Brain Tug | 1vs1 Math Multiplayer",
    description: "A fast-paced local multiplayer game where two players compete to solve math problems. Correct answers pull the rope toward them.",
};

export default function BrainTugPage() {
    return <BrainTug />;
}
