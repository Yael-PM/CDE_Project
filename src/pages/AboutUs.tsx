import React from 'react'
import { useTranslation } from 'react-i18next'
import banerBg from '../../public/aboutUsBanerBg.jpg'
import descriptionImg from '../../public/aboutUsDescription.jpg'
import ServiceCard from '../components/ServiceCard'

import { FaFlag } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";

const AboutUs = () => {
  const { t } = useTranslation();

  const banerTitle = t('about-us.baner-title');
  const ourHistorySubtitle = t('about-us.our-history-subtitle');

  const arrBanerTitle = banerTitle.split('|');
  const arrOurHistorySubtitle = ourHistorySubtitle.split('|');

  return (
    <div>
      {/* Banner */}
      <div
        style={{ backgroundImage: `url(${banerBg})` }}
        className="relative w-full aspect-video bg-cover bg-center flex flex-col justify-center items-center md:items-start px-10 mb-10 md:px-20 mx-auto gap-4"
      >
        {/* Overlay de transparencia DENTRO del banner */}
        <div className='absolute inset-0 bg-white/30 z-0'></div>

        {/* Contenido encima del overlay */}
        <p className='relative z-10 text-center text-4xl py-5 mx-auto font-bold'>
          {arrBanerTitle.map((part, i) =>
            i % 2 === 1
              ? <span key={i} className='text-secondary-500'>{part}</span>
              : part
          )}
        </p>
        <p className='relative z-10 text-center py-5 px-30 mx-auto'>
          {t('about-us.baner-description')}
        </p>
      </div>

      {/* Our History */}
      <div className='px-10 mx-auto'>
        <p className="font-bold text-tertiary-500">{t('about-us.our-history-title')}</p>
        <p className="text-2xl font-bold pr-10 mb-4">
          {arrOurHistorySubtitle.map((part, i) =>
            i % 2 === 1
              ? <span key={i} className='text-tertiary-500'>{part}</span>
              : part
          )}
        </p>
      </div>

      <div className='px-10 mt-5 gap-4 grid grid-cols-1 md:grid-cols-2 max-w-7xl items-center md:items-start'>
        <p className='justify-center md:justify-start p-1'>{t('about-us.our-history-description')}</p>
        <div>
          <img src={descriptionImg} alt="Trabajadores" />
        </div>
      </div>

      {/* Filosofia corporativa */}
      <div className='bg-black/10 mt-10'>
        <div className='p-10'>
          <p className='text-center font-bold text-4xl py-1.5'>
            {t('about-us.corporate-values-title')}
          </p>
          <p className='text-center py-1.5'>
            {t('about-us.corporate-values-description')}
          </p>
          <ul className='p-5 flex gap-2 [&>li]:mx-5 [&>li]:cursor-pointer items-center'>
            <li>
              <ServiceCard
                title={t('about-us.component-mision-title')}
                description={t('about-us.component-mision-description')}
                color='tertiary'
                type='none'
                icon={<FaFlag />}
              />
            </li>
            <li>
              <ServiceCard
                title={ t('about-us.component-vision-title')}
                description= { t('about-us.component-vision-description')}
                color='primary'
                type='none'
                icon={<FaEye />}
              />
            </li>
          </ul>

          <ServiceCard
            title= { t('about-us.call-to-action-title')}
            description= { t('about-us.call-to-action-description')}
            color='tertiary'
            type='link'
            icon
          />

        </div>
      </div>

    </div>
  )
}

export default AboutUs