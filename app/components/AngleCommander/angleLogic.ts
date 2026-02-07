export interface AngleChallenge {
    target: number;
    description: string;
}

export function generateAngle(difficulty: 'easy' | 'hard' = 'hard'): AngleChallenge {
    let target = 0;

    if (difficulty === 'easy') {
        // Snap to 15 degree increments for easier estimation
        target = Math.floor(Math.random() * 24) * 15;
    } else {
        // Full range, 5 degree increments
        target = Math.floor(Math.random() * 72) * 5;
    }

    // Avoid 0 (too easy)
    if (target === 0) target = 360;

    return {
        target,
        description: `Estimate ${target}°`
    };
}

export type Accuracy = 'perfect' | 'close' | 'miss';

export function checkAccuracy(target: number, user: number): { status: Accuracy; diff: number } {
    const diff = Math.abs(target - user);

    if (diff <= 3) return { status: 'perfect', diff };
    if (diff <= 10) return { status: 'close', diff };
    return { status: 'miss', diff };
}
