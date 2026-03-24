import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend) // Carga los archivos .json desde tu carpeta public o assets
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'es', // Idioma por defecto
    fallbackLng: 'es',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      // Ruta donde guardas tus archivos JSON
      loadPath: '/translations/{{lng}}.json', 
    }
  });

export default i18n;