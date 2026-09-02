-- =============================================================================
-- FARUTECH DATABASE INITIALIZATION SCRIPT
-- =============================================================================
-- Este script se ejecuta automáticamente al crear el contenedor de PostgreSQL
-- Crea la base de datos, extensiones y esquemas iniciales
-- =============================================================================

-- Crear extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear extensión para full-text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Crear esquema para la aplicación
CREATE SCHEMA IF NOT EXISTS farutech;

-- Configurar búsqueda por defecto
SET search_path TO farutech, public;

-- =============================================================================
-- TABLA: locations (Jerarquía geográfica)
-- =============================================================================
CREATE TABLE IF NOT EXISTS farutech.locations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('country', 'state', 'city', 'municipality')),
    code VARCHAR(10),
    parent_id BIGNULL REFERENCES farutech.locations(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS locations_type_idx ON farutech.locations(type);
CREATE INDEX IF NOT EXISTS locations_parent_idx ON farutech.locations(parent_id);
CREATE INDEX IF NOT EXISTS locations_name_idx ON farutech.locations USING gin(name gin_trgm_ops);

COMMENT ON TABLE farutech.locations IS 'Jerarquía geográfica: países > estados > ciudades > municipios';

-- =============================================================================
-- TABLA: leads (Gestión de clientes potenciales)
-- =============================================================================
CREATE TABLE IF NOT EXISTS farutech.leads (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    company_name VARCHAR(255),
    contact_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(255),
    description TEXT,
    service_interest VARCHAR(255),
    location_id BIGINT REFERENCES farutech.locations(id),
    source VARCHAR(50) DEFAULT 'manual' CHECK (source IN ('manual', 'search', 'contact_form', 'newsletter', 'import')),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'inactive')),
    quality_score INTEGER DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 100),
    assigned_to BIGINT NULL,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    metadata JSONB DEFAULT '{}'::jsonb,
    is_internal_search BOOLEAN DEFAULT false,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP(0) WITHOUT TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS leads_status_idx ON farutech.leads(status);
CREATE INDEX IF NOT EXISTS leads_source_idx ON farutech.leads(source);
CREATE INDEX IF NOT EXISTS leads_quality_idx ON farutech.leads(quality_score DESC);
CREATE INDEX IF NOT EXISTS leads_location_idx ON farutech.leads(location_id);
CREATE INDEX IF NOT EXISTS leads_email_idx ON farutech.leads(email);
CREATE INDEX IF NOT EXISTS leads_created_idx ON farutech.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_metadata_idx ON farutech.leads USING gin(metadata);

COMMENT ON TABLE farutech.leads IS 'Clientes potenciales con scoring y seguimiento UTM';

-- =============================================================================
-- TABLA: lead_interactions (Historial de seguimientos)
-- =============================================================================
CREATE TABLE IF NOT EXISTS farutech.lead_interactions (
    id BIGSERIAL PRIMARY KEY,
    lead_id BIGINT NOT NULL REFERENCES farutech.leads(id) ON DELETE CASCADE,
    user_id BIGINT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'note', 'whatsapp', 'other')),
    subject VARCHAR(255),
    description TEXT,
    next_follow_up TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS lead_interactions_lead_idx ON farutech.lead_interactions(lead_id);
CREATE INDEX IF NOT EXISTS lead_interactions_type_idx ON farutech.lead_interactions(type);
CREATE INDEX IF NOT EXISTS lead_interactions_followup_idx ON farutech.lead_interactions(next_follow_up);

COMMENT ON TABLE farutech.lead_interactions IS 'Historial de interacciones con leads';

-- =============================================================================
-- TABLA: opportunities (Oportunidades encontradas por scraping)
-- =============================================================================
CREATE TABLE IF NOT EXISTS farutech.opportunities (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    source_url TEXT NOT NULL,
    source_platform VARCHAR(100) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    website VARCHAR(255),
    description TEXT,
    services_detected TEXT[],
    location_id BIGINT REFERENCES farutech.locations(id),
    quality_score INTEGER DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 100),
    social_media JSONB DEFAULT '{}'::jsonb,
    reviews_count INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    is_processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    converted_to_lead_id BIGINT NULL REFERENCES farutech.leads(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS opportunities_source_idx ON farutech.opportunities(source_platform);
CREATE INDEX IF NOT EXISTS opportunities_quality_idx ON farutech.opportunities(quality_score DESC);
CREATE INDEX IF NOT EXISTS opportunities_processed_idx ON farutech.opportunities(is_processed);
CREATE INDEX IF NOT EXISTS opportunities_location_idx ON farutech.opportunities(location_id);
CREATE INDEX IF NOT EXISTS opportunities_created_idx ON farutech.opportunities(created_at DESC);

COMMENT ON TABLE farutech.opportunities IS 'Oportunidades de negocio encontradas automáticamente';

-- =============================================================================
-- TABLA: newsletter_subscribers (Suscriptores a newsletter)
-- =============================================================================
CREATE TABLE IF NOT EXISTS farutech.newsletter_subscribers (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    tags TEXT[] DEFAULT '{}',
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_email_idx ON farutech.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS newsletter_subscribers_active_idx ON farutech.newsletter_subscribers(is_active);
CREATE INDEX IF NOT EXISTS newsletter_subscribers_tags_idx ON farutech.newsletter_subscribers USING gin(tags);

COMMENT ON TABLE farutech.newsletter_subscribers IS 'Suscriptores a newsletter con segmentación';

-- =============================================================================
-- TABLA: blog_posts (Sistema de blogs)
-- =============================================================================
CREATE TABLE IF NOT EXISTS farutech.blog_posts (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image VARCHAR(255),
    author_id BIGINT,
    category_id BIGINT,
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    published_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    scheduled_for TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    views_count INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 0,
    seo_title VARCHAR(255),
    seo_description VARCHAR(255),
    seo_keywords TEXT[],
    is_featured BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON farutech.blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_status_idx ON farutech.blog_posts(status);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON farutech.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON farutech.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS blog_posts_tags_idx ON farutech.blog_posts USING gin(tags);

COMMENT ON TABLE farutech.blog_posts IS 'Artículos del blog con SEO y programación';

-- =============================================================================
-- TABLA: utm_tracking (Seguimiento de campañas UTM)
-- =============================================================================
CREATE TABLE IF NOT EXISTS farutech.utm_tracking (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    landing_page VARCHAR(255),
    referrer VARCHAR(255),
    user_agent TEXT,
    ip_address INET,
    converted BOOLEAN DEFAULT false,
    conversion_type VARCHAR(50),
    conversion_id BIGINT,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS utm_tracking_session_idx ON farutech.utm_tracking(session_id);
CREATE INDEX IF NOT EXISTS utm_tracking_source_idx ON farutech.utm_tracking(utm_source);
CREATE INDEX IF NOT EXISTS utm_tracking_campaign_idx ON farutech.utm_tracking(utm_campaign);
CREATE INDEX IF NOT EXISTS utm_tracking_converted_idx ON farutech.utm_tracking(converted);
CREATE INDEX IF NOT EXISTS utm_tracking_created_idx ON farutech.utm_tracking(created_at DESC);

COMMENT ON TABLE farutech.utm_tracking IS 'Seguimiento completo de campañas UTM y conversiones';

-- =============================================================================
-- VISTA: leads_summary (Resumen de leads por estado)
-- =============================================================================
CREATE OR REPLACE VIEW farutech.leads_summary AS
SELECT 
    status,
    COUNT(*) as total_leads,
    AVG(quality_score) as avg_quality_score,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as new_this_week,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_this_month
FROM farutech.leads
WHERE deleted_at IS NULL
GROUP BY status;

-- =============================================================================
-- FUNCIÓN: update_updated_at_column()
-- =============================================================================
CREATE OR REPLACE FUNCTION farutech.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS: Auto-actualizar updated_at
-- =============================================================================
CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON farutech.locations
    FOR EACH ROW
    EXECUTE FUNCTION farutech.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON farutech.leads
    FOR EACH ROW
    EXECUTE FUNCTION farutech.update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
    BEFORE UPDATE ON farutech.opportunities
    FOR EACH ROW
    EXECUTE FUNCTION farutech.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON farutech.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION farutech.update_updated_at_column();

-- =============================================================================
-- COMENTARIOS ADICIONALES
-- =============================================================================
COMMENT ON COLUMN farutech.leads.quality_score IS 'Score calculado: email(+20), telefono(+15), website(+15), social(+10), reviews(+10), rating(+10), descripcion(+10)';
COMMENT ON COLUMN farutech.leads.is_internal_search IS 'TRUE si el lead fue encontrado por búsqueda interna de oportunidades';
COMMENT ON COLUMN farutech.opportunities.services_detected IS 'Array de servicios detectados en la fuente original';
COMMENT ON COLUMN farutech.blog_posts.reading_time IS 'Tiempo estimado de lectura en minutos';

-- =============================================================================
-- DATOS INICIALES MÍNIMOS
-- =============================================================================

-- Países base
INSERT INTO farutech.locations (name, type, code, parent_id, is_active) VALUES
('Colombia', 'country', 'CO', NULL, true),
('México', 'country', 'MX', NULL, true),
('España', 'country', 'ES', NULL, true),
('Estados Unidos', 'country', 'US', NULL, true)
ON CONFLICT DO NOTHING;

-- Estados de ejemplo (Colombia)
INSERT INTO farutech.locations (name, type, code, parent_id, is_active) 
SELECT 'Cundinamarca', 'state', 'CUN', id, true 
FROM farutech.locations WHERE name = 'Colombia' AND type = 'country'
ON CONFLICT DO NOTHING;

INSERT INTO farutech.locations (name, type, code, parent_id, is_active) 
SELECT 'Antioquia', 'state', 'ANT', id, true 
FROM farutech.locations WHERE name = 'Colombia' AND type = 'country'
ON CONFLICT DO NOTHING;

-- Ciudades de ejemplo
INSERT INTO farutech.locations (name, type, parent_id, is_active) 
SELECT 'Bogotá', 'city', id, true 
FROM farutech.locations WHERE name = 'Cundinamarca' AND type = 'state'
ON CONFLICT DO NOTHING;

INSERT INTO farutech.locations (name, type, parent_id, is_active) 
SELECT 'Medellín', 'city', id, true 
FROM farutech.locations WHERE name = 'Antioquia' AND type = 'state'
ON CONFLICT DO NOTHING;

-- =============================================================================
-- FIN DEL SCRIPT DE INICIALIZACIÓN
-- =============================================================================
