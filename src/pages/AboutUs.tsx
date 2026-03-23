import React from 'react'
import { useTranslation } from 'react-i18next'

import ServiceCard from '../components/ServiceCard'

const AboutUs = () => {

  const { t } = useTranslation();

  return (
    <div className='gap-4 max-w-7xl px-8 mx-auto my-5 items-center md:items-start'>
      <p className='text-center py-5 mx-auto font-bold'> {t('about-us.baner-title')} </p>
      <p className='text-center py-5 px-30 mx-auto'> {t('about-us.baner-description')} </p>

      <p className=" font-bold text-tertiary-500"> {t('about-us.our-history-title')} </p>
      <p className="text-2xl font-bold text-tertiary-500 flex flex-w-2xl"> {t('about-us.our-history-subtitle')} </p>

        <div className='gap-4 grid grid-cols-1 md:grid-cols-2 max-w-7xl items-center md:items-start'>
            <p className='justify-center md:justify-start p-1'> {t('about-us.our-history-description')} </p>
            <div>
              <img alt="Trabajadores"></img>
            </div>
        </div>
    </div>

  )
}

export default AboutUs