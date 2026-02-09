import type { Metadata } from "next";
import AngleMaster from "../components/AngleMaster/AngleMaster";

export const metadata: Metadata = {
    title: "Angle Master | Math Masters",
    description: "Master angle recognition with visual geometry quizzes!",
};

export default function AngleMasterPage() {
    return <AngleMaster />;
}
