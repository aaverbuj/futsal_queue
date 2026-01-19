import React from 'react';
import { useLeague } from '../context/LeagueContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, X } from 'lucide-react';

const QueueList = () => {
    const { queue, removeTeam } = useLeague();

    if (queue.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">Queue is empty</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto mt-6">
            <div className="flex items-center space-x-2 mb-4 px-2">
                <Users className="text-slate-400" size={20} />
                <h3 className="text-slate-400 font-semibold uppercase tracking-wider text-sm">Next Up ({queue.length})</h3>
            </div>

            <ul className="space-y-3 pb-32">
                <AnimatePresence initial={false}>
                    {queue.map((team, index) => (
                        <motion.li
                            key={team.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className={`p-3 rounded-xl flex items-center shadow-sm border border-slate-700/50 bg-slate-800/80 backdrop-blur-sm relative overflow-hidden`}
                        >
                            <div className={`w-3 h-full absolute left-0 top-0 bottom-0 rounded-l-xl ${team.color || 'bg-slate-600'}`} />

                            <div className="flex items-center justify-center font-bold ml-4 mr-4 text-slate-400 w-6">
                                {index + 1}
                            </div>

                            <span className="font-medium text-slate-200 truncate flex-1">
                                {team.name}
                            </span>

                            <button
                                onClick={() => removeTeam(team.id)}
                                className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                                aria-label="Remove Team"
                            >
                                <X size={18} />
                            </button>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </div>
    );
};

export default QueueList;
