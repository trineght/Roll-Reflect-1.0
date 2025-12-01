import React, { useState } from 'react';

import SelfEvaluationCompass from './components/SelfEvaluationCompass';
import DiceRoller from './components/DiceRoller';
import InstructionGuide from './components/InstructionGuide';
import FacilitatorGuide from './components/FacilitatorGuide';
import StepIndicator from './components/ui/StepIndicator';
import Footer from './components/ui/Footer';
import { RollReflectLogo } from './components/ui/Icons';

import { SELF_EVALUATION_PARAMETERS, DICE_DATA } from './constants';
import type { DiceResult, DieItem, DiceCategory } from './types';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [scores, setScores] = useState<number[]>(() => Array(SELF_EVALUATION_PARAMETERS.length).fill(0));
  const [initialScores, setInitialScores] = useState<number[] | null>(null);
  
  const [diceResult, setDiceResult] = useState<DiceResult | null>(null);
  const [isFacilitatorGuideOpen, setIsFacilitatorGuideOpen] = useState(false);

  const getRandomItem = (items: DieItem[]): DieItem => {
    return items[Math.floor(Math.random() * items.length)];
  };

  const handleRoll = () => {
    const newResult: DiceResult = {
      didactic: getRandomItem(DICE_DATA.didactic),
      digital: getRandomItem(DICE_DATA.digital),
      analog: getRandomItem(DICE_DATA.analog),
    };
    setDiceResult(newResult);
  };

  const handleSingleRoll = (category: DiceCategory) => {
    setDiceResult(prevResult => {
        if (!prevResult) return null;
        const newResult = { ...prevResult };
        newResult[category] = getRandomItem(DICE_DATA[category]);
        return newResult;
    });
  };

  const handleScoreChange = (index: number, value: number) => {
    const newScores = [...scores];
    newScores[index] = value;
    setScores(newScores);
  };

  const saveInitialScores = () => {
    setInitialScores(scores);
    setScores(Array(SELF_EVALUATION_PARAMETERS.length).fill(0));
    setCurrentStep(2);
  };
  
  const goToFinalEvaluation = () => {
      setCurrentStep(3);
  };

  const reset = () => {
      setCurrentStep(1);
      setInitialScores(null);
      setScores(Array(SELF_EVALUATION_PARAMETERS.length).fill(0));
      setDiceResult(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-[#464646] flex flex-col">
      <header className="pt-6 pb-10 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
               <RollReflectLogo className="h-16 w-16 text-[#C00D0D]" />
               <h1 className="text-2xl font-bold text-[#464646]">Roll & Reflect</h1>
            </div>
            <div className="w-96">
              <StepIndicator currentStep={currentStep} />
            </div>
        </div>
      </header>
      <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-4xl mx-auto space-y-8">
          {currentStep === 1 && (
            <>
              <SelfEvaluationCompass 
                parameters={SELF_EVALUATION_PARAMETERS}
                scores={scores}
                onScoreChange={handleScoreChange}
              />
              <div className="flex justify-between items-center">
                 <button
                  onClick={() => setIsFacilitatorGuideOpen(true)}
                  className="text-[#C00D0D] font-semibold py-2 px-6 rounded-md hover:bg-red-50 transition-colors"
                >
                    Til dig som facilitator
                </button>
                <button 
                  onClick={saveInitialScores}
                  className="bg-[#C00D0D] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#a00a0a] transition-colors"
                >
                  Gem og fortsæt til trin 2
                </button>
              </div>
            </>
          )}
          {currentStep === 2 && (
            <>
              <DiceRoller 
                onRoll={handleRoll}
                onSingleRoll={handleSingleRoll}
                result={diceResult}
              />
              <InstructionGuide />
              <div className="flex justify-between items-center pt-4">
                 <button onClick={reset} className="text-sm text-gray-500 hover:underline">Start forfra</button>
                 <button
                    onClick={goToFinalEvaluation}
                    disabled={!diceResult}
                    className="bg-[#C00D0D] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#a00a0a] transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
                 >
                    Fortsæt til trin 3
                </button>
              </div>
            </>
          )}
          {currentStep === 3 && (
            <>
              <SelfEvaluationCompass 
                parameters={SELF_EVALUATION_PARAMETERS}
                scores={scores}
                onScoreChange={handleScoreChange}
                initialScores={initialScores}
              />
              <div className="flex justify-between items-center pt-4">
                <button onClick={() => setCurrentStep(2)} className="text-[#C00D0D] font-semibold py-2 px-6 rounded-md hover:bg-red-50 transition-colors">
                    Tilbage til trin 2
                 </button>
                 <button onClick={reset} className="bg-[#464646] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#333333] transition-colors">
                    Start forfra
                 </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <FacilitatorGuide 
          isOpen={isFacilitatorGuideOpen} 
          onClose={() => setIsFacilitatorGuideOpen(false)} 
      />
    </div>
  );
}

export default App;