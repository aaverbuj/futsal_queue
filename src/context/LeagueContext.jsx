import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTimer } from '../hooks/useTimer';

const LeagueContext = createContext();

// 12 Distinct Tailwind Colors for Teams
const TEAM_COLORS = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
    'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
    'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
];

export const LeagueProvider = ({ children }) => {
    const [queue, setQueue] = useState(() => {
        try {
            const saved = localStorage.getItem('futsal_queue');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to parse queue from local storage", e);
            return [];
        }
    });

    const [activeGame, setActiveGame] = useState(() => {
        try {
            const saved = localStorage.getItem('futsal_active_game');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error("Failed to parse active game from local storage", e);
            return null;
        }
    });

    const [gameDuration, setGameDuration] = useState(() => {
        try {
            const saved = localStorage.getItem('futsal_game_duration');
            return saved ? parseInt(saved, 10) : 180;
        } catch (e) { return 180; }
    });

    const { timeLeft, isRunning, start, pause, reset, setTimeLeft } = useTimer(gameDuration);

    // Update timer when duration settings change, IF timer is not running
    useEffect(() => {
        if (!isRunning) {
            reset();
            setTimeLeft(gameDuration);
        }
    }, [gameDuration]);

    // Persistence
    useEffect(() => {
        localStorage.setItem('futsal_queue', JSON.stringify(queue));
    }, [queue]);

    useEffect(() => {
        localStorage.setItem('futsal_active_game', JSON.stringify(activeGame));
    }, [activeGame]);

    useEffect(() => {
        localStorage.setItem('futsal_game_duration', gameDuration.toString());
    }, [gameDuration]);

    const getRandomColor = () => {
        // Simple random selection for now
        return TEAM_COLORS[Math.floor(Math.random() * TEAM_COLORS.length)];
    };

    const addTeam = (name) => {
        const newTeam = {
            id: uuidv4(),
            name,
            color: getRandomColor()
        };
        setQueue((prev) => [...prev, newTeam]);
    };

    const removeTeam = (id) => {
        setQueue((prev) => prev.filter(t => t.id !== id));
    };

    const resetLeague = () => {
        setQueue([]);
        setActiveGame(null);
        reset();
        setTimeLeft(gameDuration);
        localStorage.removeItem('futsal_queue');
        localStorage.removeItem('futsal_active_game');
    };

    const startGame = () => {
        if (queue.length >= 2 && !activeGame) {
            const [teamA, teamB, ...rest] = queue;
            setActiveGame({ teamA, teamB });
            setQueue(rest);
            reset();
            // start(); // REMOVED auto-start as per user request
        }
    };

    const resolveGame = (result) => {
        if (!activeGame) return;
        const { teamA, teamB } = activeGame;

        // Draw
        if (result === 'draw') {
            const newQueue = [...queue, teamA, teamB];
            if (newQueue.length >= 2) {
                const [new1, new2, ...rest] = newQueue;
                setActiveGame({ teamA: new1, teamB: new2 });
                setQueue(rest);
                reset();
                return;
            } else {
                // Not enough interactions
                setActiveGame(null);
                setQueue(newQueue);
                reset();
                return;
            }
        }

        // Winner decided
        const winner = result === 'A' ? teamA : teamB;
        const loser = result === 'A' ? teamB : teamA;

        if (queue.length > 0) {
            const [challenger, ...restQueue] = queue;
            setActiveGame({ teamA: winner, teamB: challenger });
            setQueue([...restQueue, loser]);
            reset();
        } else {
            // Winner waits for challenger
            setActiveGame({ teamA: winner, teamB: null });
            setQueue((prev) => [...prev, loser]);
            reset();
        }
        // No auto-start
    };

    // Check if we can start a game if one player is waiting (partial state)
    useEffect(() => {
        if (activeGame && activeGame.teamA && !activeGame.teamB && queue.length > 0) {
            const [challenger, ...rest] = queue;
            setActiveGame(prev => ({ ...prev, teamB: challenger }));
            setQueue(rest);
            reset();
        }
        // Initial start if nothing active
        if (!activeGame && queue.length >= 2) {
            startGame(); // REMOVED auto-start as per user request
        }
    }, [queue, activeGame]);

    return (
        <LeagueContext.Provider value={{
            queue,
            activeGame,
            addTeam,
            removeTeam,
            resetLeague,
            resolveGame,
            gameDuration,
            setGameDuration,
            timer: { timeLeft, isRunning, start, pause, reset }
        }}>
            {children}
        </LeagueContext.Provider>
    );
};

export const useLeague = () => useContext(LeagueContext);
