import React, { useState } from 'react';
import { FACILITATOR_CONTENT } from '../facilitatorConstants';

interface FacilitatorGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

const FacilitatorGuide: React.FC<FacilitatorGuideProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState(0);

    if (!isOpen) return null;

    const activeContent = FACILITATOR_CONTENT[activeTab];

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="facilitator-guide-title"
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
                    <h2 id="facilitator-guide-title" className="text-xl font-bold text-[#464646]">Guide til facilitator</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-800"
                        aria-label="Luk"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex border-b overflow-x-auto bg-white flex-shrink-0">
                    {FACILITATOR_CONTENT.map((item, index) => (
                        <button
                            key={item.tab}
                            onClick={() => setActiveTab(index)}
                            className={`py-3 px-4 text-sm font-semibold transition-colors flex-shrink-0 ${
                                activeTab === index 
                                ? 'border-b-2 border-[#C00D0D] text-[#C00D0D]' 
                                : 'text-gray-500 hover:text-[#464646]'
                            }`}
                            role="tab"
                            aria-selected={activeTab === index}
                        >
                            {item.tab}
                        </button>
                    ))}
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <div className="prose max-w-none prose-gray text-[#464646]">
                        <h3 className="text-xl font-bold text-[#464646] mb-4">{activeContent.title}</h3>
                        {activeContent.content}
                    </div>
                </div>
            </div>
             <style>{`
                .prose ul.list-circle {
                    list-style-type: circle;
                }
            `}</style>
        </div>
    );
};

export default FacilitatorGuide;