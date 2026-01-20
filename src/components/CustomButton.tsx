import React from 'react'

interface CustomButtonProps {
  variant?: "primary" | "alert" | "warning";
  children: React.ReactNode;
}

const CustomButton = ({
    variant = "primary",
    children,
    }: CustomButtonProps) => {
  
    const baseStyle = "font-semibold";
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700",
        alert: "bg-yellow-600 hover:bg-yellow-700",
        warning: "bg-red-600 hover:bg-red-700"
    };
  
    return (
    <div className='p-2'>
        <button className= {`${baseStyle} ${variants[variant]}`}>
            {children}
        </button>
    </div>
  )
}

export default CustomButton