import React, { useState } from 'react' // Importamos useState
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LuMenu, LuX } from "react-icons/lu"; // Usando Lucide para los iconos

import Logo from '/CDE Simple Logo.png'
import CustomButton from './CustomButton'

const NavBar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false); // Estado para el menú móvil

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLanguage);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className='relative flex justify-between items-center p-5 border-b border-gray-200 bg-white z-50'>
        {/* Logo */}
        <div className='w-25'>
          <img src={Logo} alt="CDE Logo" className="h-10 object-contain" />
        </div>
        
        {/* Menú Desktop - Se oculta en móvil (hidden) y aparece en md (md:flex) */}
        <div className='hidden md:flex'>
            <ul className='flex gap-6 [&>li]:cursor-pointer [&>li]:hover:scale-105 [&>li]:hover:underline [&>li]:hover:text-tertiary-500 items-center'>
                <li><Link to={'/'}>{t('navbar.home')}</Link></li>
                <li><Link to={'/services'}>{t('navbar.services')}</Link></li>
                <li><Link to={'/about-us'}>{t('navbar.about-us')}</Link></li>
                <li>{t('navbar.blog')}</li>
                <li><Link to={'/contact'}>{t('navbar.contact')}</Link></li>
            </ul>
        </div>

        {/* Acciones Desktop (Botones) - Se ocultan en móvil */}
        <div className='hidden md:flex items-center'>
            <CustomButton route="/contact">
              {t('navbar.btn-contact')}
            </CustomButton>
            <CustomButton
              onClick={toggleLanguage}
              variant="none"
              className='px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors uppercase text-sm font-bold'
            >
              {i18n.language === 'es' ? '🇬🇧 EN' : '🇪🇸 ES'}
            </CustomButton>
        </div>

        {/* Botón Hamburguesa - Solo visible en móvil (md:hidden) */}
        <div className='md:hidden flex items-center'>
            <button onClick={toggleMenu} className="text-3xl text-gray-700 focus:outline-none">
                {isOpen ? <LuX /> : <LuMenu />}
            </button>
        </div>

        {/* Menú Desplegable Móvil */}
        <div className={`
            absolute top-full left-0 w-full bg-white border-b border-gray-200 p-5 shadow-lg transition-all duration-300 ease-in-out md:hidden
            ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-5'}
        `}>
            <ul className='flex flex-col gap-5 text-center items-center'>
                <li onClick={toggleMenu}><Link to={'/'}>{t('navbar.home')}</Link></li>
                <li onClick={toggleMenu}><Link to={'/services'}>{t('navbar.services')}</Link></li>
                <li>{t('navbar.about-us')}</li>
                <li>{t('navbar.blog')}</li>
                <li onClick={toggleMenu}><Link to={'/contact'}>{t('navbar.contact')}</Link></li>
                
                <div className='flex flex-col gap-3 w-full pt-4 border-t border-gray-100'>
                    <CustomButton route="/contact" onClick={toggleMenu}>
                      {t('navbar.btn-contact')}
                    </CustomButton>
                    <CustomButton
                      onClick={() => { toggleLanguage(); toggleMenu(); }}
                      variant="none"
                      className='mx-auto px-5 py-2 border border-gray-300 rounded-lg uppercase text-sm font-bold'
                    >
                      {i18n.language === 'es' ? '🇬🇧 EN' : '🇪🇸 ES'}
                    </CustomButton>
                </div>
            </ul>
        </div>
    </nav>
  )
}

export default NavBar