"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useCoins } from "./CoinContext";
import { toast } from "react-hot-toast"; // We'll implement a custom one or use a library, 
// for now let's assume we build a simple one or use console log until Toast component is ready.
// Actually, the plan says build a Toast component. 
// I will just use a simple event emitter or a local state in the layout? 
// Better yet, I'll expose a 'notify' function in this context that we can hook into.

// --- Types ---
export interface Mission {
    id: string;
    title: string;
    description?: string;
    type: 'daily' | 'weekly' | 'achievement';
    rewardXP: number;
    rewardCoins: number;
    isClaimed: boolean;
    // New fields for simulator
    logicBuilder?: string;
    target?: string;
    rewardLevel?: 'Low' | 'Medium' | 'High';
}

export interface Badge {
    id: string;
    name: string;
    tier: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
    color?: string; // Dominant color
    icon: string; // lucide icon name or image path/concept
    isUnlocked: boolean;
    condition: string;
    trigger?: string; // For design purposes
}

export interface AvatarStats {
    logic: number;
    creativity: number;
    focus: number;
    memory: number;
}

interface GamificationContextType {
    // Stats
    level: number;
    currentXP: number;
    maxXP: number;
    avatarStats: AvatarStats;

    // Data
    missions: Mission[];
    badges: Badge[];

    // Actions
    addXP: (amount: number) => void;
    unlockBadge: (id: string) => void;
    completeMission: (id: string) => void;

    // Custom Data Management
    addMission: (mission: Omit<Mission, 'id' | 'isClaimed'>) => void;
    deleteMission: (id: string) => void;
    addBadge: (badge: Omit<Badge, 'id' | 'isUnlocked'>) => void;
    deleteBadge: (id: string) => void;
    levelCurve: number[];
    updateLevelCurve: (newCurve: number[]) => void;

    // Debug / God Mode
    debugSetLevel: (lvl: number) => void;
    debugSetXP: (xp: number) => void;
    resetAllProgress: () => void;
    updateAvatarStat: (stat: keyof AvatarStats, value: number) => void;

    // Notifications queue (for our custom Toast)
    notifications: { id: number; message: string; type: 'success' | 'info' }[];
    dismissNotification: (id: number) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

// --- Initial Data ---
const INITIAL_MISSIONS: Mission[] = [
    { id: 'm1', title: 'Complete 3 Factor Ninja Games', type: 'daily', rewardXP: 50, rewardCoins: 20, isClaimed: false },
    { id: 'm2', title: 'Score 500 in Angle Defense', type: 'daily', rewardXP: 100, rewardCoins: 50, isClaimed: false },
    { id: 'm3', title: 'Reach Level 5', type: 'achievement', rewardXP: 500, rewardCoins: 200, isClaimed: false },
];

const INITIAL_BADGES: Badge[] = [
    { id: 'b1', name: 'Math Novice', tier: 'common', icon: 'Award', isUnlocked: true, condition: 'Start your journey' },
    { id: 'b2', name: 'Sharp Shooter', tier: 'rare', icon: 'Crosshair', isUnlocked: false, condition: 'Perfect aim in Angle Defense' },
    { id: 'b3', name: 'Logic Master', tier: 'legendary', icon: 'Brain', isUnlocked: false, condition: 'Solve 50 Function Machines' },
];

const INITIAL_AVATAR: AvatarStats = { logic: 20, creativity: 15, focus: 10, memory: 25 };

export function GamificationProvider({ children }: { children: ReactNode }) {
    const { addCoins: globalAddCoins, spendCoins: globalSpendCoins } = useCoins(); // Hook into existing coin system

    // State
    const [level, setLevel] = useState(1);
    const [currentXP, setCurrentXP] = useState(0);
    const [avatarStats, setAvatarStats] = useState<AvatarStats>(INITIAL_AVATAR);
    const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
    const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
    const [levelCurve, setLevelCurve] = useState<number[]>([]); // New state variable
    const [notifications, setNotifications] = useState<{ id: number; message: string; type: 'success' | 'info' }[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Persistence - Load initial data from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("mathMastersGamification");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setLevel(parsed.level || 1);
                setCurrentXP(parsed.currentXP || 0);
                setAvatarStats(parsed.avatarStats || INITIAL_AVATAR);
                setMissions(parsed.missions || INITIAL_MISSIONS);
                setBadges(parsed.badges || INITIAL_BADGES);
                setLevelCurve(parsed.levelCurve || []); // Load levelCurve
            } catch (e) {
                console.error("Failed to parse gamification data", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Derived maxXP from curve
    const maxXP = levelCurve.length >= level
        ? levelCurve[level - 1]
        : Math.floor(100 * Math.pow(1.1, level - 1));

    // Persistence - Save to localStorage whenever data changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("mathMastersGamification", JSON.stringify({
                level,
                currentXP,
                avatarStats,
                missions,
                badges,
                levelCurve // Save levelCurve
            }));
        }
    }, [level, currentXP, avatarStats, missions, badges, levelCurve, isLoaded]);

    // Helpers
    const notify = (message: string, type: 'success' | 'info' = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        // Auto dismiss
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    const attemptLevelUp = (xp: number, lvl: number) => {
        let newXP = xp;
        let newLevel = lvl;

        const getRequired = (l: number) => levelCurve.length >= l
            ? levelCurve[l - 1]
            : Math.floor(100 * Math.pow(1.1, l - 1));

        let required = getRequired(newLevel);

        while (newXP >= required) {
            newXP -= required;
            newLevel++;
            required = getRequired(newLevel);
            notify(`Level Up! Welcome to Level ${newLevel}`, 'success');
        }
        return { newXP, newLevel };
    };

    // Actions
    const addXP = (amount: number) => {
        const { newXP, newLevel } = attemptLevelUp(currentXP + amount, level);
        setCurrentXP(newXP);
        setLevel(newLevel);
    };

    const unlockBadge = (id: string) => {
        setBadges(prev => prev.map(b => {
            if (b.id === id && !b.isUnlocked) {
                notify(`Badge Unlocked: ${b.name}`, 'success');
                return { ...b, isUnlocked: true };
            }
            return b;
        }));
    };

    const completeMission = (id: string) => {
        setMissions(prev => prev.map(m => {
            if (m.id === id && !m.isClaimed) {
                notify(`Mission Complete: ${m.title}`, 'success');
                addXP(m.rewardXP);
                globalAddCoins(m.rewardCoins);
                return { ...m, isClaimed: true };
            }
            return m;
        }));
    };

    const addMission = (mission: Omit<Mission, 'id' | 'isClaimed'>) => {
        const newMission: Mission = {
            ...mission,
            id: `m-${Date.now()}`,
            isClaimed: false
        };
        setMissions(prev => [newMission, ...prev]);
        notify(`New Mission Created: ${mission.title}`, 'success');
    };

    const deleteMission = (id: string) => {
        setMissions(prev => prev.filter(m => m.id !== id));
        notify("Mission Deleted", 'info');
    };

    const addBadge = (badge: Omit<Badge, 'id' | 'isUnlocked'>) => {
        const newBadge: Badge = {
            ...badge,
            id: `b-${Date.now()}`,
            isUnlocked: false
        };
        setBadges(prev => [newBadge, ...prev]);
        notify(`New Badge Designed: ${badge.name}`, 'success');
    };

    const deleteBadge = (id: string) => {
        setBadges(prev => prev.filter(b => b.id !== id));
        notify("Badge Deleted", 'info');
    };

    const updateLevelCurve = (newCurve: number[]) => {
        setLevelCurve(newCurve);
        notify("Level Curve Updated", 'success');
    };

    // Debug Actions
    const debugSetLevel = (lvl: number) => setLevel(lvl);
    const debugSetXP = (xp: number) => setCurrentXP(xp); // Doesn't trigger level up logic, just sets raw
    const resetAllProgress = () => {
        setLevel(1);
        setCurrentXP(0);
        setAvatarStats(INITIAL_AVATAR);
        setMissions(INITIAL_MISSIONS);
        setBadges(INITIAL_BADGES);
        notify("Progress Reset", 'info');
    };

    const updateAvatarStat = (stat: keyof AvatarStats, value: number) => {
        setAvatarStats(prev => ({ ...prev, [stat]: Math.max(0, Math.min(100, value)) }));
    };

    const dismissNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <GamificationContext.Provider value={{
            level, currentXP, maxXP, avatarStats,
            missions, badges,
            addXP, unlockBadge, completeMission,
            addMission, deleteMission, addBadge, deleteBadge,
            levelCurve, updateLevelCurve,
            debugSetLevel, debugSetXP, resetAllProgress, updateAvatarStat,
            notifications, dismissNotification
        }}>
            {children}
        </GamificationContext.Provider>
    );
}

export function useGamification() {
    const context = useContext(GamificationContext);
    if (context === undefined) {
        throw new Error("useGamification must be used within a GamificationProvider");
    }
    return context;
}
