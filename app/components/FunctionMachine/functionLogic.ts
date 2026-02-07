export interface FunctionRule {
    m: number;
    c: number;
    description: string;
}

export function generateFunction(level: number): FunctionRule {
    let m = 1;
    let c = 0;
    let description = "";

    // Level 1-3: Simple Multiplication (y = mx)
    if (level <= 3) {
        m = Math.floor(Math.random() * 4) + 2; // 2 to 5
        c = 0;
        description = `Multiply by ${m}`;
    }
    // Level 4-6: Simple Addition (y = x + c)
    else if (level <= 6) {
        m = 1;
        c = Math.floor(Math.random() * 9) + 1; // 1 to 9
        description = `Add ${c}`;
    }
    // Level 7+: Linear Function (y = mx + c)
    else {
        m = Math.floor(Math.random() * 3) + 2; // 2 to 4
        c = Math.floor(Math.random() * 5) + 1; // 1 to 5
        description = `Multiply by ${m} and Add ${c}`;
    }

    return { m, c, description };
}

export function calculateOutput(input: number, rule: FunctionRule): number {
    return (input * rule.m) + rule.c;
}
