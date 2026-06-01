import { useTranslation } from "react-i18next"

const PrivacyNotice = () => {
    const { t } = useTranslation();
  return (
    <div className="px-10 m-5 flex-col items-center">
      
      {/* Header */}
      <h1 className="text-4xl justify-center">{ t("privacy-notice.header-title") }</h1>
      <p className="mt-2">{ t("privacy-notice.header-content") }</p>

      <section className="text-2xl my-4"></section>
      <p className="text-2xl mt-10">{ t("privacy-notice.section-1-title")}</p>
      <p className="mt-1">{ t("privacy-notice.section-1-content") }</p>

      <section className="text-2xl my-4"></section>
      <p className="text-2xl mt-10">{ t("privacy-notice.section-2-title")}</p>
      <p className="mt-1">{ t("privacy-notice.section-2-content") }</p>

      <section className="text-2xl my-4"></section>
      <p className="text-2xl mt-10">{ t("privacy-notice.section-3-title")}</p>
      <p className="mt-1">{ t("privacy-notice.section-3-content") }</p>

      <section className="text-2xl my-4"></section>
      <p className="text-2xl mt-10">{ t("privacy-notice.section-4-title")}</p>
      <p className="mt-1">{ t("privacy-notice.section-4-content") }</p>

      <section className="text-2xl my-4"></section>
      <p className="text-2xl mt-10">{ t("privacy-notice.section-5-title")}</p>
      <p className="mt-1">{ t("privacy-notice.section-5-content") }</p>

      <section className="text-2xl my-4"></section>
      <p className="text-2xl mt-10">{ t("privacy-notice.section-6-title")}</p>
      <p className="mt-1">{ t("privacy-notice.section-6-content") }</p>

      <section className="text-2xl my-4"></section>
      <p className="text-2xl mt-10">{ t("privacy-notice.section-7-title")}</p>
      <p className="mt-1">{ t("privacy-notice.section-7-content") }</p>


    </div>
  )
}

export default PrivacyNotice