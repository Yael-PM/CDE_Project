import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LuMenu, LuX, LuUser, LuLanguages, LuLogOut } from "react-icons/lu"; 

import { useAuth } from '../hooks/useAuth'
import Logo from '/CDE Simple Logo.png'
import CustomButton from './CustomButton'

const NavBar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
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
                {isAuthenticated ? (
                  <>
                    {/* Vistas solo para usuarios logueados */}
                    <li><Link to={'/create-note'}>Crear Nota</Link></li>
                    <li><Link to={'/manage-notes'}>Gestionar Notas</Link></li>
                    <li><Link to={'/blog'}>{t('navbar.blog')}</Link></li>
                  </>
                ) : (
                  <>
                    {/* Vistas públicas originales */}
                    <li><Link to={'/'}>{t('navbar.home')}</Link></li>
                    <li><Link to={'/services'}>{t('navbar.services')}</Link></li>
                    <li><Link to={'/about-us'}>{t('navbar.about-us')}</Link></li>
                    <li><Link to={'/blog'}>{t('navbar.blog')}</Link></li>
                    <li><Link to={'/contact'}>{t('navbar.contact')}</Link></li>
                  </>
                )}
            </ul>
        </div>

        {/* Acciones Desktop */}
        <div className='hidden md:flex items-center gap-2'>
            {isAuthenticated ? (
              // Si está logueado, SOLO se muestra el botón de salir
              <button 
                onClick={logout}
                className="flex items-center gap-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title={t('navbar.logout') || 'Logout'}
              >
                <LuLogOut size={22} />
                <span className="text-xs font-bold uppercase hidden lg:inline">Salir</span>
              </button>
            ) : (
              // Si no está logueado, se muestran las acciones por defecto
              <>
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

                <Link 
                  to="/login" 
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                  title="Login"
                >
                  <LuUser size={24} />
                </Link>
              </>
            )}
        </div>

        {/* Botón Hamburguesa Móvil */}
        <div className='md:hidden flex items-center gap-4'>
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
                {isAuthenticated ? (
                  <>
                    {/* Enlaces Móvil Logueado */}
                    <li onClick={toggleMenu}><Link to={'/create-note'}>Crear Nota</Link></li>
                    <li onClick={toggleMenu}><Link to={'/manage-notes'}>Gestionar Notas</Link></li>
                    <li onClick={toggleMenu}><Link to={'/blog'}>{t('navbar.blog')}</Link></li>
                    
                    <div className='flex flex-col gap-3 w-full pt-6 mt-2 border-t border-gray-100'>
                      <button 
                        onClick={() => { logout(); toggleMenu(); }}
                        className="flex justify-center items-center gap-2 py-2 text-red-500 font-bold"
                      >
                        <LuLogOut size={20} /> Cerrar Sesión
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Enlaces Móvil Público */}
                    <li onClick={toggleMenu}><Link to={'/'}>{t('navbar.home')}</Link></li>
                    <li onClick={toggleMenu}><Link to={'/services'}>{t('navbar.services')}</Link></li>
                    <li onClick={toggleMenu}><Link to={'/about-us'}>{t('navbar.about-us')}</Link></li>
                    <li onClick={toggleMenu}><Link to={'/blog'}>{t('navbar.blog')}</Link></li>
                    <li onClick={toggleMenu}><Link to={'/contact'}>{t('navbar.contact')}</Link></li>
                    
                    <div className='flex flex-col gap-3 w-full pt-6 mt-2 border-t border-gray-100'>
                      <Link 
                        to="/login" 
                        onClick={toggleMenu}
                        className="flex justify-center items-center gap-2 py-2 text-slate-700"
                      >
                        <LuUser size={20} /> Login
                      </Link>

                      <CustomButton route="/contact" onClick={toggleMenu}>
                        {t('navbar.btn-contact')}
                      </CustomButton>
                    </div>
                  </>
                )}
            </ul>
        </div>
    </nav>
  )
}

export default NavBar