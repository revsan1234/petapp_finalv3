
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
    <header className="p-0 pt-6 pb-4 flex justify-center items-center gap-2 sm:gap-10 md:gap-16 lg:gap-20 relative z-20 w-full overflow-hidden">
      {leftPet && (
          <div className="flex-shrink-0">
            <PetCharacter 
              pet={leftPet} 
              className="w-20 h-20 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 drop-shadow-2xl transform -rotate-6 hover:scale-110 hover:rotate-0 transition-all duration-300" 
            />
          </div>
      )}
      
      <div 
        className={`flex-shrink-0 transform hover:scale-105 transition-all duration-300 p-1 sm:p-2 ${onLogoClick ? 'cursor-pointer active:scale-95' : ''}`}
        onClick={onLogoClick}
      >
        <AppLogo />
      </div>

      {rightPet && (
          <div className="flex-shrink-0">
            <PetCharacter 
              pet={rightPet} 
              className="w-20 h-20 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 drop-shadow-2xl transform rotate-6 hover:scale-110 hover:rotate-0 transition-all duration-300" 
            />
          </div>
      )}
    </header>
  );
};

