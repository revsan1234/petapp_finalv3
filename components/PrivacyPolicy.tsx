import React from 'react';
import { Card } from './ui/Card';
import { useLanguage } from '../contexts/LanguageContext';

interface PrivacyPolicyProps {
    onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
    const { language } = useLanguage();

    const content = {
        en: {
            title: "Privacy Policy",
            p1: "Your privacy is important to us. It is the policy of Name My Pet to respect your privacy regarding any information we may collect from you across our app and other sites we own and operate.",
            p2: "We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.",
            p3: "We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification.",
            p4: "We don’t share any personally identifying information publicly or with third-parties, except when required by to law.",
            p5: "Our app may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.",
            p6: "You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.",
            p7: "Your continued use of our app will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.",
            p8: "This policy is effective as of July 29, 2024."
        },
        es: {
            title: "Política de Privacidad",
            p1: "Su privacidad es importante para nosotros. Es política de Name My Pet respetar su privacidad con respecto a cualquier información que podamos recopilar de usted a través de nuestra aplicación y otros sitios que poseemos y operamos.",
            p2: "Solo solicitamos información personal cuando realmente la necesitamos para brindarle un servicio. La recopilamos por medios justos y legales, con su conocimiento y consentimiento. También le informamos por qué la recopilamos y cómo se utilizará.",
            p3: "Solo conservamos la información recopilada durante el tiempo necesario para brindarle el servicio solicitado. Los datos que almacenamos los protegeremos dentro de medios comercialmente aceptables para evitar pérdidas y robos, así como el acceso, divulgación, copia, uso o modificación no autorizados.",
            p4: "No compartimos ninguna información de identificación personal públicamente o con terceros, excepto cuando lo exija la ley.",
            p5: "Nuestra aplicación puede vincular a sitios externos que no son operados por nosotros. Tenga en cuenta que no tenemos control sobre el contenido y las prácticas de estos sitios, y no podemos aceptar responsabilidad u obligación por sus respectivas políticas de privacidad.",
            p6: "Usted es libre de rechazar nuestra solicitud de información personal, con el entendimiento de que es posible que no podamos brindarle algunos de sus servicios deseados.",
            p7: "Su uso continuado de nuestra aplicación se considerará como la aceptación de nuestras prácticas en materia de privacidad e información personal. Si tiene alguna pregunta sobre cómo manejamos los datos de los usuarios y la información personal, no dude en contactarnos.",
            p8: "Esta política es efectiva a partir del 29 de julio de 2024."
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
                            <p>{t.p1}</p>
                            <p>{t.p2}</p>
                            <p>{t.p3}</p>
                            <p>{t.p4}</p>
                            <p>{t.p5}</p>
                            <p>{t.p6}</p>
                            <p>{t.p7}</p>
                            <p>{t.p8}</p>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
};