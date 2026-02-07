import type { Metadata } from "next";
import FunctionMachineGame from "../components/FunctionMachine/Game";

export const metadata: Metadata = {
    title: "Function Machine | Math Masters",
    description: "Deduce the hidden rule of the math machine!",
};

export default function FunctionMachinePage() {
    return <FunctionMachineGame />;
}
