import type { Metadata } from "next";
import DataDetectiveGame from "../components/DataDetective/Game";

export const metadata: Metadata = {
    title: "Data Detective | Math Masters",
    description: "Can you solve the data mystery?",
};

export default function DataDetectivePage() {
    return <DataDetectiveGame />;
}
