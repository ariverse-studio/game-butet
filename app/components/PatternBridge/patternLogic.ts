export type PatternType = "arithmetic" | "geometric" | "fibonacci";

export interface PatternData {
    sequence: (number | null)[];
    missingIndex: number;
    correctAnswer: number;
    options: number[];
    rule: string; // Description of the rule (e.g., "+ 2")
}

export function generatePattern(level: number): PatternData {
    // Difficuly scaling:
    // Level 1-5: Arithmetic (Addition)
    // Level 6-10: Arithmetic (Subtraction)
    // Level 11-15: Geometric (Multiplication)
    // Level 16+: Mixed / Fibonacci

    let type: PatternType = "arithmetic";
    if (level > 10) type = "geometric";
    if (level > 20) type = Math.random() > 0.5 ? "geometric" : "fibonacci";

    // Base logic
    let sequence: number[] = [];
    let rule = "";

    // Random start number
    const start = Math.floor(Math.random() * 10) + 1;
    const length = 5;

    if (type === "arithmetic") {
        const isSubtraction = level > 5 && level <= 10;
        const step = Math.floor(Math.random() * 5) + 1 + Math.floor(level / 5); // Increase step size with level
        const actualStep = isSubtraction ? -step : step;

        rule = isSubtraction ? `- ${step}` : `+ ${step}`;

        for (let i = 0; i < length; i++) {
            sequence.push(start + (i * actualStep));
        }
    } else if (type === "geometric") {
        const factor = Math.floor(Math.random() * 2) + 2; // x2 or x3 mostly, to keep numbers sane
        rule = `x ${factor}`;

        // reset start to be small
        let current = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < length; i++) {
            sequence.push(current);
            current *= factor;
        }
    } else {
        // Fibonacci-like
        rule = "Sum of previous two";
        let a = Math.floor(Math.random() * 5) + 1;
        let b = Math.floor(Math.random() * 5) + 1;
        sequence.push(a, b);
        for (let i = 2; i < length; i++) {
            const next = sequence[i - 1] + sequence[i - 2];
            sequence.push(next);
        }
    }

    // Determine missing index (random but usually not first)
    const missingIndex = Math.floor(Math.random() * (length - 1)) + 1;
    const correctAnswer = sequence[missingIndex];

    // Create display sequence
    const displaySequence = [...sequence];
    // @ts-ignore
    displaySequence[missingIndex] = null;

    // Generate Distractors (Wrong options)
    const options = new Set<number>();
    options.add(correctAnswer);

    while (options.size < 4) {
        const offset = Math.floor(Math.random() * 10) - 5;
        const distractor = correctAnswer + offset;
        if (distractor !== correctAnswer && distractor > 0) {
            options.add(distractor);
        }
    }

    return {
        sequence: displaySequence,
        missingIndex,
        correctAnswer,
        options: Array.from(options).sort((a, b) => a - b),
        rule
    };
}
