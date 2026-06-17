import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: string;
}

export default function SEO({ title, description, name = "Mexiware", type = "website" }: SEOProps) {
  return (
    <Helmet>
      {/* Etiquetas estándar */}
      <title>{title}</title>
      <meta name='description' content={description} />

      {/* Etiquetas Open Graph (Para cuando compartes el link en Facebook, LinkedIn, etc.) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={name} />

      {/* Etiquetas Twitter */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}