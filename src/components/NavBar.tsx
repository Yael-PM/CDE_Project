import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Logo from '/CDE Simple Logo.png'
import CustomButton from './CustomButton'

const NavBar = () => {
  const { t, i18n } = useTranslation();

  // Función para alternar entre 'es' y 'en'
  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <div className='flex justify-between items-center p-5 border-b border-gray-200'>
        <div className='w-25 '>
          <img src={Logo} alt="CDE Logo" />
        </div>
        
        <div>
            <ul className='flex gap-6 [&>li]:cursor-pointer [&>li]:hover:scale-105 [&>li]:hover:underline [&>li]:hover:text-tertiary-500  items-center'>
                <li><Link to={'/'}>{t('navbar.home')}</Link></li>
                <li><Link to={'/services'}>{t('navbar.services')}</Link></li>
                <li>{t('navbar.about-us')}</li>
                <li>{t('navbar.blog')}</li>
                <li><Link to={'/contact'}>{t('navbar.contact')}</Link></li>
            </ul>
        </div>

        <div className='flex'>
            <CustomButton
              route="/contact"
            >
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
    </div>
  )
}

export default NavBar