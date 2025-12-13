
import React from "react";
import type { PetKind } from "../../../types";
import { PetDog } from './PetDog';
import { PetCat } from './PetCat';
import { PetRabbit } from './PetRabbit';
import { PetBird } from './PetBird';
import { PetHamster } from './PetHamster';
import { PetFish } from './PetFish';
import { PetLizard } from './PetLizard';
import { PetFerret } from './PetFerret';


interface PetCharacterProps {
  pet: PetKind;
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
  [key: string]: any;
}

// A map to hold our pet components
const petComponentMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    dog: PetDog,
    cat: PetCat,
    rabbit: PetRabbit,
    bird: PetBird,
    hamster: PetHamster,
    fish: PetFish,
    lizard: PetLizard,
    ferret: PetFerret,
};

const VALID_PETS: PetKind[] = ['dog', 'cat', 'rabbit', 'bird', 'hamster', 'fish', 'lizard', 'ferret'];

/**
 * Renders a specific pet character SVG component based on the 'pet' prop.
 * This ensures images are bundled and load instantly without extra requests.
 */
export const PetCharacter = ({
  pet,
  className,
  style,
  "aria-label": ariaLabel,
  ...props
}: PetCharacterProps) => {
  // Fallback to 'dog' if the pet type isn't in our known list (this prevents the question mark)
  const safePet = pet ? (VALID_PETS.includes(pet.toLowerCase() as PetKind) ? pet.toLowerCase() : 'dog') : 'dog';
  const PetComponent = petComponentMap[safePet] || petComponentMap['dog'];

  const combinedClassName = `${className || ''}`.trim();
  
  // The aria-label is now on the SVG component itself, but we can override it if needed.
  const accessibilityProps = ariaLabel ? { "aria-label": ariaLabel } : {};

  return (
    <PetComponent
      className={combinedClassName}
      style={style}
      {...accessibilityProps}
      {...props}
    />
  );
};