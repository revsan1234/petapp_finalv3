import React, { useEffect, useState } from 'react';

interface CelebrationEffectProps {
    trigger: boolean;
    onComplete?: () => void;
}

export const CelebrationEffect: React.FC<CelebrationEffectProps> = ({ trigger, onComplete }) => {
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; shape: 'heart' | 'sparkle' }>>([]);

    useEffect(() => {
        if (trigger) {
            // Generate random particles
            const newParticles = Array.from({ length: 12 }, (_, i) => ({
                id: Date.now() + i,
                x: Math.random() * 200 - 100, // Random horizontal offset from center
                y: Math.random() * 150 - 75,  // Random vertical offset from center
                color: ['#FF69B4', '#FFB6C1', '#FFC0CB', '#FF1493', '#FFD700', '#FFA500'][Math.floor(Math.random() * 6)],
                shape: (Math.random() > 0.5 ? 'heart' : 'sparkle') as 'heart' | 'sparkle',
            }));

            setParticles(newParticles);

            // Clear particles after animation
            const timer = setTimeout(() => {
                setParticles([]);
                if (onComplete) {
                    onComplete();
                }
            }, 800); // Duration should match the animation

            return () => clearTimeout(timer);
        }
    }, [trigger, onComplete]);

    if (particles.length === 0) {
        return null;
    }

    return (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute animate-confetti"
                    style={{
                        // Using translate for positioning from the center
                        transform: `translate(${particle.x}px, ${particle.y}px)`,
                        color: particle.color,
                    }}
                >
                    {particle.shape === 'heart' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.7-6.3 4.7 2.3-7-6-4.6h7.6z"/>
                        </svg>
                    )}
                </div>
            ))}
        </div>
    );
};