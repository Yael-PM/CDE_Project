import ServiceCard from '../components/ServiceCard'
import CustomButton from '../components/CustomButton';
import SEO from '../components/SEO';
import { useTranslation, Trans } from 'react-i18next'

import { LuShieldCheck } from "react-icons/lu";
import { PiGavelBold } from "react-icons/pi";
import { FaGraduationCap, FaCheckCircle } from "react-icons/fa";
import { TiFlashOutline } from "react-icons/ti";
import { IoDiamondOutline } from "react-icons/io5";

import banner from '../assets/landing-banner.jpg'
import image from '../assets/landing-image.jpg'

const LandingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full overflow-hidden">
      <SEO 
        title="Inicio - CDE" 
        description="Bienvenido a CDE, tu aliado en defensa legal. Ofrecemos servicios de alta calidad para proteger tus derechos y garantizar justicia. Descubre cómo podemos ayudarte hoy mismo." 
      />
      {/* 1. SECCIÓN HERO */}
      <section className='relative h-[90vh] md:h-screen w-full flex flex-col justify-center items-start px-6 md:px-20'>
        <div className='absolute inset-0 -z-10'>
          <img src={banner} alt="banner" className='h-full w-full object-cover'/>
          <div className="absolute inset-0 bg-white/60 md:bg-linear-to-r md:from-white/95 md:to-transparent"></div>
        </div>

        <div className='max-w-3xl'>
          <div className="flex items-center gap-2 bg-blue-50 text-tertiary-500 px-3 py-1 rounded-full w-fit mb-6 border border-blue-100 shadow-sm">
            <span className="w-2 h-2 bg-tertiary-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest">{t('landing-page.flotant-text')}</span>
          </div>

          <h1 className='text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.1]'>
            <Trans i18nKey="landing-page.banner-title" components={{ span: <span className="text-tertiary-500" /> }} />
          </h1>
          
          <p className='mt-6 text-lg text-slate-600 max-w-xl'>{t('landing-page.banner-description')}</p>

          <div className='mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto'>
            <CustomButton 
              variant="warning" 
              className="!mx-0 w-full sm:w-auto px-8 py-3 shadow-lg justify-center flex items-center"
            >
              {t('landing-page.btn-services')} →
            </CustomButton>
            
            <CustomButton 
              variant="none" 
              className="mx-0 w-full sm:w-auto border-2 border-slate-800 text-slate-800 px-8 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all justify-center flex items-center"
            >
              {t('landing-page.btn-contact')}
            </CustomButton>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN SOLUCIONES (SERVICIOS) */}
      <section className='py-20 px-6 bg-white'>
        <div className='max-w-4xl mx-auto text-center mb-12'>
          <h3 className='font-bold text-red-500 uppercase tracking-widest text-sm mb-3'>{t('landing-page.our-services')}</h3>
          <h2 className='font-bold text-4xl md:text-5xl text-slate-900 mb-6'>{t('landing-page.services-title')}</h2>
          <p className='text-slate-600 text-lg leading-relaxed'>{t('landing-page.services-description')}</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto'>
          <ServiceCard title={t('landing-page.service-component1-title')} description={t('landing-page.service-component1-description')} color="tertiary" type="link" icon={<LuShieldCheck />} />
          <ServiceCard title={t('landing-page.service-component2-title')} description={t('landing-page.service-component2-description')} color="secondary" type="link" icon={<PiGavelBold />} />
          <ServiceCard title={t('landing-page.service-component3-title')} description={t('landing-page.service-component3-description')} color="primary" type="link" icon={<FaGraduationCap />} />
        </div>
      </section>

      {/* 3. SECCIÓN EXPERIENCIA (POR QUÉ ELEGIRNOS) */}
      <section className='py-20 px-6 max-w-7xl mx-auto'>
        <div className='flex flex-col md:flex-row items-center gap-12'>
          <div className='w-full md:w-1/2'>
            <div className="relative">
              <img src={image} alt="experience" className='rounded-2xl shadow-2xl border-4 border-blue-400/20' />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full -z-10 animate-blob"></div>
            </div>
          </div>
          
          <div className='w-full md:w-1/2'>
            <h2 className='text-4xl md:text-5xl font-bold text-slate-900 mb-6'>{t('landing-page.experience-title')}</h2>
            <p className='text-slate-600 text-lg mb-8'>{t('landing-page.experience-description')}</p>

            <div className='space-y-6'>
              {[1, 2, 3].map((i) => (
                <div key={i} className='flex gap-4'>
                  <div className='mt-1 bg-blue-100 p-2 rounded-full h-fit text-tertiary-400'>
                    <FaCheckCircle size={20} />
                  </div>
                  <div>
                    <h4 className='font-bold text-slate-900 text-xl'>{t(`landing-page.title-point${i}`)}</h4>
                    <p className='text-slate-500'>{t(`landing-page.description-point${i}`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN VALORES */}
      <section className='py-20 px-6 bg-slate-50 border-y border-slate-100'>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
              <h3 className='font-bold text-red-500 uppercase tracking-widest text-sm mb-2'>{t('landing-page.values-title')}</h3>
              <h2 className='font-bold text-4xl text-slate-900'>{t('landing-page.values-subtitle')}</h2>
            </div>
            <p className='max-w-md text-lg'>
              {t('landing-page.values-description')}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <ServiceCard title={t('landing-page.value-component1-title')} description={t('landing-page.value-component1-description')} color="tertiary" type="none" icon={<PiGavelBold size={40} />} />
            <ServiceCard title={t('landing-page.value-component2-title')} description={t('landing-page.value-component2-description')} color="tertiary" type="none" icon={<TiFlashOutline size={40} />} />
            <ServiceCard title={t('landing-page.value-component3-title')} description={t('landing-page.value-component3-description')} color="tertiary" type="none" icon={<IoDiamondOutline size={40} />} />
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN CTA FINAL */}
      <section className='bg-secondary-500 py-20 px-6 text-center text-white'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-4xl md:text-6xl font-bold mb-6'>{t('landing-page.call-to-action-title')}</h2>
          <p className='text-xl opacity-90 mb-10 max-w-2xl mx-auto'>{t('landing-page.call-to-action-description')}</p>
          <CustomButton variant="none" className="bg-white text-secondary-500 hover:bg-slate-100 px-12 py-4 text-xl font-bold shadow-xl transition-all rounded-lg">
            {t('landing-page.btn-contact')}
          </CustomButton>
        </div>
      </section>
    </div>
  )
}

export default LandingPage;