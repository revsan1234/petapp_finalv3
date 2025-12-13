import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Input } from './ui/Input';
import { PetCharacter } from './assets/pets/PetCharacter';
import { useLanguage } from '../contexts/LanguageContext';

const CalculatorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const PetAgeCalculator: React.FC = () => {
    const { t } = useLanguage();
    const [petType, setPetType] = useState<'Dog' | 'Cat' | 'Rabbit'>('Dog');
    const [age, setAge] = useState<string>('');
    const [humanAge, setHumanAge] = useState<number | null>(null);

    const calculateAge = () => {
        const years = parseFloat(age);
        if (isNaN(years)) return;

        let result = 0;
        
        // Using the "Classic" 7-year rule as requested (2 years = 14)
        if (petType === 'Dog' || petType === 'Cat') {
            result = years * 7;
        } else if (petType === 'Rabbit') {
            // Rabbits age slightly faster
            result = years * 7.5; 
        }

        setHumanAge(Math.floor(result));
    };

    return (
        <Card>
            <div className="flex flex-col items-center gap-2 mb-4 text-center">
                <div className="bg-[#aab2a1]/20 p-3 rounded-full mb-2">
                   <CalculatorIcon className="w-8 h-8 text-[#8da38d]" />
                </div>
                <h2 className="text-3xl font-bold">{t.age_calc.title}</h2>
                <p className="opacity-80 text-xl">{t.age_calc.subtitle}</p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <Select 
                        id="age-type" 
                        label={t.age_calc.label_pet}
                        value={petType} 
                        onChange={(e) => setPetType(e.target.value as any)}
                    >
                        <option value="Dog">{t.options.types.Dog || "Dog"}</option>
                        <option value="Cat">{t.options.types.Cat || "Cat"}</option>
                        <option value="Rabbit">{t.options.types.Rabbit || "Rabbit"}</option>
                    </Select>
                    <Input
                        id="pet-age-input"
                        label={t.age_calc.label_age}
                        type="number"
                        min="0"
                        max="30"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 2"
                    />
                 </div>

                 <div className="flex justify-center pt-2">
                    <Button onClick={calculateAge} variant="primary" className="w-full sm:w-auto">
                        {t.age_calc.btn_calculate}
                    </Button>
                 </div>
            </div>

            {humanAge !== null && (
                <div className="mt-8 animate-fade-in text-center">
                     <div className="relative inline-block">
                        <PetCharacter pet={petType.toLowerCase() as any} className="w-24 h-24 mx-auto mb-4 drop-shadow-lg animate-bounce-wiggle" />
                        <div className="bg-white/30 rounded-xl p-6 border border-white/40 backdrop-blur-sm">
                            <p className="text-lg opacity-80 mb-1">{t.age_calc.result_prefix}</p>
                            <p className="text-5xl font-black text-[#AA336A]">{humanAge}</p>
                            <p className="text-sm font-bold uppercase tracking-wider mt-2 opacity-60">{t.age_calc.result_suffix}</p>
                        </div>
                     </div>
                </div>
            )}
        </Card>
    );
};