import React from 'react';

import { useTranslation } from 'react-i18next';

// Definimos la interfaz para que TypeScript esté contento
interface ServiceCardProps {
    title?: string;
    description?: string;
    color?: 'primary' | 'secondary' | 'tertiary'; // Tipado estricto para las llaves
    extraStyles?: string;
    type?: 'link' | 'button' | 'none';
    icon: React.ReactNode; // Soluciona el error de "implicitly any"
}

const ServiceCard = ({
    title = "Servicio",
    description = "Descripción...",
    color = "primary",
    extraStyles = "",
    type = 'link', 
    icon
}: ServiceCardProps) => { // Aplicamos la interfaz aquí
    
    const isButton = type === 'button';
    const isLink = type === 'link';

    const { t } = useTranslation();

    const colorMap = {
        primary: { bg: 'bg-primary-50', text: 'text-primary-500' },
        secondary: { bg: 'bg-secondary-50', text: 'text-secondary-500' },
        tertiary: { bg: 'bg-tertiary-50', text: 'text-tertiary-500' },
    };

    // Al haber definido 'color' en la interfaz, este acceso ya es seguro para TS
    const selectedColor = colorMap[color] || colorMap.primary;

    return (
        /* Cambié items-center por items-start para alinear a la izquierda */
        <div className={`flex flex-col h-full border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all bg-white items-start ${extraStyles}`}>
            
            {/* Contenedor del Icono */}
            <div className={`w-14 h-14 flex items-center justify-center rounded-xl mb-6 ${selectedColor.bg}`}>
                <span className={`text-4xl ${selectedColor.text}`}>
                    {icon}
                </span>
            </div>

            {/* Texto - Alineación natural a la izquierda */}
            <h3 className="text-xl font-bold mb-3 text-gray-900 leading-tight">
                {title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 text-left">
                {description}
            </p>

            {/* Espaciador */}
            <div className="grow"></div>

            {/* Acciones: El contenedor tiene w-full y justify-center para el botón */}
            <div className={`w-full flex mt-2 ${isButton ? 'justify-center' : 'justify-start'}`}>
                {isLink && (
                    <a 
                        href="/services" 
                        className={`font-bold flex items-center gap-2 transition-opacity hover:opacity-80 ${selectedColor.text}`}
                    >
                        {t('landing-page.read-more')} <span>→</span>
                    </a>
                )}

                {isButton && (
                    <button 
                        onClick={() => window.location.href = '/contact'}
                        className="w-full sm:w-auto px-8 py-2.5 rounded-lg font-bold text-white transition-transform active:scale-95 bg-neutral-900 hover:bg-black"
                    >
                        {t('navbar.btn-contact')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ServiceCard;