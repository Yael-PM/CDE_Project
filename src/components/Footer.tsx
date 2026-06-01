import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import Logo from '/CDE Grupo Legislación.png'

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className='bg-fourth-500 text-neutral-50'>
      <div className='max-w-7xl px-6 md:px-10 py-10 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10'>

        {/* Logo + descripción */}
        <div className='flex flex-col items-center sm:items-start'>
          <img src={Logo} alt='CDE Logo Legislacion' className='h-[110px] w-auto object-contain mb-3'/>
          <p className='text-sm text-center sm:text-left'>{t('footer.banner-text')}</p>
        </div>

        {/* Empresa */}
        <div className='flex flex-col'>
          <p className='py-1 text-xl text-tertiary-400 font-bold mb-2'>{t('footer.enterprise')}</p>
          <p className='hover:text-fourth-200 py-1 text-sm'><Link to='/about-us'>{t('footer.about-us')}</Link></p>
          <p className='hover:text-fourth-200 py-1 text-sm'><Link to='/services'>{t('footer.services')}</Link></p>
        </div>

        {/* Servicios */}
        <div className='flex flex-col'>
          <p className='py-1 text-xl text-tertiary-400 font-bold mb-2'>{t('footer.services')}</p>
          <p className='hover:text-fourth-200 py-1 text-sm'><Link to='/services'>{t('footer.regulatory-affairs')}</Link></p>
          <p className='hover:text-fourth-200 py-1 text-sm'><Link to='/services'>{t('footer.sanitary-legislation')}</Link></p>
          <p className='hover:text-fourth-200 py-1 text-sm'><Link to='/services'>{t('footer.auditories')}</Link></p>
          <p className='hover:text-fourth-200 py-1 text-sm'><Link to='/services'>{t('footer.capacitacion')}</Link></p>
        </div>

        {/* Contacto */}
        <div className='flex flex-col'>
          <p className='py-1 text-xl text-tertiary-400 font-bold mb-2'>{t('footer.contact')}</p>
          <p className='flex items-center gap-2 py-1 text-sm'>
            <FaPhone className='text-tertiary-400 shrink-0' />
            {t('footer.number')}
          </p>
          <p className='flex items-center gap-2 py-1 text-sm'>
            <MdEmail className='text-tertiary-400 shrink-0' />
            {t('footer.email')}
          </p>
        </div>

      </div>

      {/* Bottom bar */}
      <div className='max-w-7xl mx-auto px-6 md:px-10 py-3 flex flex-col sm:flex-row sm:justify-between items-center gap-2 text-xs text-dark-100 border-t border-dark-100'>
        <p>{t('footer.rights')}</p>
        <div className='flex gap-4'>
          <p className='hover:text-neutral-300 cursor-pointer'><Link to='/privacy-notice'>{t('footer.privacy')}</Link></p>
          <p className='hover:text-neutral-300 cursor-pointer'><Link to='/terms-and-conditions'>{t('footer.terms')}</Link></p>
        </div>
      </div>
    </footer>
  )
}

export default Footer