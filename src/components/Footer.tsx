import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

import Logo from '../../public/CDE Grupo Legislación.png'

const Footer = () => {

    const { t} = useTranslation();

  return (
    <footer className='bg-fourth-500 text-neutral-50 mt-10'>
        <div className='max-w-7xl px-10 py-6 mx-auto gap-16 grid grid-cols-4'>

            <div className='flex flex-col'>
                <div>
                    <img src={Logo} alt='CDE Logo Legislacion' className='h-[132px] w-auto object-contain'/>
                </div>
                <p className='py-1'>{t('footer.banner-text')}</p>
            </div>

            <div className='flex flex-col'>
                <p className='py-1 text-2xl text-tertiary-400 font-bold text-footer-widgets'> {t('footer.enterprise')} </p>
                <p className='hover:text-fourth-200 py-1'><Link to={'/about-us'}>{t('footer.about-us')}</Link></p>
                {}
                <p className='hover:text-fourth-200 py-1'><Link to={'/'}>{t('footer.services')}</Link></p>
            </div>

            <div className='flex flex-col'>
                <p className='py-1 text-2xl text-tertiary-400 font-bold text-footer-widgets'> {t('footer.services')} </p>
                <p className='hover:text-fourth-200 py-1'>{t('footer.regulatory-affairs')}</p>
                <p className='hover:text-fourth-200 py-1'>{t('footer.sanitary-legislation')}</p>
                <p className='hover:text-fourth-200 py-1'> {t('footer.auditories')} </p>
                <p className='hover:text-fourth-200 py-1'> {t('footer.capacitacion')} </p>
            </div>

            <div className='flex flex-col'>
                <p className='py-1 text-2xl text-tertiary-400 font-bold text-footer-widgets'> {t('footer.contact')} </p>
                <p className='flex gap-2'> <FaPhone className='my-1 text-tertiary-400' /> {t('footer.number')} </p>
                <p className='flex gap-2'> <MdEmail className='my-1 text-tertiary-400' /> {t('footer.email')}</p>
            </div>

        </div>

        <div className='max-w-7xl mx-auto p-2 flex justify-between text-dark-100 border-t border-t-[1px] border-t-dark-100'>
            <p className='inline-block'> {t('footer.rights')} </p>
            <p className='justify-self-end'> {t('footer.privacy')} </p>
            <p className='justify-self-end'> {t('footer.terms')} </p>
        </div>
    </footer>
  )
}

export default Footer