export interface DataPoint {
    id: string;
    label: string;
    value: number;
    color: string;
}

export interface Question {
    text: string;
    type: 'max' | 'min' | 'value';
    targetValue?: number; // For 'value' type questions
    correctId: string; // The ID of the correct bar
}

const CATEGORIES = [
    { label: 'Apples', color: 'bg-red-500' },
    { label: 'Bananas', color: 'bg-yellow-400' },
    { label: 'Grapes', color: 'bg-purple-500' },
    { label: 'Oranges', color: 'bg-orange-500' },
    { label: 'Berries', color: 'bg-pink-500' },
];

const CITIES = [
    { label: 'NY', color: 'bg-blue-500' },
    { label: 'LA', color: 'bg-indigo-500' },
    { label: 'CHI', color: 'bg-sky-500' },
    { label: 'MIA', color: 'bg-teal-500' },
    { label: 'HOU', color: 'bg-cyan-500' },
];

export function generateChartData(level: number): DataPoint[] {
    const useCities = Math.random() > 0.5;
    const source = useCities ? CITIES : CATEGORIES;

    // Pick 4-5 items randomly
    const count = 4;
    const shuffled = [...source].sort(() => 0.5 - Math.random()).slice(0, count);

    return shuffled.map(item => ({
        id: item.label,
        label: item.label,
        value: Math.floor(Math.random() * 80) + 20, // 20 to 100
        color: item.color
    }));
}

export function generateQuestion(data: DataPoint[]): Question {
    const typeRoll = Math.random();
    let type: 'max' | 'min' | 'value' = 'max';

    if (typeRoll < 0.33) type = 'max';
    else if (typeRoll < 0.66) type = 'min';
    else type = 'value';

    if (type === 'max') {
        const max = data.reduce((prev, current) => (prev.value > current.value) ? prev : current);
        return {
            text: "Which bar represents the HIGHEST value?",
            type: 'max',
            correctId: max.id
        };
    } else if (type === 'min') {
        const min = data.reduce((prev, current) => (prev.value < current.value) ? prev : current);
        return {
            text: "Which bar represents the LOWEST value?",
            type: 'min',
            correctId: min.id
        };
    } else {
        // Value Type
        const target = data[Math.floor(Math.random() * data.length)];
        // Add some fuzziness to the question text? "About 80?" 
        // Or exact? Let's say "Which category has approximately X?"
        return {
            text: `Which category has a value of ${target.value}?`,
            type: 'value',
            targetValue: target.value,
            correctId: target.id
        };
    }
}
