import { LucideIcon, Sword, Dna, Scale, Cpu, Compass, BarChart3, Zap } from "lucide-react";

export interface GameMetadata {
    id: string;
    title: string;
    icon: LucideIcon;
    color: string;
    href: string;
    design: string;
    howToPlay: string;
}

export const GAMES_DATA: GameMetadata[] = [
    {
        id: "factor-ninja",
        title: "Factor Ninja",
        icon: Sword,
        color: "bg-red-500",
        href: "/factor-ninja",
        design: "Factor Ninja is a fast-paced game designed to improve your mental math and division skills. It uses an arcade-style slicing mechanic to keep you engaged while you practice identifying factors of numbers.",
        howToPlay: "1. A target number will appear on the screen.\n2. Various numbers will pop up from the bottom.\n3. Slice (click and drag) only the numbers that are factors of the target number.\n4. Avoid slicing prime numbers if they aren't factors!\n5. Earn points for every correct factor sliced."
    },
    {
        id: "pattern-bridge",
        title: "The Pattern Bridge",
        icon: Dna,
        color: "bg-blue-500",
        href: "/pattern-bridge",
        design: "The Pattern Bridge challenges your logical reasoning and pattern recognition. You must complete sequences of shapes or numbers to build a safe path across the abyss.",
        howToPlay: "1. Look at the sequence displayed on the bridge segments.\n2. Identify the rule governing the pattern (e.g., +2, doubling, alternating shapes).\n3. Select the correct next item from the options provided.\n4. Successfully completing patterns allows you to cross the bridge!"
    },
    {
        id: "algebra-balance",
        title: "Algebra Balance",
        icon: Scale,
        color: "bg-green-500",
        href: "/algebra-balance",
        design: "Algebra Balance visualizes algebraic equations using a physical scale. It helps you understand the concept of balancing both sides of an equation to find the value of X.",
        howToPlay: "1. You'll see a scale with blocks and 'X' weights on both sides.\n2. Add or remove weights to simplify the equation.\n3. Perform the same action on both sides to keep the scale balanced.\n4. Solve for the unknown variable X to win."
    },
    {
        id: "function-machine",
        title: "Function Machine",
        icon: Cpu,
        color: "bg-purple-500",
        href: "/function-machine",
        design: "The Function Machine is a logic puzzle where you must deduce the hidden rule (function) that transforms inputs into outputs.",
        howToPlay: "1. Drop an input number into the machine.\n2. Observe the output number that comes out.\n3. Try different inputs to gather data.\n4. Once you think you know the rule (e.g., x + 5, x * 2), type it in or select it from the options."
    },
    {
        id: "angle-master",
        title: "Angle Master",
        icon: Compass,
        color: "bg-yellow-500",
        href: "/angle-commander",
        design: "Angle Master is a minimalist geometry textbook-style quiz. It focuses on developing your spatial reasoning and estimation skills by identifying and finding angles.",
        howToPlay: "1. **Mode A (Guess)**: Look at the drawn angle and choose the correct degree measure from 4 options.\n2. **Mode B (Find)**: Look at several angle cards and pick the one that matches the target degree.\n3. Watch the arc animation to help you visualize the angle measure."
    },
    {
        id: "data-detective",
        title: "Data Detective",
        icon: BarChart3,
        color: "bg-indigo-500",
        href: "/data-detective",
        design: "Data Detective turns you into a statistician. You'll analyze graphs, charts, and raw data to find hidden insights and answer questions.",
        howToPlay: "1. Examine the provided chart or graph (Bar, Line, or Pie).\n2. Read the question carefully.\n3. Perform calculations if necessary (Mean, Median, Mode, or Range).\n4. Select the correct answer based on the data provided."
    },
    {
        id: "vector-valley",
        title: "Vector Valley",
        icon: Zap,
        color: "bg-indigo-600",
        href: "/simulation/vector-valley",
        design: "Vector Valley is a physics-based educational game that teaches the difference between scalar and vector quantities. It combines conceptual sorting with practical vector planning on a coordinate grid.",
        howToPlay: "1. **Stage 1 (Sorting)**: Classify physical quantities as either 'Scalar' (magnitude only) or 'Vector' (magnitude + direction).\n2. **Stage 2 (Mission)**: Plan a path for your robot by dragging to create vector arrows.\n3. Watch how X and Y components combine to create a resultant movement.\n4. Avoid obstacles to reach the target!"
    },
    {
        id: "math-match",
        title: "Math Match",
        icon: Zap,
        color: "bg-red-500",
        href: "/simulation/math-match",
        design: "Math Match is a fast-paced arithmetic game with a Tinder-style swipe mechanic. It's designed to build rapid calculation speed and improve focus through immediate decision-making.",
        howToPlay: "1. **Swipe Right**: If the equation is **CORRECT**.\n2. **Swipe Left**: If the equation is **INCORRECT**.\n3. Build a **Combo** by getting 3 correct answers in a row to earn double points.\n4. Don't let your lives (hearts) run out!"
    }
];
