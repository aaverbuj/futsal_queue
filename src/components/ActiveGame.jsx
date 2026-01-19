import React, { useEffect, useState } from 'react';
import { useLeague } from '../context/LeagueContext';
import { Play, Pause, RotateCcw, Trophy, Users, Clock, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ActiveGame = () => {
    const { activeGame, timer, resolveGame, gameDuration, setGameDuration } = useLeague();
    const { timeLeft, isRunning, start, pause, reset } = timer;
    const [showSettings, setShowSettings] = useState(false);

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const isCritical = timeLeft <= 10 && timeLeft > 0;
    const isFinished = timeLeft === 0;

    useEffect(() => {
        if (timeLeft === 0 && !activeGame?.hasAlerted) {
            // Simple vibration/sound trigger could go here
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }
    }, [timeLeft, activeGame]);

    if (!activeGame || !activeGame.teamA || !activeGame.teamB) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-800 rounded-xl shadow-lg text-slate-400 border border-slate-700">
                <Users className="w-12 h-12 mb-4 opacity-50" />
                <h2 className="text-xl font-semibold">Waiting for teams...</h2>
                <p className="text-sm">Add at least 2 teams to the queue.</p>
            </div>
        );
    }

    const handleDurationChange = (e) => {
        const newDuration = parseInt(e.target.value, 10);
        setGameDuration(newDuration);
    };

    return (
        <div className="flex flex-col w-full max-w-md mx-auto space-y-6">
            {/* Timer Section */}
            <div className={`relative flex flex-col items-center justify-center p-8 rounded-3xl shadow-2xl transition-colors duration-500 ${isFinished ? 'bg-red-900/40 border-2 border-red-500' :
                    isCritical ? 'bg-orange-900/30 border-2 border-orange-500 animate-pulse' :
                        'bg-slate-800 border-2 border-slate-700'
                }`}>
                {/* Settings Toggle */}
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-blue-400 transition-colors"
                >
                    <Settings size={20} />
                </button>

                {showSettings && (
                    <div className="absolute top-12 right-4 bg-slate-700 p-2 rounded-lg shadow-xl z-10 flex flex-col items-center space-y-2 border border-slate-600">
                        <label className="text-xs text-slate-300 font-bold uppercase">Duration</label>
                        <select
                            value={gameDuration}
                            onChange={handleDurationChange}
                            className="bg-slate-800 text-white text-sm p-1 rounded border border-slate-600 outline-none"
                            disabled={isRunning}
                        >
                            {[1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(min => (
                                <option key={min} value={min * 60}>{min} min</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className={`text-7xl font-mono font-bold tracking-tighter ${isFinished ? 'text-red-500' : isCritical ? 'text-orange-400' : 'text-blue-400'
                    }`}>
                    {formatTime(timeLeft)}
                </div>

                {/* Timer Controls */}
                <div className="flex space-x-4 mt-6">
                    {!isRunning && timeLeft > 0 && (
                        <button onClick={start} className="p-4 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white shadow-lg active:scale-95 transition-transform" aria-label="Start Timer">
                            <Play size={32} fill="currentColor" />
                        </button>
                    )}
                    {isRunning && (
                        <button onClick={pause} className="p-4 bg-amber-600 hover:bg-amber-500 rounded-full text-white shadow-lg active:scale-95 transition-transform" aria-label="Pause Timer">
                            <Pause size={32} fill="currentColor" />
                        </button>
                    )}
                    <button onClick={reset} className="p-4 bg-slate-600 hover:bg-slate-500 rounded-full text-white shadow-lg active:scale-95 transition-transform" aria-label="Reset Timer">
                        <RotateCcw size={32} />
                    </button>
                </div>
            </div>

            {/* Matchup Section */}
            <div className="bg-slate-800 p-1 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
                <div className="flex">
                    {/* Team A */}
                    <div className={`flex-1 p-6 flex flex-col items-center justify-center relative ${activeGame.teamA.color || 'bg-blue-600'} transition-colors duration-300`}>
                        <h3 className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Team A</h3>
                        <div className="text-2xl font-black text-white text-center break-words w-full shadow-black drop-shadow-md">
                            {activeGame.teamA.name}
                        </div>
                        <button
                            onClick={() => resolveGame('A')}
                            className="mt-4 w-full py-3 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-xl text-white font-bold shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-95 backdrop-blur-sm"
                        >
                            <Trophy size={18} />
                            <span>Win</span>
                        </button>
                    </div>

                    {/* VS Divider */}
                    <div className="w-1 bg-slate-900 relative z-10 flex items-center justify-center">
                        <div className="bg-slate-900 text-slate-500 text-xs font-black py-1 px-2 rounded-full absolute">VS</div>
                    </div>

                    {/* Team B */}
                    <div className={`flex-1 p-6 flex flex-col items-center justify-center relative ${activeGame.teamB.color || 'bg-purple-600'} transition-colors duration-300`}>
                        <h3 className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Team B</h3>
                        <div className="text-2xl font-black text-white text-center break-words w-full shadow-black drop-shadow-md">
                            {activeGame.teamB.name}
                        </div>
                        <button
                            onClick={() => resolveGame('B')}
                            className="mt-4 w-full py-3 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-xl text-white font-bold shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-95 backdrop-blur-sm"
                        >
                            <Trophy size={18} />
                            <span>Win</span>
                        </button>
                    </div>
                </div>

                {/* Draw Button */}
                <div className="p-4 bg-slate-800">
                    <button
                        onClick={() => resolveGame('draw')}
                        disabled={timeLeft > 0}
                        className={`w-full py-3 rounded-xl font-semibold shadow-lg border transition-all flex items-center justify-center space-x-2 ${timeLeft > 0
                                ? 'bg-slate-700/50 text-slate-500 border-slate-700 cursor-not-allowed'
                                : 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600 active:scale-[0.98]'
                            }`}
                    >
                        {timeLeft > 0 ? <Clock size={16} className="mr-2" /> : null}
                        <span>{timeLeft > 0 ? "Wait for Timer to Draw" : "Draw / Tie"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActiveGame;
