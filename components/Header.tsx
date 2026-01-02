
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
    <header className="p-0 pt-4 pb-2 flex justify-center items-center gap-1 sm:gap-6 md:gap-10 relative z-20 w-full overflow-hidden">
      {leftPet && (
          <div className="flex-shrink-0">
            <PetCharacter 
              pet={leftPet} 
              className="w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 drop-shadow-xl transform -rotate-6 hover:scale-110 hover:rotate-0 transition-all duration-300" 
            />
          </div>
      )}
      
      <div 
        className={`flex-shrink transform hover:scale-105 transition-all duration-300 p-1 sm:p-2 ${onLogoClick ? 'cursor-pointer active:scale-95' : ''}`}
        onClick={onLogoClick}
      >
        <AppLogo />
      </div>

      {rightPet && (
          <div className="flex-shrink-0">
            <PetCharacter 
              pet={rightPet} 
              className="w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 drop-shadow-xl transform rotate-6 hover:scale-110 hover:rotate-0 transition-all duration-300" 
            />
          </div>
      )}
    </header>
  );
};
