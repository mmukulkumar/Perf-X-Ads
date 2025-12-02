
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: 'website' | 'article' | 'product';
  schema?: Record<string, any>;
  keywords?: string[];
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  canonical, 
  type = 'website', 
  schema,
  keywords 
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title.includes('Perf X Ads') ? title : `${title} | Perf X Ads`;

    // 2. Update Meta Tags
    const updateMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const updateOG = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', description);
    if (keywords && keywords.length > 0) {
        updateMeta('keywords', keywords.join(', '));
    }
    
    // Open Graph / Social
    updateOG('og:title', title);
    updateOG('og:description', description);
    updateOG('og:type', type);
    updateOG('og:site_name', 'Perf X Ads');
    
    // Canonical
    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical || window.location.href);

    // 3. Inject JSON-LD Schema (Critical for GEO/AIO)
    const scriptId = 'structured-data';
    let script = document.getElementById(scriptId);
    
    // Base Schema for the Brand/Organization
    const organizationSchema = {
      "@type": "Organization",
      "name": "Perf X Ads",
      "url": "https://perfxads.com", // Placeholder URL
      "logo": "https://perfxads.com/logo.png",
      "sameAs": [
        "https://twitter.com/perfxads",
        "https://linkedin.com/company/perfxads"
      ]
    };

    // Construct final schema graph
    const graph = [
        organizationSchema,
        schema // Page specific schema
    ].filter(Boolean);

    const fullSchema = {
        "@context": "https://schema.org",
        "@graph": graph
    };

    if (script) {
      script.textContent = JSON.stringify(fullSchema);
    } else {
      script = document.createElement('script');
      script.id = scriptId;
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify(fullSchema);
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup if necessary, though usually overwriting is fine for SPAs
    };
  }, [title, description, canonical, type, schema, keywords]);

  return null;
};

export default SEO;
