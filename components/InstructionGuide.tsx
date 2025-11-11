import React from 'react';
import Card from './ui/Card';

const InstructionGuide: React.FC = () => {
    const steps = [
        "I mindre grupper, bestem jer for et undervisningsforløb (eksisterende, kommende, eller nyt) baseret på terningeslagene.",
        "Udarbejd et konkret undervisningsforløb og præsenter det for de øvrige grupper for at få feedback og tilrette.",
        "Afprøv det konkrete undervisningsforløb hos elever/studerende.",
        "Saml holdet igen og evaluer på, hvordan det er gået. Juster forløbet baseret på feedback og fælles idégenerering.",
        "Efter justering, afprøv undervisningsforløbet på ny hos elever/studerende.",
        "Til sidst, placer jer igen i selvevalueringskompasset. Diskuter og evaluer på, hvorfor nogle punkter har ændret sig, og hvorfor andre ikke har."
    ];

    return (
        <Card>
            <h2 className="text-2xl font-bold text-[#464646] mb-4">Næste skridt</h2>
            <ul className="space-y-4">
                {steps.map((step, index) => (
                    <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-[#C00D0D] text-white rounded-full font-bold text-sm">
                            {index + 1}
                        </div>
                        <p className="ml-3 text-[#464646]">{step}</p>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default InstructionGuide;