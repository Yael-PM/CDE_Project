import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
// Agregamos LuLogOut para el cierre de sesión
import { LuMenu, LuX, LuUser, LuLanguages, LuLogOut } from "react-icons/lu"; 

import { useAuth } from '../hooks/useAuth' // 1. Importamos tu hook
import Logo from '/CDE Simple Logo.png'
import CustomButton from './CustomButton'

const NavBar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  // 2. Obtenemos el estado y la función de logout
  const { isAuthenticated, logout } = useAuth();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLanguage);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className='relative flex justify-between items-center p-5 border-b border-gray-200 bg-white z-50'>
        {/* Logo */}
        <div className='w-25'>
          <Link to="/">
            <img src={Logo} alt="CDE Logo" className="h-10 object-contain" />
          </Link>
        </div>
        
        {/* Menú Desktop */}
        <div className='hidden md:flex'>
            <ul className='flex gap-6 [&>li]:cursor-pointer [&>li]:transition-all [&>li]:duration-200 [&>li]:hover:text-tertiary-500 items-center font-medium text-slate-700'>
                <li><Link to={'/'}>{t('navbar.home')}</Link></li>
                <li><Link to={'/services'}>{t('navbar.services')}</Link></li>
                <li><Link to={'/about-us'}>{t('navbar.about-us')}</Link></li>
                <li><Link to={'/blog'}>{t('navbar.blog')}</Link></li>
                <li><Link to={'/contact'}>{t('navbar.contact')}</Link></li>
            </ul>
        </div>

        {/* Acciones Desktop */}
        <div className='hidden md:flex items-center gap-2'>
            <button
              onClick={toggleLanguage}
              className='flex cursor-pointer items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs font-bold text-slate-600 uppercase'
            >
              <LuLanguages className="text-lg" />
              {i18n.language === 'es' ? 'EN' : 'ES'}
            </button>

            <CustomButton route="/contact">
              {t('navbar.btn-contact')}
            </CustomButton>

            {/* 3. Lógica Condicional de Login/Logout Desktop */}
            {isAuthenticated ? (
              <button 
                onClick={logout}
                className="flex items-center gap-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title={t('navbar.logout') || 'Logout'}
              >
                <LuLogOut size={22} />
                <span className="text-xs font-bold uppercase hidden lg:inline">Salir</span>
              </button>
            ) : (
              <Link 
                to="/login" 
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                title="Login"
              >
                <LuUser size={24} />
              </Link>
            )}
        </div>

        {/* Botón Hamburguesa Móvil */}
        <div className='md:hidden flex items-center'>
            {/* Login/Logout rápido en móvil */}
            {isAuthenticated ? (
                <button onClick={logout} className="text-red-500">
                    <LuLogOut size={24} />
                </button>
            ) : (
                <Link to="/login" className="text-slate-600">
                    <LuUser size={24} />
                </Link>
            )}
            <button onClick={toggleMenu} className="text-3xl text-gray-700 focus:outline-none">
                {isOpen ? <LuX /> : <LuMenu />}
            </button>
        </div>

        {/* Menú Desplegable Móvil */}
        <div className={`
            absolute top-full left-0 w-full bg-white border-b border-gray-200 p-6 shadow-xl transition-all duration-300 ease-in-out md:hidden
            ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-5'}
        `}>
            <ul className='flex flex-col gap-5 text-center items-center font-medium'>
                {/* ... (links de navegación iguales) */}
                <li onClick={toggleMenu}><Link to={'/'}>{t('navbar.home')}</Link></li>
                <li onClick={toggleMenu}><Link to={'/services'}>{t('navbar.services')}</Link></li>
                <li onClick={toggleMenu}><Link to={'/about-us'}>{t('navbar.about-us')}</Link></li>
                <li onClick={toggleMenu}><Link to={'/blog'}>{t('navbar.blog')}</Link></li>
                <li onClick={toggleMenu}><Link to={'/contact'}>{t('navbar.contact')}</Link></li>
                
                <div className='flex flex-col gap-3 w-full pt-6 mt-2 border-t border-gray-100'>
                    {/* 4. Login/Logout en Menú Móvil */}
                    {isAuthenticated ? (
                      <button 
                        onClick={() => { logout(); toggleMenu(); }}
                        className="flex justify-center items-center gap-2 py-2 text-red-500 font-bold"
                      >
                        <LuLogOut size={20} /> Cerrar Sesión
                      </button>
                    ) : (
                      <Link 
                        to="/login" 
                        onClick={toggleMenu}
                        className="flex justify-center items-center gap-2 py-2 text-slate-700"
                      >
                        <LuUser size={20} /> Login
                      </Link>
                    )}

                    <CustomButton route="/contact" onClick={toggleMenu}>
                      {t('navbar.btn-contact')}
                    </CustomButton>
                    
                    {/* ... (selector de idioma igual) */}
                </div>
            </ul>
        </div>
    </nav>
  )
}

export default NavBar