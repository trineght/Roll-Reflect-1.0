import React, { useState, useEffect } from 'react';
import type { DieItem, DiceResult, DiceCategory } from '../types';
import Card from './ui/Card';
import Dice from './ui/Dice';

interface DiceRollerProps {
    onRoll: () => void;
    onSingleRoll: (category: DiceCategory) => void;
    result: DiceResult | null;
}

const ResultCard: React.FC<{ 
    title: string; 
    item: DieItem; 
    color: string; 
    category: DiceCategory;
    isRolling: boolean;
    onReroll: (category: DiceCategory) => void;
}> = ({ title, item, color, category, isRolling, onReroll }) => (
    <div className={`relative border-l-4 ${color} pl-4 pr-10 py-4`}>
        <h3 className="text-lg font-semibold text-[#464646]">{title}</h3>
        <div className="mt-2">
            <p className="text-2xl font-bold text-gray-900">{item.emoji} {item.title}</p>
            <p className="text-[#464646] mt-1">{item.description}</p>
            <p className="text-sm text-gray-500 mt-2 italic">👉🏼 {item.example}</p>
        </div>
        <button 
            onClick={() => onReroll(category)}
            disabled={isRolling}
            className="absolute top-3 right-2 p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            aria-label={`Slå terning for ${title} om`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
        </button>
    </div>
);

const DiceRoller: React.FC<DiceRollerProps> = ({ onRoll, onSingleRoll, result }) => {
    const [rollingCategory, setRollingCategory] = useState<DiceCategory | 'all' | null>(null);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
      if (result) {
        setShowResults(true);
      }
    }, [result]);

    const handleRollClick = () => {
        if (rollingCategory) return;

        setShowResults(false);
        setRollingCategory('all');
        onRoll();

        setTimeout(() => {
            setRollingCategory(null);
        }, 1500); // Animation duration
    };

    const handleSingleRoll = (category: DiceCategory) => {
        if(rollingCategory) return;
        setRollingCategory(category);
        onSingleRoll(category);

        setTimeout(() => {
            setRollingCategory(null);
        }, 1500); // Animation duration
    }

    return (
        <Card>
            <h2 className="text-2xl font-bold text-[#464646] mb-4">Terningespil</h2>
            {!result && (
                <p className="text-[#464646] mb-6">Slå med terningerne for at få en kombination af en didaktisk metode, en digital teknologi og en analog teknologi til jeres næste undervisningsforløb.</p>
            )}

            <div className="flex justify-center items-center gap-4 sm:gap-6 my-8">
                <Dice 
                    isRolling={rollingCategory === 'all' || rollingCategory === 'didactic'} 
                    emoji={result?.didactic.emoji} 
                    color="bg-blue-100 text-[#009FDA]"
                />
                <Dice 
                    isRolling={rollingCategory === 'all' || rollingCategory === 'digital'} 
                    emoji={result?.digital.emoji}
                    color="bg-yellow-50 text-[#FFBC3D]"
                />
                <Dice 
                    isRolling={rollingCategory === 'all' || rollingCategory === 'analog'} 
                    emoji={result?.analog.emoji}
                    color="bg-green-50 text-[#009640]"
                />
            </div>

            <button
                onClick={handleRollClick}
                disabled={!!rollingCategory}
                className="w-full bg-[#C00D0D] text-white font-semibold py-3 px-4 rounded-md hover:bg-[#a00a0a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C00D0D] transition-colors duration-200 disabled:bg-red-300 disabled:cursor-not-allowed"
            >
                {rollingCategory === 'all' ? 'Ruller...' : (result ? 'Slå alle igen' : 'Slå med terningerne')}
            </button>

            {showResults && result && (
                <div className="mt-8 space-y-6 animate-fade-in">
                    <ResultCard title="Didaktisk Metode" item={result.didactic} color="border-[#009FDA]" category="didactic" onReroll={handleSingleRoll} isRolling={!!rollingCategory} />
                    <ResultCard title="Digital Teknologi" item={result.digital} color="border-[#FFBC3D]" category="digital" onReroll={handleSingleRoll} isRolling={!!rollingCategory} />
                    <ResultCard title="Analog Teknologi" item={result.analog} color="border-[#009640]" category="analog" onReroll={handleSingleRoll} isRolling={!!rollingCategory} />
                </div>
            )}
            <style>{`
                @keyframes fade-in {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </Card>
    );
};

export default DiceRoller;