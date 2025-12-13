import React from 'react';

export const BackgroundPattern: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20">
            {/* Soft blob shapes using CSS variables for theme adaptability */}
            <div 
                className="absolute top-[15%] left-[10%] w-[300px] h-[300px] rounded-full opacity-20"
                style={{
                    background: 'radial-gradient(circle, var(--blob-1) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                    transition: 'background 0.5s ease',
                }}
            />
            <div 
                className="absolute top-[60%] right-[15%] w-[250px] h-[250px] rounded-full opacity-20"
                style={{
                    background: 'radial-gradient(circle, var(--blob-2) 0%, transparent 70%)',
                    filter: 'blur(35px)',
                    transition: 'background 0.5s ease',
                }}
            />
            <div 
                className="absolute bottom-[20%] left-[20%] w-[200px] h-[200px] rounded-full opacity-20"
                style={{
                    background: 'radial-gradient(circle, var(--blob-3) 0%, transparent 70%)',
                    filter: 'blur(30px)',
                    transition: 'background 0.5s ease',
                }}
            />
            <div 
                className="absolute top-[40%] right-[5%] w-[180px] h-[180px] rounded-full opacity-20"
                style={{
                    background: 'radial-gradient(circle, var(--blob-1) 0%, transparent 70%)',
                    filter: 'blur(25px)',
                    transition: 'background 0.5s ease',
                }}
            />
        </div>
    );
};