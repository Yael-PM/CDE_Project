import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NavBar = () => {
  const { t, i18n } = useTranslation();

  // Función para alternar entre 'es' y 'en'
  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <div className='flex justify-between items-center p-5'>
        <div className='text-4xl font-semibold cursor-pointer mx-5'>CDE</div>
        
        <div>
            <ul className='flex gap-4 [&>li]:cursor-pointer [&>li]:hover:scale-105 items-center'>
                <li><Link to={'/'}>{t('navbar.home')}</Link></li>
                <li><Link to={'/services'}>{t('navbar.services')}</Link></li>
                <li>{t('navbar.about-us')}</li>
                <li>{t('navbar.blog')}</li>
                <li><Link to={'/contact'}>{t('navbar.contact')}</Link></li>
            </ul>
        </div>

        <div className=''>
            <button className='mx-5 bg-pollito-600 p-2 rounded-2xl text-white cursor-pointer'>
              {t('navbar.btn-contact')}
            </button>
            <button 
                onClick={toggleLanguage}
                className='px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors uppercase text-sm font-bold'
            >
                {i18n.language === 'es' ? '🇬🇧 EN' : '🇪🇸 ES'}
            </button>
        </div>
    </div>
  )
}

export default NavBar