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
    <header className="p-4 pt-[max(4rem,env(safe-area-inset-top))] pb-8 flex justify-center items-center gap-2 sm:gap-8 relative z-20">
      {leftPet && (
          <PetCharacter 
            pet={leftPet} 
            className="w-20 h-20 sm:w-32 sm:h-32 md:w-36 md:h-36 drop-shadow-xl transform -rotate-12 hover:scale-110 hover:rotate-0 transition-all duration-300" 
          />
      )}
      
      <div 
        className={`flex-shrink-0 transform hover:scale-105 transition-transform duration-300 ${onLogoClick ? 'cursor-pointer' : ''}`}
        onClick={onLogoClick}
      >
        <AppLogo />
      </div>

      {rightPet && (
          <PetCharacter 
            pet={rightPet} 
            className="w-20 h-20 sm:w-32 sm:h-32 md:w-36 md:h-36 drop-shadow-xl transform rotate-12 hover:scale-110 hover:rotate-0 transition-all duration-300" 
          />
      )}
    </header>
  );
};