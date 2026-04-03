
import { useTranslation, Trans } from 'react-i18next';
import { LuShieldCheck, LuGavel, LuFileCheck, LuGraduationCap, LuSearch } from "react-icons/lu";
import { HiOutlineDocumentText } from "react-icons/hi";

import CustomButton from '../components/CustomButton';
import ServiceCard from '../components/ServiceCard';

import banner from '../assets/landing-banner.jpg';
import experienceImg from '../assets/landing-image.jpg';

const Services = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full overflow-hidden">
      {/* 1. SECCIÓN HERO (Igual que antes, ajustado) */}
      <section className='relative h-[80vh] md:h-screen w-full flex flex-col justify-center items-center px-6 text-center'>
        <div className='absolute inset-0 -z-10'>
          <img src={banner} alt="banner" className='h-full w-full object-cover'/>
          <div className="absolute inset-0 bg-white/60 md:bg-linear-to-r md:from-white/95 md:to-transparent"></div>
        </div>

        <div className='max-w-3xl flex flex-col items-center'>
          <div className="flex items-center gap-2 bg-blue-50 text-tertiary-500 px-3 py-1 rounded-full w-fit mb-6 border border-blue-100 shadow-sm">
            <span className="w-2 h-2 bg-tertiary-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest">{t('services.flotant-text')}</span>
          </div>

          <h1 className='text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.1]'>
            <Trans i18nKey="services.title" components={{ span: <span className="text-tertiary-500" /> }} />
          </h1>
          
          <p className='mt-6 text-lg text-slate-600 max-w-xl leading-relaxed'>
            {t('services.description')}
          </p>

          <div className='mt-10'>
             <CustomButton variant="primary" className="!mx-0 px-10 py-4 shadow-xl">
                {t('services.btn-about')}
             </CustomButton>
          </div>
        </div>
      </section>

      {/* 2. SERVICIOS */}
      <section className="py-16 px-6 max-w-7xl mx-auto">

        {/* Título de Sección */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{t('services.our-services')}</h2>
          <p className="text-slate-500 text-lg leading-relaxed">{t('services.our-services-description')}</p>
        </div>

        {/* Grid de Servicios */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          <ServiceCard title={t('services.component-service-1-title')} description={t('services.component-service-1-description')} color="tertiary" type="button" icon={<HiOutlineDocumentText className="text-2xl" />}/>
          <ServiceCard title={t('services.component-service-2-title')} description={t('services.component-service-2-description')} color="secondary" type="button" icon={<LuGavel className="text-2xl" />}/>
          <ServiceCard title={t('services.component-service-3-title')} description={t('services.component-service-3-description')} color="primary" type="button" icon={<LuShieldCheck className="text-2xl" />}/>
          <ServiceCard title={t('services.component-service-4-title')} description={t('services.component-service-4-description')} color="primary" type="button" icon={<LuFileCheck className="text-2xl" />}/>
          <ServiceCard title={t('services.component-service-5-title')} description={t('services.component-service-5-description')} color="secondary" type="button" icon={<LuGraduationCap className="text-2xl" />}/>
          <ServiceCard title={t('services.component-service-6-title')} description={t('services.component-service-6-description')} color="tertiary" type="button" icon={<LuSearch className="text-2xl" />}/>
          <ServiceCard title={t('services.component-service-7-title')} description={t('services.component-service-7-description')} color="tertiary" type="button" icon={<LuFileCheck className="text-2xl" />}/>
        </div>
      </section>

      {/* 3. SECCIÓN RESULTADOS (Imagen lateral) */}
      <section className='py-20 px-6 max-w-7xl mx-auto'>
        <div className='flex flex-col md:flex-row items-center gap-16'>
          <div className='w-full md:w-1/2'>
            <h2 className='text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight'>
              <Trans i18nKey="services.result-title" components={{ span: <span className="text-tertiary-500" /> }} />
            </h2>
            <p className='text-slate-600 text-xl leading-relaxed'>
              {t('services.result-description')}
            </p>
          </div>
          
          <div className='w-full md:w-1/2 relative'>
            <img src={experienceImg} alt="results" className='rounded-xl shadow-2xl object-cover w-full h-[400px]' />
            {/* Overlay de Garantía que aparece en la imagen */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 p-4 rounded-lg shadow-xl flex items-center gap-4 border-l-4 border-tertiary-500">
              <div className="bg-blue-100 p-2 rounded-full text-tertiary-500">
                <LuShieldCheck size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Garantía de Cumplimiento</p>
                <p className="text-xs text-slate-500">Nos aseguramos de que cada trámite cumpla con el 100% de los requisitos vigentes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA FINAL (Azul) */}
      <section className='bg-tertiary-500 py-24 px-6 text-center text-white'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-4xl md:text-6xl font-bold mb-8'>{t('services.call-to-action-title')}</h2>
          <p className='text-xl opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed'>
            {t('services.call-to-action-description')}
          </p>
          <CustomButton 
            variant="none" 
            className="bg-white text-tertiary-500 hover:bg-slate-50 px-14 py-4 text-xl font-extrabold shadow-2xl transition-all rounded-xl !mx-0"
          >
            {t('services.btn-contact')}
          </CustomButton>
        </div>
      </section>
    </div>
  );
};

export default Services;