import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CustomButtonProps {
  // Añadimos "none" a las opciones
  variant?: "primary" | "alert" | "warning" | "none"; 
  children: React.ReactNode;
  route?: string;
  onClick?: () => void;
  disabled?: boolean;
  // Nueva prop para estilos externos
  className?: string; 
}

const CustomButton = ({
    variant = "primary",
    children,
    route,
    onClick,
    disabled = false,
    className = "", // Valor por defecto vacío
    }: CustomButtonProps) => {
    
    const navigate = useNavigate();
    
    // Estilos base
    const baseStyles = 'mx-5 px-4 py-2 font-semibold rounded-lg transition transform';
    const enabledStyles = 'hover:scale-105 cursor-pointer';
    const disabledStyles = 'cursor-not-allowed opacity-50 grayscale'; // Mejoramos el feedback visual de deshabilitado

    const variants = {
        primary: 'bg-tertiary-500 hover:bg-primary-600 text-white',
        alert: 'bg-primary-500 text-white',
        warning: 'bg-secondary-500 text-white',
        none: "" // Variante limpia para control total externo
    };

    const handleClick = () => {
        if (disabled) return;
        if (route) {
            navigate(route);
        } else if (onClick) {
            onClick();
        }
    };
  
    return (
        <button 
            type="button" // Buena práctica para evitar envíos de formularios accidentales
            onClick={handleClick}
            disabled={disabled}
            className={`
                ${variant !== 'none' ? baseStyles : ''} 
                ${disabled ? disabledStyles : enabledStyles}
                ${variants[variant]}
                ${className}
            `.trim()} 
        >
            {children}
        </button>
    );
};

export default CustomButton;