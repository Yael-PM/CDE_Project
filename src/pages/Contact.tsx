import { useTranslation } from "react-i18next"
import ServiceCard from "../components/ServiceCard";
import { LuShieldCheck } from "react-icons/lu";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <main>

      <section>
        <p>{t('contact.title')}</p>
        <p>{t('contact.description')}</p>
      </section>

      <section>
        <div>
          <ServiceCard
            title={t('contact.component-contact-title')}
            description={t('contact.component-contact-call')}
            type="none"
            icon
          />
          <ServiceCard
            title={t('contact.component-privacy-title')}
            description={t('contact.component-privacy-description')}
            extraStyles="bg-fourth-400"
            type="none"
            icon={<LuShieldCheck />}
          />
        </div>

        <div>
          <form>
            <fieldset>
              <legend> {t('contact.form-title')} </legend>

              {/* Contenedor del grid */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="form-group flex flex-col">
                  <label className = "text-sm font-bold mx-5 mt-5 mb-2" htmlFor='name'>{t('contact.form-name')}</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-dark-100 mx-5 mb-2 transition-all" type="text" id="name" placeholder={t('contact.form-name-placeholder')} required />
                </div>

                <div className="form-group flex flex-col">
                  <label className = "text-sm font-bold mx-5 mt-5 mb-2" htmlFor='email'>{t('contact.form-email')}</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-dark-100 mx-5 mb-2 transition-all" type="text" id="email" name="email" placeholder={t('contact.form-email-placeholder')} required />
                </div>

                <div className="form-group flex flex-col">
                  <label className = "text-sm font-bold mx-5 mt-5 mb-2" htmlFor='company'>{t('contact.form-company')}</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-dark-100 mx-5 mb-2 transition-all" type="text" id="company" name="company" placeholder={t('contact.form-company-placeholder')} required />
                </div>
                <div className="form-group flex flex-col">
                  <label className = "text-sm font-bold mx-5 mt-5 mb-2" htmlFor='phone'>{t('contact.form-phone')}</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-dark-100 mx-5 mb-2 transition-all" type="tel" id="phone" name="phone" placeholder={t('contact.form-phone-placeholder')} required />
                </div>
              </div>

              <div className="form-group flex flex-col">
                <label className = "text-sm font-bold mx-5 mt-5 mb-2" htmlFor="position">{t('contact.form-position')}</label>
                <input className="w-full px-4 py-3 rounded-xl border border-dark-100 mx-5 mb-2 transition-all" type="text" id="position" name="position" placeholder={t('contact.form-position-placeholder')} required/>
              </div>

              <div className="form-group flex flex-col">
                <label className = "text-sm font-bold mx-5 mt-5 mb-2" htmlFor="affair">{t('contact.form-affair')}</label>
                <select id="affair" name="affair">
                  <option value="" disabled selected></option>
                </select>
              </div>
              
              <div className="form-group flex flex-col">
                <label className = "text-sm font-bold mx-5 mt-5 mb-2" htmlFor="message">{t('contact.form-message')}</label>
                <textarea id="message" name="message" rows={5} placeholder={t('contact.form-message-placeholder')} required/>
              </div>

              </fieldset>
          </form>
        </div>
      </section>

    </main>
  )
}

export default Contact