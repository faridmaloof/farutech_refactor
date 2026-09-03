import { useEffect } from 'react';

interface SchemaProps {
  type: 'ProfessionalService' | 'Service' | 'FAQPage' | 'LocalBusiness';
  data: Record<string, any>;
}

/**
 * Componente para inyectar datos estructurados JSON-LD en el head.
 * Mejora el SEO rico (Rich Snippets) en Google.
 */
export function JsonLd({ type, data }: SchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  useEffect(() => {
    const scriptId = `jsonld-${type.toLowerCase()}`;
    
    // Verificar si ya existe para evitar duplicados
    let existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;
    
    if (!existingScript) {
      existingScript = document.createElement('script');
      existingScript.type = 'application/ld+json';
      existingScript.id = scriptId;
      document.head.appendChild(existingScript);
    }
    
    existingScript.textContent = JSON.stringify(schema);

    return () => {
      // Opcional: limpiar al desmontar si es necesario
      // if (existingScript && existingScript.parentNode) {
      //   existingScript.parentNode.removeChild(existingScript);
      // }
    };
  }, [type, data]);

  return null; // No renderiza nada visible
}

/**
 * Helper para generar Schema de Servicio específico
 */
export const generateServiceSchema = (service: {
  name: string;
  description: string;
  image?: string;
  providerName: string;
  areaServed?: string;
}) => ({
  name: service.name,
  description: service.description,
  image: service.image,
  provider: {
    '@type': 'ProfessionalService',
    name: service.providerName,
    url: 'https://www.farutech.com',
  },
  areaServed: service.areaServed || 'Global',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: `${service.name} Services`,
    itemCount: 1,
  },
});

/**
 * Helper para generar Schema de FAQ
 */
export const generateFaqSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});
