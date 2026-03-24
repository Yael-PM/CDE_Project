import React from 'react'
import ServiceCard from '../components/ServiceCard'

import { useTranslation } from 'react-i18next'

import { LuShieldCheck } from "react-icons/lu";
import { PiGavelBold } from "react-icons/pi";
import { FaGraduationCap } from "react-icons/fa";

const LandingPage = () => {
  const { t } = useTranslation();

  return (
    <div>
        <h1> Landing Page</h1>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 px-5 max-w-7xl mx-auto'>
          <ServiceCard 
            title={t('landing-page.service-component1-title')}
            description={t('landing-page.service-component1-description')}
            color="tertiary" 
            type="link"
            icon={<LuShieldCheck />} 
          />

          <ServiceCard 
            title={t('landing-page.service-component2-title')}
            description={t('landing-page.service-component2-description')}
            color="secondary" 
            type="link"
            icon={<PiGavelBold />} 
          />

          <ServiceCard 
            title={t('landing-page.service-component3-title')}
            description={t('landing-page.service-component3-description')}
            color="primary" 
            type="link"
            icon={<FaGraduationCap />} 
          />
        </div>
    </div>
  )
}

export default LandingPage