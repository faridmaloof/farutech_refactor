// ============================================================================
// FaruTech — Casos de éxito reales
// ============================================================================

import type { CaseStudy } from '../types';
import type { L } from '../i18n';

export interface ExtendedCaseStudy extends CaseStudy {
  sector: L;
  summary: L;
  tags: L[];
  url: string;
  impact: L;
  items: Array<{
    label: L;
    status: 'success' | 'warning' | 'error' | 'info';
    statusLabel: L;
  }>;
}

export const caseStudies: ExtendedCaseStudy[] = [
  {
    id: 'afilamos-hermanos',
    slug: 'afilamos-hermanos',
    client: 'Afilamos Hermanos',
    industry: 'Retail / Comercio especializado',
    serviceSlug: 'web-pos',
    challenge:
      'Afilamos Hermanos operaba su punto de venta físico y sus pedidos en línea con sistemas desconectados: el inventario se actualizaba manualmente entre canales, lo que generaba ventas de productos sin stock real, errores de cobro en caja y pérdida de pedidos entre turnos.',
    solution:
      'Diseñamos e implementamos una plataforma web comercial conectada a un sistema de punto de venta (POS) y a un panel único de gestión de órdenes. El inventario, los precios y el estado de cada pedido —físico o digital— se sincronizan en tiempo real desde un solo origen de datos, con capacitación del equipo en mostrador para una adopción sin fricción.',
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe / pasarela local', 'Docker', 'Nginx'],
    metrics: [
      { label: 'Eficiencia en gestión de pedidos', value: '+40%' },
      { label: 'Errores de inventario y caja', value: '-90%' },
      { label: 'Tiempo de implementación', value: '7 semanas' },
    ],
    featured: true,
    order: 1,
    // Extended fields for patterns.tsx
    sector: { es: 'Industrial', en: 'Industrial' },
    summary: {
      es: 'Plataforma web + POS con inventario unificado en tiempo real.',
      en: 'Web platform + POS with unified real-time inventory.',
    },
    tags: [
      { es: 'E-commerce', en: 'E-commerce' },
      { es: 'POS', en: 'POS' },
      { es: 'Inventario', en: 'Inventory' },
      { es: 'React', en: 'React' },
    ],
    url: 'https://afilamos.com',
    impact: {
      es: '✓ En producción desde 2024',
      en: '✓ Live since 2024',
    },
    items: [
      {
        label: { es: 'Plataforma web', en: 'Web platform' },
        status: 'success' as const,
        statusLabel: { es: 'Completado', en: 'Completed' },
      },
      {
        label: { es: 'POS integrado', en: 'Integrated POS' },
        status: 'success' as const,
        statusLabel: { es: 'Completado', en: 'Completed' },
      },
      {
        label: { es: 'Inventario en tiempo real', en: 'Real-time inventory' },
        status: 'success' as const,
        statusLabel: { es: 'Completado', en: 'Completed' },
      },
    ],
  },
  {
    id: 'supraeventos',
    slug: 'supraeventos',
    client: 'Supraeventos',
    industry: 'Eventos y entretenimiento',
    serviceSlug: 'cloud-security',
    challenge:
      'Supraeventos necesitaba soportar picos masivos de tráfico durante el lanzamiento de venta de entradas y accesos a eventos en vivo, sin comprometer la seguridad de los datos de pago y personales de sus usuarios. Su infraestructura anterior no escalaba a tiempo y carecía de monitoreo activo.',
    solution:
      'Diseñamos y migramos su infraestructura a una arquitectura cloud multi-zona con autoescalado, balanceo de carga y monitoreo 24/7. Implementamos hardening de seguridad desde el diseño (no como capa posterior): cifrado en tránsito y reposo, gestión de secretos, WAF y auditorías periódicas de vulnerabilidades.',
    stack: ['AWS (EC2, RDS, CloudFront)', 'Terraform', 'Docker', 'GitHub Actions (CI/CD)', 'Datadog', 'Cloudflare WAF'],
    metrics: [
      { label: 'Disponibilidad (uptime)', value: '99.9%' },
      { label: 'Brechas de seguridad reportadas', value: '0' },
      { label: 'Cobertura de monitoreo', value: '24/7' },
    ],
    featured: true,
    order: 2,
    // Extended fields for patterns.tsx
    sector: { es: 'Eventos Corporativos', en: 'Corporate Events' },
    summary: {
      es: 'Infraestructura cloud escalable con seguridad enterprise para venta de entradas.',
      en: 'Scalable cloud infrastructure with enterprise security for ticket sales.',
    },
    tags: [
      { es: 'AWS', en: 'AWS' },
      { es: 'Cloud', en: 'Cloud' },
      { es: 'Seguridad', en: 'Security' },
      { es: 'Escalabilidad', en: 'Scalability' },
    ],
    url: 'https://supraeventos.com',
    impact: {
      es: '✓ 99.9% uptime desde 2024',
      en: '✓ 99.9% uptime since 2024',
    },
    items: [
      {
        label: { es: 'Infraestructura cloud', en: 'Cloud infrastructure' },
        status: 'success' as const,
        statusLabel: { es: 'Completado', en: 'Completed' },
      },
      {
        label: { es: 'Autoescalado', en: 'Auto-scaling' },
        status: 'success' as const,
        statusLabel: { es: 'Completado', en: 'Completed' },
      },
      {
        label: { es: 'Monitoreo 24/7', en: '24/7 monitoring' },
        status: 'success' as const,
        statusLabel: { es: 'Activo', en: 'Active' },
      },
    ],
  },
];

export default caseStudies;
