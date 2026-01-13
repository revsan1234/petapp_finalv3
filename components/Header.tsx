import React from 'react';
import { AppLogo } from './assets/AppLogo';
import { PetCharacter } from './assets/pets/PetCharacter';
import type { PetKind } from '../types';

interface HeaderProps {
  leftPet?: PetKind;
  rightPet?: PetKind;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ leftPet, rightPet, onLogoClick }) => {
  return (
    <header className="p-2 sm:p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4 sm:pb-6 flex justify-center items-center gap-1 sm:gap-6 relative z-20 overflow-hidden">
      {leftPet && (
          <PetCharacter 
            pet={leftPet} 
            className="w-12 h-12 sm:w-28 sm:h-28 md:w-32 md:h-32 drop-shadow-xl transform -rotate-12 hover:scale-110 hover:rotate-0 transition-all duration-300 shrink-0" 
          />
      )}
      
      <div 
        className={`flex-shrink-1 min-w-0 transform hover:scale-105 transition-transform duration-300 ${onLogoClick ? 'cursor-pointer' : ''}`}
        onClick={onLogoClick}
      >
        <AppLogo />
      </div>

      {rightPet && (
          <PetCharacter 
            pet={rightPet} 
            className="w-12 h-12 sm:w-28 sm:h-28 md:w-32 md:h-32 drop-shadow-xl transform rotate-12 hover:scale-110 hover:rotate-0 transition-all duration-300 shrink-0" 
          />
      )}
    </header>
  );
};