import { useTranslation } from 'react-i18next'
import banerBg from '/aboutUsBanerBg.jpg'
import descriptionImg from '/aboutUsDescription.jpg'
import ServiceCard from '../components/ServiceCard'
import SEO from '../components/SEO'
import { FaFlag } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";

const AboutUs = () => {
  const { t } = useTranslation();
  const banerTitle = t('about-us.baner-title');
  const ourHistorySubtitle = t('about-us.our-history-subtitle');
  const arrBanerTitle = banerTitle.split('|');
  const arrOurHistorySubtitle = ourHistorySubtitle.split('|');

  return (
    <div className="w-full overflow-hidden">
      <SEO 
        title="Nosotros - CDE" 
        description="Conoce la historia, misión y visión de CDE. Descubre cómo transformamos el desarrollo de software con innovación y compromiso." 
      />
      {/* Banner */}
      <section
        style={{ backgroundImage: `url(${banerBg})` }}
        className="relative w-full h-[60vh] md:h-screen bg-cover bg-center flex flex-col justify-center items-center px-6 md:px-20"
      >
        {/* Overlay — z-0, DEBAJO del contenido */}
        <div className="absolute inset-0 bg-white/60 md:bg-linear-to-b md:from-white/80 md:to-white/40 z-0" />

        {/* Contenido — z-10, ENCIMA del overlay */}
        <div className="relative z-10 max-w-3xl text-center flex flex-col items-center">

          {/* Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-b from-[#fdeeee] to-[#f9dada] px-4 py-1.5 rounded-full w-fit mb-6 border border-red-400/50 shadow-[2px_2px_5px_rgba(0,0,0,0.3)]">
            <span className="w-2.5 h-2.5 bg-[#d32f2f] rounded-full"></span>
            <span className="text-xs font-[800] text-black uppercase tracking-wider">
              {t('about-us.flotant-text')}
            </span>
          </div>

          <p className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            {arrBanerTitle.map((part, i) =>
              i % 2 === 1
                ? <span key={i} className="text-secondary-500">{part}</span>
                : part
            )}
          </p>
          <p className="text-base md:text-lg text-slate-600 max-w-xl mx-auto">
            {t('about-us.baner-description')}
          </p>
        </div>
      </section>

      {/* Our History */}
      <section className="py-16 px-6 md:px-20 max-w-7xl mx-auto">
        <p className="font-bold text-tertiary-500 uppercase tracking-widest text-sm mb-2">
          {t('about-us.our-history-title')}
        </p>
        <h2 className="text-2xl md:text-4xl font-bold mb-8">
          {arrOurHistorySubtitle.map((part, i) =>
            i % 2 === 1
              ? <span key={i} className="text-tertiary-500">{part}</span>
              : part
          )}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <p className="text-slate-600 text-lg leading-relaxed">
            {t('about-us.our-history-description')}
          </p>
          <div>
            <img
              src={descriptionImg}
              alt="Trabajadores"
              className="rounded-2xl shadow-2xl border-4 border-blue-400/20 w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Filosofía corporativa */}
      <section className="py-16 px-6 md:px-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('about-us.corporate-values-title')}
          </h2>
          <p className="text-center text-slate-600 text-lg mb-10 max-w-2xl mx-auto">
            {t('about-us.corporate-values-description')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <ServiceCard
              title={t('about-us.component-mision-title')}
              description={t('about-us.component-mision-description')}
              color="tertiary"
              type="none"
              icon={<FaFlag />}
            />
            <ServiceCard
              title={t('about-us.component-vision-title')}
              description={t('about-us.component-vision-description')}
              color="primary"
              type="none"
              icon={<FaEye />}
            />
          </div>
          <ServiceCard
            title={t('about-us.call-to-action-title')}
            description={t('about-us.call-to-action-description')}
            color="tertiary"
            type="link"
            icon
          />
        </div>
      </section>

    </div>
  )
}

export default AboutUs