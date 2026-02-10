export interface LogicLevel {
    id: number;
    premises: string[];
    conclusion: string;
    is_valid: boolean;
    explanation: string;
}

export const logicLevels: LogicLevel[] = [
    {
        id: 1,
        premises: ["Semua maba wajib botak.", "Doni itu maba."],
        conclusion: "Doni pasti botak.",
        is_valid: true,
        explanation: "Modus Ponens: P -> Q, P terjadi, maka Q."
    },
    {
        id: 2,
        premises: ["Jika hujan, maka jalan basah.", "Jalan basah."],
        conclusion: "Berarti tadi hujan.",
        is_valid: false,
        explanation: "Affirming the Consequent: Q terjadi tidak menjamin P terjadi."
    },
    {
        id: 3,
        premises: ["Semua kucing suka ikan.", "Molly suka ikan."],
        conclusion: "Molly itu kucing.",
        is_valid: false,
        explanation: "Kesalahan logika: Suka ikan bukan berarti harus kucing."
    },
    {
        id: 4,
        premises: ["Semua pahlawan pemberani.", "Beberapa tentara adalah pahlawan."],
        conclusion: "Beberapa tentara pemberani.",
        is_valid: true,
        explanation: "Silogisme kategori yang valid (Darii)."
    },
    {
        id: 5,
        premises: ["Semua Jakselian suka kopi senja.", "Andi bukan Jakselian."],
        conclusion: "Andi tidak suka kopi senja.",
        is_valid: false,
        explanation: "Denying the Antecedent: Tidak P bukan berarti tidak Q."
    },
    {
        id: 6,
        premises: ["Jika kamu lapar, kamu makan pizza.", "Kamu tidak lapar."],
        conclusion: "Maka kamu tidak makan pizza.",
        is_valid: false,
        explanation: "Falsafah Logika: Bisa saja makan pizza karena hobi, bukan lapar."
    }
];
