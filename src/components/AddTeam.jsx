import React, { useState } from 'react';
import { useLeague } from '../context/LeagueContext';
import { PlusCircle } from 'lucide-react';

const AddTeam = () => {
    const [name, setName] = useState('');
    const { addTeam } = useLeague();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            addTeam(name.trim());
            setName('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mt-6 mb-12">
            <div className="relative">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Add Team Name..."
                    className="w-full p-4 pl-5 pr-14 bg-slate-800 text-white rounded-full border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-500 shadow-lg"
                />
                <button
                    type="submit"
                    disabled={!name.trim()}
                    className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-full transition-colors"
                    aria-label="Add Team"
                >
                    <PlusCircle size={24} />
                </button>
            </div>
        </form>
    );
};

export default AddTeam;
