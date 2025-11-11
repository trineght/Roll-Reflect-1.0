import React from 'react';

export const RollReflectLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            {...props}
        >
            <g fill="currentColor">
                {/* Thought bubble path */}
                <path d="M16,2C8.3,2,2,7.4,2,14c0,5.2,3.1,9.7,7.5,11.9c-0.3,0.6-0.7,1.2-1,1.7c-0.3,0.5-0.2,1.1,0.3,1.4 C9.3,29.3,9.9,29.2,10.2,28.7c1.1-1.6,2.6-2.6,4.3-2.8C14.8,26,15.4,26,16,26c7.7,0,14-6.3,14-14S23.7,2,16,2z" />
                
                {/* Die inside the bubble */}
                <g>
                    {/* White background for the die */}
                    <rect x="10" y="8" width="12" height="12" rx="2" fill="white" />
                    {/* The pips (dots) will inherit the current color */}
                    <circle cx="13" cy="11" r="1.1" />
                    <circle cx="19" cy="11" r="1.1" />
                    <circle cx="13" cy="14" r="1.1" />
                    <circle cx="19" cy="14" r="1.1" />
                    <circle cx="13" cy="17" r="1.1" />
                    <circle cx="19" cy="17" r="1.1" />
                </g>
            </g>
        </svg>
    );
};

export const MILLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 132 72" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M0 18H20V72H0V18Z" fill="#3A2D56"/>
        <path d="M28 18H48V72H28V18Z" fill="#3A2D56"/>
        <path d="M56 18H76V72H56V18Z" fill="#3A2D56"/>
        <path d="M84 18H104V72H84V18Z" fill="#3A2D56"/>
        <path d="M112 0H132V72H112V0Z" fill="#3A2D56"/>
        <path d="M84 0H104V14H84V0Z" fill="#F7941D"/>
    </svg>
);
