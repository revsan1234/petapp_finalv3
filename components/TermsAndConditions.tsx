import React from 'react';
import { Card } from './ui/Card';
import { useLanguage } from '../contexts/LanguageContext';

interface TermsAndConditionsProps {
    onBack: () => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onBack }) => {
    const { language } = useLanguage();

    const content = {
        en: {
            title: "Terms & Conditions",
            sections: [
                {
                    title: "1. Terms",
                    text: "By accessing the application Name My Pet, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this app. The materials contained in this application are protected by applicable copyright and trademark law."
                },
                {
                    title: "2. Use License",
                    text: "Permission is granted to temporarily use the materials on Name My Pet's application for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title. This license shall automatically terminate if you violate any of these restrictions and may be terminated by Name My Pet at any time."
                },
                {
                    title: "3. Disclaimer",
                    text: "The materials on Name My Pet's application are provided on an 'as is' basis. Name My Pet makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
                },
                {
                    title: "4. Limitations",
                    text: "In no event shall Name My Pet or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Name My Pet's application."
                },
                {
                    title: "5. Links to Other Sites",
                    text: "Name My Pet has not reviewed all of the sites linked to its application (such as affiliate product links and video generation services) and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Name My Pet of the site. Use of any such linked website is at the user's own risk."
                },
                {
                    title: "6. Modifications",
                    text: "Name My Pet may revise these terms of service for its application at any time without notice. By using this application you are agreeing to be bound by the then current version of these terms of service."
                }
            ]
        },
        es: {
            title: "Términos y Condiciones",
            sections: [
                {
                    title: "1. Términos",
                    text: "Al acceder a la aplicación Name My Pet, usted acepta estar sujeto a estos términos de servicio, a todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a esta aplicación. Los materiales contenidos en esta aplicación están protegidos por la ley de derechos de autor y marcas comerciales aplicable."
                },
                {
                    title: "2. Licencia de Uso",
                    text: "Se concede permiso para usar temporalmente los materiales en la aplicación de Name My Pet solo para visualización transitoria personal y no comercial. Esta es la concesión de una licencia, no una transferencia de título. Esta licencia terminará automáticamente si usted viola alguna de estas restricciones y puede ser terminada por Name My Pet en cualquier momento."
                },
                {
                    title: "3. Descargo de Responsabilidad",
                    text: "Los materiales en la aplicación de Name My Pet se proporcionan 'tal cual'. Name My Pet no ofrece garantías, expresas o implícitas, y por la presente renuncia y niega todas las demás garantías, incluidas, entre otras, las garantías implícitas o condiciones de comerciabilidad, idoneidad para un propósito particular o no infracción de propiedad intelectual u otra violación de derechos."
                },
                {
                    title: "4. Limitaciones",
                    text: "En ningún caso Name My Pet o sus proveedores serán responsables de ningún daño (incluidos, entre otros, daños por pérdida de datos o ganancias, o debido a la interrupción del negocio) que surjan del uso o la incapacidad de usar los materiales en la aplicación de Name My Pet."
                },
                {
                    title: "5. Enlaces a Otros Sitios",
                    text: "Name My Pet no ha revisado todos los sitios vinculados a su aplicación (como enlaces de productos afiliados y servicios de generación de video) y no es responsable de los contenidos de dichos sitios vinculados. La inclusión de cualquier enlace no implica el respaldo por parte de Name My Pet del sitio. El uso de cualquier sitio web vinculado es bajo el propio riesgo del usuario."
                },
                {
                    title: "6. Modificaciones",
                    text: "Name My Pet puede revisar estos términos de servicio para su aplicación en cualquier momento sin previo aviso. Al usar esta aplicación, usted acepta estar sujeto a la versión actual de estos términos de servicio."
                }
            ]
        }
    };

    const t = content[language];

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8">
            <div className="container mx-auto max-w-4xl">
                <header className="flex items-center justify-start mb-8">
                     <button onClick={onBack} className="p-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors backdrop-blur-sm text-[#666666]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                </header>
                <main>
                    <Card className="text-left">
                        <h1 className="text-3xl font-bold mb-6 text-center">{t.title}</h1>
                        <div className="space-y-4 text-lg opacity-90">
                           {t.sections.map((section, index) => (
                               <React.Fragment key={index}>
                                   <p><strong>{section.title}</strong></p>
                                   <p>{section.text}</p>
                               </React.Fragment>
                           ))}
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
};