"use client";

import { useEffect, useRef } from "react";

export function useSound(url: string) {
    const audio = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audio.current = new Audio(url);
    }, [url]);

    const play = () => {
        if (audio.current) {
            audio.current.currentTime = 0;
            audio.current.play().catch(e => console.error("Audio play failed", e));
        }
    };

    return play;
}
