import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  const { t } = useTranslation();
  return (
    <div className="px-10 m-5 flex-col items-center">
      
      {/* Header */}
      <h1 className="text-4xl justify-center">{ t("terms-and-conditions.header-title") }</h1>
      <p className="mt-2">{ t("terms-and-conditions.header-content") }</p>

      <section className="text-2xl my-4"></section>
      <p className="text-2xl mt-10">{ t("terms-and-conditions.section-1-title")}</p>
      <p className="mt-1">{ t("terms-and-conditions.section-1-content") }</p>

      <section className="text-2xl my-4"></section>
      <p className="text-2xl mt-10">{ t("terms-and-conditions.section-2-title")}</p>
      <p className="mt-1">{ t("terms-and-conditions.section-2-content") }</p>

      <section className="text-2xl my-4"></section>
      <p className="text-2xl mt-10">{ t("terms-and-conditions.section-3-title")}</p>
      <p className="mt-1">{ t("terms-and-conditions.section-3-content") }</p>

      <section className="text-2xl my-4"></section>
      <p className="text-2xl mt-10">{ t("terms-and-conditions.section-4-title")}</p>
      <p className="mt-1">{ t("terms-and-conditions.section-4-content") } <Link to="/privacy-notice">{ t("terms-and-conditions.section-4-privacy-notice-link") }</Link></p>

      <section className="text-2xl my-4"></section>
      <p className="text-2xl mt-10">{ t("terms-and-conditions.section-5-title")}</p>
      <p className="mt-1">{ t("terms-and-conditions.section-5-content") }</p>

      <section className="text-2xl my-4"></section>
      <p className="text-2xl mt-10">{ t("terms-and-conditions.section-6-title")}</p>
      <p className="mt-1">{ t("terms-and-conditions.section-6-content") }</p>

      <section className="text-2xl my-4"></section>
      <p className="text-2xl mt-10">{ t("terms-and-conditions.section-7-title")}</p>
      <p className="mt-1">{ t("terms-and-conditions.section-7-content") }</p>


    </div>
  )
}

export default TermsAndConditions