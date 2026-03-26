import React from 'react'
import { useTranslation } from 'react-i18next'
import banerBg from '../../public/aboutUsBanerBg.jpg'
import descriptionImg from '../../public/aboutUsDescription.jpg'

import ServiceCard from '../components/ServiceCard'

const AboutUs = () => {

  const { t } = useTranslation();

  //Se obtienen los textos y se separan para poder cambiar el color de solo unas partes
  const banerTitle = t('about-us.baner-title');
  const ourHistorySubtitle = t('about-us.our-history-subtitle');

  //split
  const arrBanerTitle = banerTitle.split('|');
  const arrOurHistorySubtitle = ourHistorySubtitle.split('|');

  return (
    //Baner Title
    <div style={{backgroundImage : `url(${banerBg})`}}>
      <div className='gap-4 max-w-7xl px-8 mx-auto my-5 items-center md:items-start '>

        <p className='text-center text-4xl py-5 mx-auto font-bold'>
          {arrBanerTitle.map((part,i) =>
            i % 2 === 1 ?
            (<span key={i} className='text-secondary-500'>{part}</span>)
            :(part)
          )}
        </p>
        <p className='text-center py-5 px-30 mx-auto'> {t('about-us.baner-description')} </p>

        <p className=" font-bold text-tertiary-500"> {t('about-us.our-history-title')} </p>
        <p className="text-2xl font-bold pr-10 mb-4">
          {arrOurHistorySubtitle.map((part,i) =>
            i % 2 === 1 ?
            (<span key={i} className='text-tertiary-500'> {part}</span>)
            :(part)
          )}
        </p>
      </div>

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