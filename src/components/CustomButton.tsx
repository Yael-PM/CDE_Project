import React from 'react'
import { useNavigate } from 'react-router-dom';

interface CustomButtonProps {
  variant?: "primary" | "alert" | "warning";
  children: React.ReactNode;
  route?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const CustomButton = ({
    variant = "primary",
    children,
    route,
    onClick,
    disabled = false,
    }: CustomButtonProps) => {
    
    const navigate = useNavigate();
    

    //estilos para los estados de los botones
    const baseStyles = 'mx-5 p-1 font-semibold rounded-2xl transition transform';
    const enabledStyles = 'hover:scale-105 cursor-pointer';
    const disabledStyles = 'cursor-not-allowed text-gray-400';

    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        alert: 'bg-yellow-600 hover:bg-yellow-700',
        warning: 'bg-red-600 hover:bg-red-700'
    };

    //Funcion que nos dice como manejar la interaccion del usuario
    const handleClick = () => {
        if (disabled) return;

        if (route) {
            navigate(route);
        }else if(onClick){
            onClick();
        }
    }
  
    return (
    <div className='p-0.5'>
        <button 
        onClick={handleClick}
        disabled = {disabled}
        className= 
            {`${baseStyles} 
              ${disabled ? disabledStyles : enabledStyles}
              ${disabled ? 'hover:none' : ''};
              ${variants[variant]}
              `}>
            {children}
        </button>
    </div>
  )
}

export default CustomButton