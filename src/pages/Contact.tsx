import { useTranslation } from "react-i18next"
import { Link } from 'react-router-dom'

import CustomButton from "../components/CustomButton";

import { FaPhoneSquareAlt } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { RiShieldCheckLine } from "react-icons/ri";

const Contact = () => {
  const { t } = useTranslation();

  const contactFormPrivacy = t('contact.form-privacy');
  const arrFormPrivacy = contactFormPrivacy.split('|');

  const contactPrivacyDescription = t('contact.component-privacy-description');
  const arrPrivacyDescription = contactPrivacyDescription.split('|');

  return (
    // min-h-screen aquí asegura que el fondo cubra todo y el footer baje
    <main className="bg-neutral-200 min-h-screen flex flex-col">

      {/* Hero Section */}
      <section className='px-4 md:px-10 py-10'>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-4">
          {t('contact.title')}
        </h1>
        <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
          {t('contact.description')}
        </p>
      </section>

      {/* Main Content: Grid */}
      {/* Eliminamos min-h-screen de aquí. Usamos flex-grow para que ocupe el espacio restante */}
      <section className='flex-grow px-4 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 pb-20 items-start'>

        {/* Columna de Cards */}
        <div className="space-y-6">
          {/* card  */}
          <div className="flex flex-col h-full border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all bg-white items-start">
            <h3 className="text-2xl font-bold mb-3 text-gray-900 leading-tight">
              {t('contact.component-contact-title')}
            </h3>

            {/* contact call container */}
            <div className="flex items-start gap-4">
              {/* Contenedor del Icono */}
              <div className="w-14 h-14 flex items-center justify-center rounded-xl mb-6">
                <FaPhoneSquareAlt className="text-5xl text-tertiary-500"/>
              </div>
              {/* Contenedor texto */}
              <div>
                {/* Texto - Alineación natural a la izquierda */}
                <p className="font-semibold leading-relaxed text-left">
                  {t('contact.component-contact-call')}
                </p>
                <p className="text-gray-500 leading-relaxed mb-1 text-left">
                  +52 (55) 1234-5678
                </p>
                <p className="text-secondary-500">
                  {t('contact.component-contact-call-prioritary')}
                </p>
              </div>
            </div>

            {/* Contact email container */}
            <div className="mt-5 flex items-start gap-4">
              {/* Contenedor del Icono */}
              <div className="w-14 h-14 flex items-center justify-center rounded-xl mb-6">
                <MdEmail className="text-5xl text-tertiary-500"/>
              </div>
              {/* Contenedor texto */}
              <div>
                {/* Texto - Alineación natural a la izquierda */}
                <p className="font-semibold leading-relaxed text-left">
                  {t('contact.component-contact-email')}
                </p>
                <p className="text-gray-500 leading-relaxed mb-1 text-left">
                  contacto@cdeconsultores.com
                </p>
              </div>
            </div>

            {/* Espaciador */}
            <div className="grow"></div>
          </div>

          {/* card */}
          <div className="flex flex-col h-full border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all bg-fourth-500 items-start">
            {/* Contenedor del Icono */}
            <div className="w-14 h-14 flex items-center justify-center rounded-xl mb-6">
              <RiShieldCheckLine className="text-5xl text-primary-500"/>
            </div>
            
            <h3 className="text-2xl font-bold mb-3 text-white leading-tight">
              {t('contact.component-privacy-title')}
            </h3>
            <p className="leading-relaxed mb-1 text-left">
              {arrPrivacyDescription.map((part,i) =>
              i % 2 === 1
                ? <span key={i} className="text-primary-500 font-semibold">{part}</span>
                : <span key={i} className="text-gray-500 font-medium">{part}</span>
              )}
            </p>
            {/* Espaciador */}
            <div className="grow"></div>
          </div>
        </div>

        {/* Columna de Formulario */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border bg-neutral-200 border-neutral-300">
          <form className="space-y-4">
            <fieldset>
              <legend className="text-xl font-bold mb-6">{t('contact.form-title')}</legend>

              {/* Contenedor datos de contacto - 4 input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Nombre*/}
                <div className="flex flex-col">
                  <label className="text-sm font-bold mb-1.5 after:content-['*'] after:ml-0.5 after:text-red-500" htmlFor='name'>{t('contact.form-name')}</label>
                  <input className="w-full px-4 py-3 rounded-xl border bg-neutral-200 border-neutral-300 focus:border-blue-500 outline-none transition-all" type="text" id="name" placeholder={t('contact.form-name-placeholder')} required />
                </div>

                {/* Empresa */}
                <div className="flex flex-col">
                  <label className="text-sm font-bold mb-1.5 after:content-['*'] after:ml-0.5 after:text-red-500" htmlFor='company'>{t('contact.form-company')}</label>
                  <input className="w-full px-4 py-3 rounded-xl border bg-neutral-200 border-neutral-300 focus:border-blue-500 outline-none transition-all" type="text" id="company" name="company" placeholder={t('contact.form-email-placeholder')} required />
                </div>

                {/* Correo */}
                <div className="flex flex-col">
                  <label className="text-sm font-bold mb-1.5 after:content-['*'] after:ml-0.5 after:text-red-500" htmlFor='email'>{t('contact.form-email')}</label>
                  <input className="w-full px-4 py-3 rounded-xl border bg-neutral-200 border-neutral-300 focus:border-blue-500 outline-none transition-all" type="email" id="email" name="email" placeholder={t('contact.form-email-placeholder')} required />
                </div>

                {/* Telefono */}
                <div className="flex flex-col">
                  <label className="text-sm font-bold mb-1.5" htmlFor='phone'>{t('contact.form-phone')}</label>
                  <input className="w-full px-4 py-3 rounded-xl border bg-neutral-200 border-neutral-300 focus:border-blue-500 outline-none transition-all" type="tel" id="phone" name="phone" placeholder={t('contact.form-email-placeholder')} />
                </div>
              </div>
              
              {/* Position */}
              <div className="flex flex-col justify-center">
                  <label className="flex justify-center mt-5 text-sm font-bold mb-1.5 after:content-['*'] after:ml-0.5 after:text-red-500" htmlFor='position'>{t('contact.form-position')}</label>
                  <input className="mx-15 px-4 py-3 rounded-xl border bg-neutral-200 border-neutral-300 focus:border-blue-500 outline-none transition-all" type="tex" id="position" name="position" placeholder={t('contact.form-position-placeholder')} />
              </div>

              {/* Campos de ancho completo */}
              <div className="flex flex-col mt-4">
                <label className="text-sm font-bold mb-1.5 after:content-['*'] after:ml-0.5 after:text-red-500" htmlFor="affair">{t('contact.form-affair')}</label>
                <select className="w-full px-4 py-3 rounded-xl border bg-neutral-200 border-neutral-300 focus:border-blue-500 outline-none transition-all resize-none" id="affair" name="affair" required>
                  <option value=''> {t('contact.form-affair-option-default')} </option>
                  <option value=''> { t('services.component-service-1-title')} </option>
                  <option value=''> { t('services.component-service-2-title')} </option>
                  <option value=''> { t('services.component-service-3-title')} </option>
                  <option value=''> { t('services.component-service-4-title')} </option>
                  <option value=''> { t('services.component-service-5-title')} </option>
                  <option value=''> { t('services.component-service-6-title')} </option>
                  <option value=''> { t('services.component-service-7-title')} </option>
                </select>
              </div>
              <div className="flex flex-col mt-4">
                <label className="text-sm font-bold mb-1.5 after:content-['*'] after:ml-0.5 after:text-red-500 " htmlFor="message">{t('contact.form-message')}</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border bg-neutral-200 border-neutral-300 focus:border-blue-500 outline-none transition-all resize-none"
                  id="message"
                  name="message"
                  rows={5}
                  placeholder={t('contact.form-message-placeholder')}
                  required
                />
              </div>

              <div className="flex items-start gap-3 mt-6 mb-4">
                <div className="flex items-center h-5">
                  <input
                    id="privacy"
                    name="privacy"
                    type="checkbox"
                    required
                    className="w-5 h-5 border border-dark-100 rounded bg-gray-50 focus:ring-3 focus:ring-blue-200 transition-all cursor-pointer accent-blue-600"
                  />
                </div>
                <label htmlFor="privacy" className="text-sm text-slate-600 cursor-pointer select-none after:content-['*'] after:ml-0.5 after:text-red-500">
                  {arrFormPrivacy.map((part, i) =>
                    i % 2 === 1
                      ? <span key={i} className="text-tertiary-500 font-semibold"><Link to='/privacy-policy' target="_blank">{part}</Link></span>
                      : part
                  )}
                </label>
              </div>

              <div className="flex justify-center mt-5">
                <CustomButton
                  variant="primary"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-tertiary-300 focus:border-blue-500 outline-none transition-all resize-none"
                >
                  {t('contact.form-btn')} <IoMdSend />
                </CustomButton>
              </div>

            </fieldset>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Contact