
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

import DiceRoller from './components/DiceRoller';
import InstructionGuide from './components/InstructionGuide';
import FacilitatorGuide from './components/FacilitatorGuide';
import ScenarioDisplay from './components/ScenarioDisplay';
import Footer from './components/ui/Footer';
import { RollReflectLogo } from './components/ui/Icons';

import { DICE_DATA } from './constants';
import type { DiceResult, DieItem, DiceCategory } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'educator' | 'facilitator'>('educator');
  const [diceResult, setDiceResult] = useState<DiceResult | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [groupSize, setGroupSize] = useState<string>('');
  
  // AI Generation State
  const [scenario, setScenario] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Debounce ref for scenario generation
  const generationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // AI Generation Effect
  useEffect(() => {
    if (!diceResult) return;

    // Clear previous timeout
    if (generationTimeoutRef.current) {
        clearTimeout(generationTimeoutRef.current);
    }

    // Set a small delay to allow for UI updates (or multiple rapid clicks) to settle
    generationTimeoutRef.current = setTimeout(async () => {
        setIsGenerating(true);
        setGenerationError(null);
        
        try {
            if (!process.env.API_KEY) {
                throw new Error("API Key mangler");
            }

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const educationContext = selectedEducation 
                ? `for uddannelsen **${selectedEducation}**. Scenariet SKAL tage konkret udgangspunkt i denne uddannelses studieordning, fagbegreber og typiske praksissituationer.`
                : "for en videregående uddannelse (professionsbachelor eller erhvervsakademi).";

            const logisticsContext = [
                duration ? `Varighed: ${duration} minutter.` : null,
                groupSize ? `Holdstørrelse: ${groupSize} studerende.` : null
            ].filter(Boolean).join(' ');

            const prompt = `
                Du er en pædagogisk konsulent og ekspert i didaktik på videregående uddannelser.
                Lav et konkret, praksisnært og detaljeret undervisningsscenarie ${educationContext}
                ${logisticsContext}

                Scenariet skal kombinere følgende tre elementer som de bærende kræfter:
                1. **Didaktisk metode:** ${diceResult.didactic.title} (${diceResult.didactic.description})
                2. **Digital teknologi:** ${diceResult.digital.title} (${diceResult.digital.description})
                3. **Analog teknologi:** ${diceResult.analog.title} (${diceResult.analog.description})

                **Krav til output:**
                - Vær meget konkret. Beskriv hvad de studerende gør, og hvad underviseren gør.
                - Brug fagsprog der passer til ${selectedEducation || 'uddannelsen'}.
                - Scenariet skal være realistisk at gennemføre inden for den angivne tidsramme (hvis angivet).

                **Format:**
                # [Giv scenariet en fængende titel]
                **Kontekst:** Hvilket fag/semester/tema passer dette til?
                **Læringsmål:** Hvad får de studerende ud af dette (koblet til kompetencemål)?
                **Scenariet:** En levende beskrivelse af selve undervisningsgangen (Brug punktopstilling eller trin).
                **Hvorfor virker det?:** En kort pædagogisk begrundelse for netop denne kombination af analogt og digitalt.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            if (response.text) {
                setScenario(response.text);
            } else {
                throw new Error("Ingen svar fra AI");
            }

        } catch (err) {
            console.error(err);
            setGenerationError("Kunne ikke generere scenarie. Prøv igen eller tjek din forbindelse.");
        } finally {
            setIsGenerating(false);
        }
    }, 500); // 500ms debounce

    return () => {
        if (generationTimeoutRef.current) {
            clearTimeout(generationTimeoutRef.current);
        }
    };
  }, [diceResult, selectedEducation, duration, groupSize]);


  return (
    <div className="bg-gray-50 min-h-screen font-sans text-[#464646] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">
            <div className="flex items-center gap-3 mb-6">
               <RollReflectLogo className="h-12 w-12 text-[#C00D0D]" />
               <h1 className="text-2xl font-bold text-[#464646]">Roll & Reflect</h1>
            </div>
            
            {/* Main Navigation Tabs */}
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('educator')}
                className={`pb-4 px-1 text-lg font-medium transition-colors relative ${
                  activeTab === 'educator'
                    ? 'text-[#C00D0D]'
                    : 'text-gray-500 hover:text-[#464646]'
                }`}
              >
                Til dig som underviser
                {activeTab === 'educator' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C00D0D]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('facilitator')}
                className={`pb-4 px-1 text-lg font-medium transition-colors relative ${
                  activeTab === 'facilitator'
                    ? 'text-[#C00D0D]'
                    : 'text-gray-500 hover:text-[#464646]'
                }`}
              >
                Til dig som facilitator
                {activeTab === 'facilitator' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C00D0D]" />
                )}
              </button>
            </div>
        </div>
      </header>

      <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* EDUCATOR VIEW */}
          {activeTab === 'educator' && (
            <div className="space-y-8 animate-fade-in">
              <DiceRoller 
                onRoll={handleRoll}
                onSingleRoll={handleSingleRoll}
                result={diceResult}
                selectedEducation={selectedEducation}
                onEducationChange={setSelectedEducation}
                duration={duration}
                onDurationChange={setDuration}
                groupSize={groupSize}
                onGroupSizeChange={setGroupSize}
              />
              
              {diceResult && (
                  <>
                    <ScenarioDisplay 
                        diceResult={diceResult} 
                        scenario={scenario} 
                        isLoading={isGenerating} 
                        error={generationError} 
                    />
                    <InstructionGuide />
                  </>
              )}
            </div>
          )}

          {/* FACILITATOR VIEW */}
          {activeTab === 'facilitator' && (
             <div className="animate-fade-in">
               <FacilitatorGuide />
             </div>
          )}

        </div>
      </main>
      
      <Footer />
      
      <style>{`
        @keyframes fade-in {
            0% { opacity: 0; transform: translateY(5px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App;
