
import React, { useState, useEffect } from 'react';
import { Code, Copy, Check, ExternalLink, Plus, Trash2, RefreshCw, Search, ChevronDown, Globe, Info, Calendar, MapPin, Clock, DollarSign, Wrench, Package, Navigation, Phone, Play, Sparkles, Bot, FileText } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

type SchemaType = 'Article' | 'Breadcrumb' | 'Event' | 'FAQ Page' | 'How-to' | 'Local Business' | 'Organization' | 'Product' | 'Video' | 'Website';

const SchemaMarkupGenerator = () => {
  const [selectedType, setSelectedType] = useState<SchemaType>('Video');
  const [jsonLd, setJsonLd] = useState('');
  const [copied, setCopied] = useState(false);

  // --- AI State ---
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiUrl, setAiUrl] = useState('');
  const [aiContext, setAiContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  // --- State for different forms ---
  
  // Article
  const [articleData, setArticleData] = useState({
    type: 'Article',
    headline: '',
    image: '',
    authorType: 'Person',
    authorName: '',
    publisherName: '',
    publisherLogo: '',
    datePublished: '',
    dateModified: ''
  });

  // Breadcrumb
  const [breadcrumbItems, setBreadcrumbItems] = useState([{ name: '', url: '' }]);

  // Event
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    image: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    eventStatus: 'EventScheduled',
    attendanceMode: 'OfflineEventAttendanceMode',
    performerType: 'Person',
    performerName: '',
    locationName: '',
    locationAddress: '', 
    onlineUrl: '',
    offers: [
      { name: 'General Admission', price: '', currency: 'USD', availability: 'InStock', url: '' }
    ]
  });

  // How-to
  const [howToData, setHowToData] = useState({
    name: '',
    description: '',
    totalTime: { days: '', hours: '', minutes: '' },
    estimatedCost: { currency: 'USD', value: '' },
    image: '',
    supplies: [''],
    tools: [''],
    steps: [{ name: '', text: '', image: '', url: '' }]
  });

  // FAQ
  const [faqItems, setFaqItems] = useState([{ question: '', answer: '' }]);

  // Local Business
  const [localBusinessData, setLocalBusinessData] = useState({
    type: 'LocalBusiness',
    name: '',
    image: '',
    id: '',
    url: '',
    telephone: '',
    priceRange: '$$',
    streetAddress: '',
    addressLocality: '',
    addressRegion: '',
    postalCode: '',
    addressCountry: 'US',
    latitude: '',
    longitude: '',
    open247: false,
    openingHours: [
      { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '17:00' }
    ],
    socialProfiles: ['']
  });

  // Organization
  const [orgData, setOrgData] = useState({
    type: 'Organization',
    specificType: '',
    name: '',
    alternateName: '',
    url: '',
    logo: '',
    contactPoints: [
        { telephone: '', contactType: 'Customer Service', email: '', areaServed: '', availableLanguage: '' }
    ],
    socialProfiles: ['']
  });

  // Product
  const [productData, setProductData] = useState({
    name: '',
    image: '',
    description: '',
    brand: '',
    sku: '',
    price: '',
    priceCurrency: 'USD',
    availability: 'InStock'
  });

  // Video
  const [videoData, setVideoData] = useState({
    name: '',
    description: '',
    uploadDate: '',
    duration: { minutes: '', seconds: '' },
    thumbnailUrls: [''],
    contentUrl: '',
    embedUrl: '',
    seekToActionTargetUrl: ''
  });

  // Website
  const [websiteData, setWebsiteData] = useState({
    name: '',
    url: '',
    internalSearchUrl: '',
    searchQuerySuffix: ''
  });

  // --- Helpers ---
  const handleGeoLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocalBusinessData(prev => ({
                ...prev,
                latitude: position.coords.latitude.toString(),
                longitude: position.coords.longitude.toString()
            }));
        }, (error) => {
            alert('Unable to retrieve your location');
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // --- Generators ---

  useEffect(() => {
    // If AI mode is active and we have generated JSON, don't overwrite it with manual data
    if (isAiMode && jsonLd) return;

    let schema: any = {};

    switch (selectedType) {
      case 'Article':
        schema = {
          "@context": "https://schema.org",
          "@type": articleData.type,
          "headline": articleData.headline,
          "image": articleData.image ? [articleData.image] : [],
          "datePublished": articleData.datePublished,
          "dateModified": articleData.dateModified,
          "author": [{
              "@type": articleData.authorType,
              "name": articleData.authorName,
              "url": articleData.authorType === 'Person' ? undefined : undefined 
          }]
        };
        if (articleData.publisherName) {
            schema.publisher = {
                "@type": "Organization",
                "name": articleData.publisherName,
                "logo": {
                    "@type": "ImageObject",
                    "url": articleData.publisherLogo
                }
            };
        }
        break;

      case 'Breadcrumb':
        schema = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbItems.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        };
        break;

      case 'Event':
        schema = {
          "@context": "https://schema.org",
          "@type": "Event",
          "name": eventData.name,
          "description": eventData.description,
          "image": eventData.image ? [eventData.image] : [],
          "startDate": eventData.startDate && eventData.startTime ? `${eventData.startDate}T${eventData.startTime}` : eventData.startDate,
          "endDate": eventData.endDate && eventData.endTime ? `${eventData.endDate}T${eventData.endTime}` : eventData.endDate,
          "eventStatus": `https://schema.org/${eventData.eventStatus}`,
          "eventAttendanceMode": `https://schema.org/${eventData.attendanceMode}`,
        };

        if (eventData.performerName) {
            schema.performer = {
                "@type": eventData.performerType,
                "name": eventData.performerName
            };
        }

        if (eventData.attendanceMode === 'OnlineEventAttendanceMode' || eventData.attendanceMode === 'MixedEventAttendanceMode') {
             if (eventData.attendanceMode === 'OnlineEventAttendanceMode') {
                 schema.location = {
                     "@type": "VirtualLocation",
                     "url": eventData.onlineUrl
                 };
             }
        }
        
        if (eventData.attendanceMode === 'OfflineEventAttendanceMode' || eventData.attendanceMode === 'MixedEventAttendanceMode') {
            const physicalLoc = {
                "@type": "Place",
                "name": eventData.locationName,
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": eventData.locationAddress,
                    "addressLocality": "", 
                    "addressRegion": "", 
                    "postalCode": "",
                    "addressCountry": ""
                }
            };

            if (eventData.attendanceMode === 'MixedEventAttendanceMode') {
                schema.location = [physicalLoc];
                if (eventData.onlineUrl) {
                    schema.location.push({
                        "@type": "VirtualLocation",
                        "url": eventData.onlineUrl
                    });
                }
            } else {
                schema.location = physicalLoc;
            }
        }

        if (eventData.offers.length > 0) {
            schema.offers = eventData.offers.map(offer => ({
                "@type": "Offer",
                "name": offer.name,
                "price": offer.price,
                "priceCurrency": offer.currency,
                "availability": `https://schema.org/${offer.availability}`,
                "url": offer.url
            }));
        }
        break;

      case 'How-to':
        const isoDuration = `P${howToData.totalTime.days || 0}DT${howToData.totalTime.hours || 0}H${howToData.totalTime.minutes || 0}M`;
        
        schema = {
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": howToData.name,
          "description": howToData.description,
          "image": howToData.image ? [howToData.image] : [],
          "totalTime": isoDuration,
          "estimatedCost": {
            "@type": "MonetaryAmount",
            "currency": howToData.estimatedCost.currency,
            "value": howToData.estimatedCost.value
          },
          "supply": howToData.supplies.filter(s => s.trim()).map(s => ({
            "@type": "HowToSupply",
            "name": s
          })),
          "tool": howToData.tools.filter(t => t.trim()).map(t => ({
            "@type": "HowToTool",
            "name": t
          })),
          "step": howToData.steps.map(step => ({
            "@type": "HowToStep",
            "text": step.text,
            "image": step.image,
            "name": step.name,
            "url": step.url
          }))
        };
        break;

      case 'FAQ Page':
        schema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqItems.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
        };
        break;

      case 'Local Business':
        schema = {
          "@context": "https://schema.org",
          "@type": localBusinessData.type,
          "name": localBusinessData.name,
          "image": localBusinessData.image,
          "@id": localBusinessData.id || undefined,
          "url": localBusinessData.url,
          "telephone": localBusinessData.telephone,
          "priceRange": localBusinessData.priceRange,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": localBusinessData.streetAddress,
            "addressLocality": localBusinessData.addressLocality,
            "addressRegion": localBusinessData.addressRegion,
            "postalCode": localBusinessData.postalCode,
            "addressCountry": localBusinessData.addressCountry
          }
        };

        if (localBusinessData.latitude && localBusinessData.longitude) {
            schema.geo = {
                "@type": "GeoCoordinates",
                "latitude": localBusinessData.latitude,
                "longitude": localBusinessData.longitude
            };
        }

        if (localBusinessData.socialProfiles.some(p => p.trim())) {
            schema.sameAs = localBusinessData.socialProfiles.filter(p => p.trim());
        }

        if (localBusinessData.open247) {
            schema.openingHoursSpecification = {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "00:00",
                "closes": "23:59"
            };
        } else if (localBusinessData.openingHours.length > 0) {
            schema.openingHoursSpecification = localBusinessData.openingHours.map(oh => ({
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": oh.days,
                "opens": oh.opens,
                "closes": oh.closes
            }));
        }
        break;

      case 'Organization':
        schema = {
          "@context": "https://schema.org",
          "@type": orgData.specificType || orgData.type,
          "name": orgData.name,
          "alternateName": orgData.alternateName || undefined,
          "url": orgData.url,
          "logo": orgData.logo,
          "contactPoint": orgData.contactPoints.filter(cp => cp.telephone || cp.contactType).map(cp => ({
                "@type": "ContactPoint",
                "telephone": cp.telephone,
                "contactType": cp.contactType,
                "email": cp.email || undefined,
                "areaServed": cp.areaServed || undefined,
                "availableLanguage": cp.availableLanguage || undefined
          })),
          "sameAs": orgData.socialProfiles.filter(url => url.length > 0)
        };
        if (schema.contactPoint.length === 0) delete schema.contactPoint;
        break;

      case 'Product':
        schema = {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": productData.name,
          "image": productData.image ? [productData.image] : [],
          "description": productData.description,
          "brand": {
            "@type": "Brand",
            "name": productData.brand
          },
          "sku": productData.sku,
          "offers": {
            "@type": "Offer",
            "url": "",
            "priceCurrency": productData.priceCurrency,
            "price": productData.price,
            "availability": `https://schema.org/${productData.availability}`
          }
        };
        break;

      case 'Video':
        const duration = `PT${videoData.duration.minutes || 0}M${videoData.duration.seconds || 0}S`;
        schema = {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          "name": videoData.name,
          "description": videoData.description,
          "thumbnailUrl": videoData.thumbnailUrls.filter(url => url.length > 0),
          "uploadDate": videoData.uploadDate,
          "duration": duration,
          "contentUrl": videoData.contentUrl || undefined,
          "embedUrl": videoData.embedUrl || undefined
        };
        if (videoData.seekToActionTargetUrl) {
            schema.potentialAction = {
                "@type": "SeekToAction",
                "target": `${videoData.seekToActionTargetUrl}={seek_to_second_number}`,
                "startOffset-input": "required name=seek_to_second_number"
            };
        }
        break;

      case 'Website':
        schema = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": websiteData.name,
          "url": websiteData.url,
        };
        if (websiteData.internalSearchUrl) {
            schema.potentialAction = {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${websiteData.internalSearchUrl}{search_term_string}${websiteData.searchQuerySuffix}`
                },
                "query-input": "required name=search_term_string"
            };
        }
        break;
    }

    setJsonLd(JSON.stringify(schema, null, 2));
  }, [selectedType, articleData, breadcrumbItems, eventData, howToData, faqItems, localBusinessData, orgData, productData, videoData, websiteData, isAiMode]);

  // --- AI Generator Logic ---
  const handleAiGenerate = async () => {
    if (!process.env.API_KEY) {
        setAiError("API Key not configured.");
        return;
    }
    
    setIsGenerating(true);
    setAiError('');

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const model = 'gemini-2.5-flash';
        
        const prompt = `
            You are an expert SEO specialist. 
            Generate valid schema.org JSON-LD markup for a '${selectedType}'.
            
            Website/Page URL: ${aiUrl}
            Page Content / Context: ${aiContext}
            
            Instructions:
            1. Analyze the provided URL context and content description.
            2. Create a complete, valid JSON-LD structure for the selected type: ${selectedType}.
            3. Include as many relevant properties as possible based on the input (e.g., name, description, images, dates, prices, authors, etc.).
            4. Return ONLY the JSON code. Do not include markdown formatting (like \`\`\`json ... \`\`\`) or explanations.
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        let generatedText = response.text || '';
        // Clean up markdown code blocks if present
        generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();

        // Basic validation to ensure it looks like JSON
        JSON.parse(generatedText); 

        setJsonLd(generatedText);
    } catch (err) {
        console.error(err);
        setAiError("Failed to generate schema. Please check your inputs or try again.");
    } finally {
        setIsGenerating(false);
    }
  };

  // --- Handlers ---

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `<script type="application/ld+json">\n${jsonLd}\n</script>`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const testInGoogle = () => {
    window.open('https://search.google.com/test/rich-results?user_agent=1', '_blank');
  };

  // Helper for input styling
  const inputClass = "w-full px-3 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all";
  const labelClass = "block text-xs font-bold text-brand-dark/70 uppercase mb-1.5";

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left: Input Form */}
          <div className="w-full lg:w-1/2 bg-brand-surface p-6 md:p-8 rounded-2xl border border-brand-medium/30 shadow-sm h-fit">
             
             {/* Header & Selector */}
             <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-brand-dark flex items-center gap-2">
                        <Code className="w-5 h-5 text-blue-600" />
                        Schema Markup Generator
                    </h3>
                    <button onClick={() => { /* Optional Reset Logic */ }} className="text-xs font-medium text-brand-dark/60 hover:text-brand-dark flex items-center gap-1 transition-colors">
                       <RefreshCw className="w-3 h-3" /> Reset
                    </button>
                </div>
                
                <div className="flex gap-2 mb-6 bg-brand-light/50 p-1 rounded-lg border border-brand-medium/20">
                    <button 
                        onClick={() => setIsAiMode(false)}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${!isAiMode ? 'bg-white dark:bg-brand-surface shadow-sm text-brand-dark' : 'text-brand-dark/60 hover:text-brand-dark'}`}
                    >
                        <Wrench className="w-3.5 h-3.5" /> Manual Builder
                    </button>
                    <button 
                        onClick={() => setIsAiMode(true)}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${isAiMode ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-brand-dark/60 hover:text-brand-dark'}`}
                    >
                        <Sparkles className="w-3.5 h-3.5" /> AI Auto-Generate
                    </button>
                </div>

                <div>
                    <label className={labelClass}>Which Schema.org markup would you like to create?</label>
                    <div className="relative">
                        <select 
                            value={selectedType} 
                            onChange={(e) => setSelectedType(e.target.value as SchemaType)}
                            className="w-full appearance-none bg-brand-light border border-brand-medium/40 text-brand-dark text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block p-3 pr-8 font-medium transition-all"
                        >
                            <option value="Article">Article</option>
                            <option value="Breadcrumb">Breadcrumb</option>
                            <option value="Event">Event</option>
                            <option value="FAQ Page">FAQ Page</option>
                            <option value="How-to">How-to</option>
                            <option value="Local Business">Local Business</option>
                            <option value="Organization">Organization</option>
                            <option value="Product">Product</option>
                            <option value="Video">Video</option>
                            <option value="Website">Website</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-brand-medium pointer-events-none" />
                    </div>
                </div>
             </div>

             {/* AI AUTO GENERATOR FORM */}
             {isAiMode ? (
                 <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                        <div className="flex items-start gap-3">
                            <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-1">AI Schema Automation</h4>
                                <p className="text-xs text-indigo-800/70 dark:text-indigo-300/70 leading-relaxed">
                                    Provide a URL or paste content below. Our AI will analyze the structure and automatically generate optimized JSON-LD markup for your selected type.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Page URL (for context)</label>
                        <div className="relative">
                            <input 
                                type="url" 
                                value={aiUrl}
                                onChange={(e) => setAiUrl(e.target.value)}
                                placeholder="https://example.com/my-page"
                                className={inputClass + " pl-9"}
                            />
                            <Globe className="absolute left-3 top-2.5 w-4 h-4 text-brand-medium" />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Page Content / Description / HTML</label>
                        <div className="relative">
                            <textarea 
                                rows={6}
                                value={aiContext}
                                onChange={(e) => setAiContext(e.target.value)}
                                placeholder="Paste your page content, product details, or raw HTML here. The more details you provide, the more accurate the schema will be."
                                className={inputClass + " pl-9 resize-none"}
                            />
                            <FileText className="absolute left-3 top-2.5 w-4 h-4 text-brand-medium" />
                        </div>
                    </div>

                    {aiError && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-xs rounded-lg border border-red-100 dark:border-red-800">
                            {aiError}
                        </div>
                    )}

                    <button 
                        onClick={handleAiGenerate}
                        disabled={isGenerating || (!aiUrl && !aiContext)}
                        className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all ${isGenerating || (!aiUrl && !aiContext) ? 'bg-brand-medium opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:scale-[1.01]'}`}
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" /> Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" /> Generate with AI
                            </>
                        )}
                    </button>
                 </div>
             ) : (
                 /* MANUAL FORM (Existing Logic) */
                 <div className="space-y-5 animate-in fade-in slide-in-from-left-2 duration-300">
                    {/* ARTICLE FORM */}
                    {selectedType === 'Article' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Article Type</label>
                                    <select 
                                        value={articleData.type} 
                                        onChange={(e) => setArticleData({...articleData, type: e.target.value})} 
                                        className={inputClass}
                                    >
                                        <option value="Article">Article</option>
                                        <option value="NewsArticle">NewsArticle</option>
                                        <option value="BlogPosting">BlogPosting</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Headline</label>
                                    <input type="text" value={articleData.headline} onChange={(e) => setArticleData({...articleData, headline: e.target.value})} className={inputClass} placeholder="Article Title" />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Image URL</label>
                                <input type="text" value={articleData.image} onChange={(e) => setArticleData({...articleData, image: e.target.value})} className={inputClass} placeholder="https://example.com/image.jpg" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Author Type</label>
                                    <select 
                                        value={articleData.authorType} 
                                        onChange={(e) => setArticleData({...articleData, authorType: e.target.value})} 
                                        className={inputClass}
                                    >
                                        <option value="Person">Person</option>
                                        <option value="Organization">Organization</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Author Name</label>
                                    <input type="text" value={articleData.authorName} onChange={(e) => setArticleData({...articleData, authorName: e.target.value})} className={inputClass} placeholder="John Doe" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Publisher Name</label>
                                    <input type="text" value={articleData.publisherName} onChange={(e) => setArticleData({...articleData, publisherName: e.target.value})} className={inputClass} placeholder="Publisher Brand" />
                                </div>
                                <div>
                                    <label className={labelClass}>Publisher Logo URL</label>
                                    <input type="text" value={articleData.publisherLogo} onChange={(e) => setArticleData({...articleData, publisherLogo: e.target.value})} className={inputClass} placeholder="https://..." />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Date Published</label>
                                    <input type="date" value={articleData.datePublished} onChange={(e) => setArticleData({...articleData, datePublished: e.target.value})} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Date Modified</label>
                                    <input type="date" value={articleData.dateModified} onChange={(e) => setArticleData({...articleData, dateModified: e.target.value})} className={inputClass} />
                                </div>
                            </div>
                        </>
                    )}

                    {/* BREADCRUMB FORM */}
                    {selectedType === 'Breadcrumb' && (
                        <div className="space-y-4">
                            {breadcrumbItems.map((item, idx) => (
                                <div key={idx} className="flex gap-3 items-end">
                                    <div className="flex-1">
                                        <label className={labelClass}>Page Name {idx + 1}</label>
                                        <input 
                                            type="text" 
                                            value={item.name} 
                                            onChange={(e) => {
                                                const newItems = [...breadcrumbItems];
                                                newItems[idx].name = e.target.value;
                                                setBreadcrumbItems(newItems);
                                            }} 
                                            className={inputClass} 
                                            placeholder="Home" 
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className={labelClass}>URL {idx + 1}</label>
                                        <input 
                                            type="text" 
                                            value={item.url} 
                                            onChange={(e) => {
                                                const newItems = [...breadcrumbItems];
                                                newItems[idx].url = e.target.value;
                                                setBreadcrumbItems(newItems);
                                            }} 
                                            className={inputClass} 
                                            placeholder="https://example.com" 
                                        />
                                    </div>
                                    <button 
                                        onClick={() => {
                                            const newItems = breadcrumbItems.filter((_, i) => i !== idx);
                                            setBreadcrumbItems(newItems);
                                        }}
                                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all"
                                        disabled={breadcrumbItems.length === 1}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button 
                                onClick={() => setBreadcrumbItems([...breadcrumbItems, { name: '', url: '' }])}
                                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 mt-2"
                            >
                                <Plus className="w-4 h-4" /> Add Breadcrumb
                            </button>
                        </div>
                    )}

                    {/* EVENT FORM */}
                    {selectedType === 'Event' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Name</label>
                                    <input type="text" value={eventData.name} onChange={(e) => setEventData({...eventData, name: e.target.value})} className={inputClass} placeholder="Concert Name" />
                                </div>
                                <div>
                                    <label className={labelClass}>Event's description</label>
                                    <input type="text" value={eventData.description} onChange={(e) => setEventData({...eventData, description: e.target.value})} className={inputClass} placeholder="Brief description" />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Image URL</label>
                                <input type="text" value={eventData.image} onChange={(e) => setEventData({...eventData, image: e.target.value})} className={inputClass} placeholder="https://..." />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className={labelClass}>Start date</label>
                                        <input type="date" value={eventData.startDate} onChange={(e) => setEventData({...eventData, startDate: e.target.value})} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Start time</label>
                                        <input type="time" value={eventData.startTime} onChange={(e) => setEventData({...eventData, startTime: e.target.value})} className={inputClass} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className={labelClass}>End date</label>
                                        <input type="date" value={eventData.endDate} onChange={(e) => setEventData({...eventData, endDate: e.target.value})} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>End time</label>
                                        <input type="time" value={eventData.endTime} onChange={(e) => setEventData({...eventData, endTime: e.target.value})} className={inputClass} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Event Status</label>
                                    <select value={eventData.eventStatus} onChange={(e) => setEventData({...eventData, eventStatus: e.target.value})} className={inputClass}>
                                        <option value="EventScheduled">EventScheduled</option>
                                        <option value="EventCancelled">EventCancelled</option>
                                        <option value="EventMovedOnline">EventMovedOnline</option>
                                        <option value="EventPostponed">EventPostponed</option>
                                        <option value="EventRescheduled">EventRescheduled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Attendance Mode</label>
                                    <select value={eventData.attendanceMode} onChange={(e) => setEventData({...eventData, attendanceMode: e.target.value})} className={inputClass}>
                                        <option value="OfflineEventAttendanceMode">OfflineEventAttendanceMode</option>
                                        <option value="OnlineEventAttendanceMode">OnlineEventAttendanceMode</option>
                                        <option value="MixedEventAttendanceMode">MixedEventAttendanceMode</option>
                                    </select>
                                </div>
                            </div>

                            {(eventData.attendanceMode !== 'OnlineEventAttendanceMode') && (
                                <div className="grid grid-cols-2 gap-4 bg-brand-light/20 p-3 rounded-lg border border-brand-medium/20">
                                    <div>
                                        <label className={labelClass}>Venue Name</label>
                                        <input type="text" value={eventData.locationName} onChange={(e) => setEventData({...eventData, locationName: e.target.value})} className={inputClass} placeholder="Stadium" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Venue Address</label>
                                        <input type="text" value={eventData.locationAddress} onChange={(e) => setEventData({...eventData, locationAddress: e.target.value})} className={inputClass} placeholder="123 Main St, City" />
                                    </div>
                                </div>
                            )}

                            {(eventData.attendanceMode !== 'OfflineEventAttendanceMode') && (
                                <div>
                                    <label className={labelClass}>Online Event URL</label>
                                    <input type="text" value={eventData.onlineUrl} onChange={(e) => setEventData({...eventData, onlineUrl: e.target.value})} className={inputClass} placeholder="https://zoom.us/..." />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Performer @type</label>
                                    <select value={eventData.performerType} onChange={(e) => setEventData({...eventData, performerType: e.target.value})} className={inputClass}>
                                        <option value="Person">Person</option>
                                        <option value="PerformingGroup">PerformingGroup</option>
                                        <option value="Organization">Organization</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Performer's name</label>
                                    <input type="text" value={eventData.performerName} onChange={(e) => setEventData({...eventData, performerName: e.target.value})} className={inputClass} placeholder="Artist Name" />
                                </div>
                            </div>

                            <div className="space-y-3 pt-2 border-t border-brand-medium/10">
                                <div className="flex justify-between items-end">
                                    <label className={labelClass}>Ticket Types (Offers)</label>
                                </div>
                                {eventData.offers.map((offer, idx) => (
                                    <div key={idx} className="flex gap-2 items-end bg-brand-light/20 p-3 rounded-lg border border-brand-medium/20">
                                        <div className="flex-grow grid grid-cols-2 gap-2">
                                            <input 
                                                type="text" 
                                                value={offer.name} 
                                                onChange={(e) => {
                                                    const newOffers = [...eventData.offers];
                                                    newOffers[idx].name = e.target.value;
                                                    setEventData({...eventData, offers: newOffers});
                                                }} 
                                                className={inputClass} 
                                                placeholder="Ticket Name (e.g. VIP)" 
                                            />
                                            <div className="flex gap-2">
                                                <input 
                                                    type="number" 
                                                    value={offer.price} 
                                                    onChange={(e) => {
                                                        const newOffers = [...eventData.offers];
                                                        newOffers[idx].price = e.target.value;
                                                        setEventData({...eventData, offers: newOffers});
                                                    }} 
                                                    className={inputClass} 
                                                    placeholder="Price" 
                                                />
                                                <select 
                                                    value={offer.currency}
                                                    onChange={(e) => {
                                                        const newOffers = [...eventData.offers];
                                                        newOffers[idx].currency = e.target.value;
                                                        setEventData({...eventData, offers: newOffers});
                                                    }}
                                                    className={`${inputClass} w-24`}
                                                >
                                                    <option value="USD">USD</option>
                                                    <option value="EUR">EUR</option>
                                                    <option value="GBP">GBP</option>
                                                </select>
                                            </div>
                                        </div>
                                        {eventData.offers.length > 1 && (
                                            <button 
                                                onClick={() => {
                                                    const newOffers = eventData.offers.filter((_, i) => i !== idx);
                                                    setEventData({...eventData, offers: newOffers});
                                                }}
                                                className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors h-[42px] flex items-center justify-center border border-transparent hover:border-red-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button 
                                    onClick={() => setEventData({...eventData, offers: [...eventData.offers, { name: '', price: '', currency: 'USD', availability: 'InStock', url: '' }]})}
                                    className="w-full py-3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors shadow-sm"
                                >
                                    <Plus className="w-4 h-4" /> ADD TICKET TYPE
                                </button>
                            </div>
                        </>
                    )}

                    {/* HOW-TO FORM */}
                    {selectedType === 'How-to' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Name</label>
                                    <input type="text" value={howToData.name} onChange={(e) => setHowToData({...howToData, name: e.target.value})} className={inputClass} placeholder="How to tie a tie" />
                                </div>
                                <div>
                                    <label className={labelClass}>Description</label>
                                    <input type="text" value={howToData.description} onChange={(e) => setHowToData({...howToData, description: e.target.value})} className={inputClass} placeholder="Step-by-step guide..." />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Total Time</label>
                                    <div className="flex gap-2">
                                        <input type="text" value={howToData.totalTime.days} onChange={(e) => setHowToData({...howToData, totalTime: {...howToData.totalTime, days: e.target.value}})} className={inputClass} placeholder="Days" />
                                        <input type="text" value={howToData.totalTime.hours} onChange={(e) => setHowToData({...howToData, totalTime: {...howToData.totalTime, hours: e.target.value}})} className={inputClass} placeholder="Hours" />
                                        <input type="text" value={howToData.totalTime.minutes} onChange={(e) => setHowToData({...howToData, totalTime: {...howToData.totalTime, minutes: e.target.value}})} className={inputClass} placeholder="Mins" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Estimated Cost</label>
                                    <div className="flex gap-2">
                                        <select value={howToData.estimatedCost.currency} onChange={(e) => setHowToData({...howToData, estimatedCost: {...howToData.estimatedCost, currency: e.target.value}})} className={`${inputClass} w-24`}>
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="GBP">GBP</option>
                                        </select>
                                        <input type="text" value={howToData.estimatedCost.value} onChange={(e) => setHowToData({...howToData, estimatedCost: {...howToData.estimatedCost, value: e.target.value}})} className={inputClass} placeholder="50" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Image URL</label>
                                <input type="text" value={howToData.image} onChange={(e) => setHowToData({...howToData, image: e.target.value})} className={inputClass} placeholder="https://..." />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-brand-medium/10 pt-4">
                                {/* Supplies */}
                                <div>
                                    <label className="block text-sm font-bold text-brand-dark mb-2 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-brand-medium" /> Supplies
                                    </label>
                                    <div className="space-y-2">
                                        {howToData.supplies.map((supply, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    value={supply} 
                                                    onChange={(e) => {
                                                        const newSupplies = [...howToData.supplies];
                                                        newSupplies[idx] = e.target.value;
                                                        setHowToData({...howToData, supplies: newSupplies});
                                                    }}
                                                    className={inputClass}
                                                    placeholder="Supply Item"
                                                />
                                                {howToData.supplies.length > 1 && (
                                                    <button 
                                                        onClick={() => {
                                                            const newSupplies = howToData.supplies.filter((_, i) => i !== idx);
                                                            setHowToData({...howToData, supplies: newSupplies});
                                                        }}
                                                        className="p-2.5 text-brand-dark/40 hover:text-red-500"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button 
                                            onClick={() => setHowToData({...howToData, supplies: [...howToData.supplies, '']})}
                                            className="w-full py-2 bg-brand-dark text-white text-xs font-bold rounded flex items-center justify-center gap-1 hover:bg-brand-dark/90 transition-colors"
                                        >
                                            <Plus className="w-3 h-3" /> ADD SUPPLY
                                        </button>
                                    </div>
                                </div>

                                {/* Tools */}
                                <div>
                                    <label className="block text-sm font-bold text-brand-dark mb-2 flex items-center gap-2">
                                        <Wrench className="w-4 h-4 text-brand-medium" /> Tools
                                    </label>
                                    <div className="space-y-2">
                                        {howToData.tools.map((tool, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    value={tool} 
                                                    onChange={(e) => {
                                                        const newTools = [...howToData.tools];
                                                        newTools[idx] = e.target.value;
                                                        setHowToData({...howToData, tools: newTools});
                                                    }}
                                                    className={inputClass}
                                                    placeholder="Tool Name"
                                                />
                                                {howToData.tools.length > 1 && (
                                                    <button 
                                                        onClick={() => {
                                                            const newTools = howToData.tools.filter((_, i) => i !== idx);
                                                            setHowToData({...howToData, tools: newTools});
                                                        }}
                                                        className="p-2.5 text-brand-dark/40 hover:text-red-500"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button 
                                            onClick={() => setHowToData({...howToData, tools: [...howToData.tools, '']})}
                                            className="w-full py-2 bg-brand-dark text-white text-xs font-bold rounded flex items-center justify-center gap-1 hover:bg-brand-dark/90 transition-colors"
                                        >
                                            <Plus className="w-3 h-3" /> ADD TOOL
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Steps */}
                            <div className="border-t border-brand-medium/10 pt-4 space-y-4">
                                <label className="block text-sm font-bold text-brand-dark mb-2">Steps</label>
                                {howToData.steps.map((step, idx) => (
                                    <div key={idx} className="bg-brand-light/20 p-4 rounded-lg border border-brand-medium/20 relative">
                                        <button 
                                            onClick={() => {
                                                const newSteps = howToData.steps.filter((_, i) => i !== idx);
                                                setHowToData({...howToData, steps: newSteps});
                                            }}
                                            className="absolute top-2 right-2 p-2 text-brand-dark/40 hover:text-red-500"
                                            disabled={howToData.steps.length === 1}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        
                                        <div className="mb-3">
                                            <label className={labelClass}>Step #{idx + 1}: Instructions</label>
                                            <textarea 
                                                rows={2}
                                                value={step.text} 
                                                onChange={(e) => {
                                                    const newSteps = [...howToData.steps];
                                                    newSteps[idx].text = e.target.value;
                                                    setHowToData({...howToData, steps: newSteps});
                                                }} 
                                                className={inputClass} 
                                                placeholder="Explain this step..." 
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="col-span-1">
                                                <label className={labelClass}>Image URL</label>
                                                <input 
                                                    type="text" 
                                                    value={step.image} 
                                                    onChange={(e) => {
                                                        const newSteps = [...howToData.steps];
                                                        newSteps[idx].image = e.target.value;
                                                        setHowToData({...howToData, steps: newSteps});
                                                    }} 
                                                    className={inputClass} 
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <label className={labelClass}>Name</label>
                                                <input 
                                                    type="text" 
                                                    value={step.name} 
                                                    onChange={(e) => {
                                                        const newSteps = [...howToData.steps];
                                                        newSteps[idx].name = e.target.value;
                                                        setHowToData({...howToData, steps: newSteps});
                                                    }} 
                                                    className={inputClass} 
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <label className={labelClass}>URL</label>
                                                <input 
                                                    type="text" 
                                                    value={step.url} 
                                                    onChange={(e) => {
                                                        const newSteps = [...howToData.steps];
                                                        newSteps[idx].url = e.target.value;
                                                        setHowToData({...howToData, steps: newSteps});
                                                    }} 
                                                    className={inputClass} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button 
                                    onClick={() => setHowToData({...howToData, steps: [...howToData.steps, { name: '', text: '', image: '', url: '' }]})}
                                    className="w-full py-3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors shadow-sm"
                                >
                                    <Plus className="w-4 h-4" /> ADD STEP
                                </button>
                            </div>
                        </>
                    )}

                    {/* FAQ FORM */}
                    {selectedType === 'FAQ Page' && (
                        <div className="space-y-4">
                            {faqItems.map((item, idx) => (
                                <div key={idx} className="bg-brand-light/20 p-4 rounded-lg border border-brand-medium/20 relative group">
                                    <button 
                                        onClick={() => {
                                            const newItems = faqItems.filter((_, i) => i !== idx);
                                            setFaqItems(newItems);
                                        }}
                                        className="absolute top-2 right-2 p-2 text-brand-dark/40 hover:text-red-500 rounded-full hover:bg-red-50 transition-all"
                                        disabled={faqItems.length === 1}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="mb-3">
                                        <label className={labelClass}>Question {idx + 1}</label>
                                        <input 
                                            type="text" 
                                            value={item.question} 
                                            onChange={(e) => {
                                                const newItems = [...faqItems];
                                                newItems[idx].question = e.target.value;
                                                setFaqItems(newItems);
                                            }} 
                                            className={inputClass} 
                                            placeholder="What is your return policy?" 
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Answer {idx + 1}</label>
                                        <textarea 
                                            rows={2}
                                            value={item.answer} 
                                            onChange={(e) => {
                                                const newItems = [...faqItems];
                                                newItems[idx].answer = e.target.value;
                                                setFaqItems(newItems);
                                            }} 
                                            className={inputClass} 
                                            placeholder="We accept returns within 30 days..." 
                                        />
                                    </div>
                                </div>
                            ))}
                            <button 
                                onClick={() => setFaqItems([...faqItems, { question: '', answer: '' }])}
                                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 w-full justify-center py-3 border border-dashed border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add Question
                            </button>
                        </div>
                    )}

                    {/* LOCAL BUSINESS FORM */}
                    {selectedType === 'Local Business' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>LocalBusiness @type</label>
                                    <select 
                                        value={localBusinessData.type} 
                                        onChange={(e) => setLocalBusinessData({...localBusinessData, type: e.target.value})} 
                                        className={inputClass}
                                    >
                                        <option value="LocalBusiness">LocalBusiness</option>
                                        <option value="Restaurant">Restaurant</option>
                                        <option value="Store">Store</option>
                                        <option value="Dentist">Dentist</option>
                                        <option value="RealEstateAgent">RealEstateAgent</option>
                                        <option value="MedicalClinic">MedicalClinic</option>
                                        <option value="LegalService">LegalService</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>More specific @type</label>
                                    <input type="text" className={inputClass} placeholder="e.g. ItalianRestaurant" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className={labelClass}>Name</label>
                                    <input type="text" value={localBusinessData.name} onChange={(e) => setLocalBusinessData({...localBusinessData, name: e.target.value})} className={inputClass} placeholder="Business Name" />
                                </div>
                                <div>
                                    <label className={labelClass}>Image URL</label>
                                    <input type="text" value={localBusinessData.image} onChange={(e) => setLocalBusinessData({...localBusinessData, image: e.target.value})} className={inputClass} placeholder="https://..." />
                                </div>
                                <div>
                                    <label className={labelClass}>@id (URL)</label>
                                    <input type="text" value={localBusinessData.id} onChange={(e) => setLocalBusinessData({...localBusinessData, id: e.target.value})} className={inputClass} placeholder="https://site.com/#local" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className={labelClass}>URL</label>
                                    <input type="text" value={localBusinessData.url} onChange={(e) => setLocalBusinessData({...localBusinessData, url: e.target.value})} className={inputClass} placeholder="https://site.com" />
                                </div>
                                <div>
                                    <label className={labelClass}>Phone</label>
                                    <input type="text" value={localBusinessData.telephone} onChange={(e) => setLocalBusinessData({...localBusinessData, telephone: e.target.value})} className={inputClass} placeholder="+1-555-555-5555" />
                                </div>
                                <div>
                                    <label className={labelClass}>Price Range</label>
                                    <input type="text" value={localBusinessData.priceRange} onChange={(e) => setLocalBusinessData({...localBusinessData, priceRange: e.target.value})} className={inputClass} placeholder="$$" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className={labelClass}>Street</label>
                                    <input type="text" value={localBusinessData.streetAddress} onChange={(e) => setLocalBusinessData({...localBusinessData, streetAddress: e.target.value})} className={inputClass} placeholder="123 Main St" />
                                </div>
                                <div>
                                    <label className={labelClass}>City</label>
                                    <input type="text" value={localBusinessData.addressLocality} onChange={(e) => setLocalBusinessData({...localBusinessData, addressLocality: e.target.value})} className={inputClass} placeholder="New York" />
                                </div>
                                <div>
                                    <label className={labelClass}>Zip code</label>
                                    <input type="text" value={localBusinessData.postalCode} onChange={(e) => setLocalBusinessData({...localBusinessData, postalCode: e.target.value})} className={inputClass} placeholder="10001" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Country</label>
                                    <select value={localBusinessData.addressCountry} onChange={(e) => setLocalBusinessData({...localBusinessData, addressCountry: e.target.value})} className={inputClass}>
                                        <option value="US">United States</option>
                                        <option value="CA">Canada</option>
                                        <option value="GB">United Kingdom</option>
                                        <option value="AU">Australia</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>State/Province/Region</label>
                                    <input type="text" value={localBusinessData.addressRegion} onChange={(e) => setLocalBusinessData({...localBusinessData, addressRegion: e.target.value})} className={inputClass} placeholder="NY" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 items-end">
                                <div>
                                    <label className={labelClass}>Latitude</label>
                                    <input type="text" value={localBusinessData.latitude} onChange={(e) => setLocalBusinessData({...localBusinessData, latitude: e.target.value})} className={inputClass} placeholder="40.7128" />
                                </div>
                                <div>
                                    <label className={labelClass}>Longitude</label>
                                    <input type="text" value={localBusinessData.longitude} onChange={(e) => setLocalBusinessData({...localBusinessData, longitude: e.target.value})} className={inputClass} placeholder="-74.0060" />
                                </div>
                                <button onClick={handleGeoLocation} className="px-4 py-2.5 bg-brand-medium/20 hover:bg-brand-medium/30 text-brand-dark text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 border border-brand-medium/30 h-[42px]">
                                    <Navigation className="w-3 h-3" /> GEO COORD
                                </button>
                            </div>

                            <div className="pt-4 border-t border-brand-medium/10">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-sm font-bold text-brand-dark flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-brand-medium" /> Opening Hours
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={localBusinessData.open247} onChange={(e) => setLocalBusinessData({...localBusinessData, open247: e.target.checked})} className="w-4 h-4 rounded border-brand-medium text-blue-600 focus:ring-blue-500" />
                                        <span className="text-xs font-medium text-brand-dark/70">Open 24/7</span>
                                    </label>
                                </div>
                                
                                {!localBusinessData.open247 && (
                                    <div className="space-y-3">
                                        {localBusinessData.openingHours.map((oh, idx) => (
                                            <div key={idx} className="p-3 bg-brand-light/20 border border-brand-medium/20 rounded-lg relative">
                                                {localBusinessData.openingHours.length > 1 && (
                                                    <button 
                                                        onClick={() => {
                                                            const newHours = localBusinessData.openingHours.filter((_, i) => i !== idx);
                                                            setLocalBusinessData({...localBusinessData, openingHours: newHours});
                                                        }}
                                                        className="absolute top-2 right-2 text-brand-dark/40 hover:text-red-500"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {daysOfWeek.map(day => (
                                                        <button 
                                                            key={day}
                                                            onClick={() => {
                                                                const newHours = [...localBusinessData.openingHours];
                                                                if (newHours[idx].days.includes(day)) {
                                                                    newHours[idx].days = newHours[idx].days.filter(d => d !== day);
                                                                } else {
                                                                    newHours[idx].days = [...newHours[idx].days, day];
                                                                }
                                                                setLocalBusinessData({...localBusinessData, openingHours: newHours});
                                                            }}
                                                            className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${oh.days.includes(day) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-brand-dark border-brand-medium/30 hover:border-brand-medium/60'}`}
                                                        >
                                                            {day.substring(0, 3)}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1">
                                                        <label className="text-[10px] font-bold text-brand-dark/50 uppercase mb-1 block">Opens</label>
                                                        <input type="time" value={oh.opens} onChange={(e) => {
                                                            const newHours = [...localBusinessData.openingHours];
                                                            newHours[idx].opens = e.target.value;
                                                            setLocalBusinessData({...localBusinessData, openingHours: newHours});
                                                        }} className={inputClass} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-[10px] font-bold text-brand-dark/50 uppercase mb-1 block">Closes</label>
                                                        <input type="time" value={oh.closes} onChange={(e) => {
                                                            const newHours = [...localBusinessData.openingHours];
                                                            newHours[idx].closes = e.target.value;
                                                            setLocalBusinessData({...localBusinessData, openingHours: newHours});
                                                        }} className={inputClass} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button 
                                            onClick={() => setLocalBusinessData({...localBusinessData, openingHours: [...localBusinessData.openingHours, { days: [], opens: '', closes: '' }]})}
                                            className="w-full py-2 bg-brand-dark text-white text-xs font-bold rounded flex items-center justify-center gap-1 hover:bg-brand-dark/90 transition-colors"
                                        >
                                            <Plus className="w-3 h-3" /> ADD OPENING HOURS
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-brand-medium/10">
                                <label className="block text-sm font-bold text-brand-dark mb-2 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-brand-medium" /> Social Profiles
                                </label>
                                <div className="space-y-2">
                                    {localBusinessData.socialProfiles.map((profile, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={profile} 
                                                onChange={(e) => {
                                                    const newProfiles = [...localBusinessData.socialProfiles];
                                                    newProfiles[idx] = e.target.value;
                                                    setLocalBusinessData({...localBusinessData, socialProfiles: newProfiles});
                                                }}
                                                className={inputClass}
                                                placeholder="https://facebook.com/..."
                                            />
                                            {localBusinessData.socialProfiles.length > 1 && (
                                                <button 
                                                    onClick={() => {
                                                        const newProfiles = localBusinessData.socialProfiles.filter((_, i) => i !== idx);
                                                        setLocalBusinessData({...localBusinessData, socialProfiles: newProfiles});
                                                    }}
                                                    className="p-2.5 text-brand-dark/40 hover:text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setLocalBusinessData({...localBusinessData, socialProfiles: [...localBusinessData.socialProfiles, '']})}
                                            className="w-full py-2 bg-brand-dark text-white text-xs font-bold rounded flex items-center justify-center gap-1 hover:bg-brand-dark/90 transition-colors"
                                        >
                                            <Plus className="w-3 h-3" /> ADD SOCIAL PROFILE
                                        </button>
                                        <button 
                                            className="w-full py-2 bg-brand-dark text-white text-xs font-bold rounded flex items-center justify-center gap-1 hover:bg-brand-dark/90 transition-colors"
                                        >
                                            <Plus className="w-3 h-3" /> ADD DEPARTMENT
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ORGANIZATION FORM */}
                    {selectedType === 'Organization' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Organization @type</label>
                                    <select
                                        value={orgData.type}
                                        onChange={(e) => setOrgData({...orgData, type: e.target.value})}
                                        className={inputClass}
                                    >
                                        <option value="Organization">Organization</option>
                                        <option value="Corporation">Corporation</option>
                                        <option value="Airline">Airline</option>
                                        <option value="Consortium">Consortium</option>
                                        <option value="EducationalOrganization">EducationalOrganization</option>
                                        <option value="FundingScheme">FundingScheme</option>
                                        <option value="GovernmentOrganization">GovernmentOrganization</option>
                                        <option value="LibrarySystem">LibrarySystem</option>
                                        <option value="MedicalOrganization">MedicalOrganization</option>
                                        <option value="NGO">NGO</option>
                                        <option value="NewsMediaOrganization">NewsMediaOrganization</option>
                                        <option value="PerformingGroup">PerformingGroup</option>
                                        <option value="Project">Project</option>
                                        <option value="SportsOrganization">SportsOrganization</option>
                                        <option value="WorkersUnion">WorkersUnion</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>More specific @type</label>
                                    <input
                                        type="text"
                                        value={orgData.specificType}
                                        onChange={(e) => setOrgData({...orgData, specificType: e.target.value})}
                                        className={inputClass}
                                        placeholder="e.g. DentalClinic"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Name</label>
                                    <input
                                        type="text"
                                        value={orgData.name}
                                        onChange={(e) => setOrgData({...orgData, name: e.target.value})}
                                        className={inputClass}
                                        placeholder="Google"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Alternate Name</label>
                                    <input
                                        type="text"
                                        value={orgData.alternateName}
                                        onChange={(e) => setOrgData({...orgData, alternateName: e.target.value})}
                                        className={inputClass}
                                        placeholder="Alphabet"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>URL</label>
                                    <input
                                        type="text"
                                        value={orgData.url}
                                        onChange={(e) => setOrgData({...orgData, url: e.target.value})}
                                        className={inputClass}
                                        placeholder="https://www.google.com"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Logo URL</label>
                                    <input
                                        type="text"
                                        value={orgData.logo}
                                        onChange={(e) => setOrgData({...orgData, logo: e.target.value})}
                                        className={inputClass}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            {/* Contact Points */}
                            <div className="border-t border-brand-medium/10 pt-4 space-y-3">
                                <label className="block text-sm font-bold text-brand-dark mb-2 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-brand-medium" /> Contact Points
                                </label>
                                {orgData.contactPoints.map((cp, idx) => (
                                    <div key={idx} className="bg-brand-light/20 p-4 rounded-lg border border-brand-medium/20 relative">
                                        <button
                                            onClick={() => {
                                                const newCP = orgData.contactPoints.filter((_, i) => i !== idx);
                                                setOrgData({...orgData, contactPoints: newCP});
                                            }}
                                            className="absolute top-2 right-2 text-brand-dark/40 hover:text-red-500"
                                            disabled={orgData.contactPoints.length === 0} 
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            <div>
                                                <label className={labelClass}>Telephone</label>
                                                <input
                                                    type="text"
                                                    value={cp.telephone}
                                                    onChange={(e) => {
                                                        const newCP = [...orgData.contactPoints];
                                                        newCP[idx].telephone = e.target.value;
                                                        setOrgData({...orgData, contactPoints: newCP});
                                                    }}
                                                    className={inputClass}
                                                    placeholder="+1-800-555-1212"
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Contact Type</label>
                                                <select
                                                    value={cp.contactType}
                                                    onChange={(e) => {
                                                        const newCP = [...orgData.contactPoints];
                                                        newCP[idx].contactType = e.target.value;
                                                        setOrgData({...orgData, contactPoints: newCP});
                                                    }}
                                                    className={inputClass}
                                                >
                                                    <option value="Customer Service">Customer Service</option>
                                                    <option value="Technical Support">Technical Support</option>
                                                    <option value="Billing Support">Billing Support</option>
                                                    <option value="Sales">Sales</option>
                                                    <option value="Reservations">Reservations</option>
                                                    <option value="Credit Card Support">Credit Card Support</option>
                                                    <option value="Emergency">Emergency</option>
                                                    <option value="Baggage Tracking">Baggage Tracking</option>
                                                    <option value="Roadside Assistance">Roadside Assistance</option>
                                                    <option value="Package Tracking">Package Tracking</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className={labelClass}>Email (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={cp.email}
                                                    onChange={(e) => {
                                                        const newCP = [...orgData.contactPoints];
                                                        newCP[idx].email = e.target.value;
                                                        setOrgData({...orgData, contactPoints: newCP});
                                                    }}
                                                    className={inputClass}
                                                    placeholder="support@..."
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Area Served (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={cp.areaServed}
                                                    onChange={(e) => {
                                                        const newCP = [...orgData.contactPoints];
                                                        newCP[idx].areaServed = e.target.value;
                                                        setOrgData({...orgData, contactPoints: newCP});
                                                    }}
                                                    className={inputClass}
                                                    placeholder="US, GB"
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Language (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={cp.availableLanguage}
                                                    onChange={(e) => {
                                                        const newCP = [...orgData.contactPoints];
                                                        newCP[idx].availableLanguage = e.target.value;
                                                        setOrgData({...orgData, contactPoints: newCP});
                                                    }}
                                                    className={inputClass}
                                                    placeholder="English"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setOrgData({...orgData, contactPoints: [...orgData.contactPoints, { telephone: '', contactType: 'Customer Service', email: '', areaServed: '', availableLanguage: '' }]})}
                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Plus className="w-3 h-3" /> ADD CONTACT POINT
                                </button>
                            </div>

                            <div className="pt-4 border-t border-brand-medium/10">
                                <label className="block text-sm font-bold text-brand-dark mb-2 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-brand-medium" /> Social Profiles
                                </label>
                                <div className="space-y-2">
                                    {orgData.socialProfiles.map((url, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={url}
                                                onChange={(e) => {
                                                    const newProfiles = [...orgData.socialProfiles];
                                                    newProfiles[idx] = e.target.value;
                                                    setOrgData({...orgData, socialProfiles: newProfiles});
                                                }}
                                                className={inputClass}
                                                placeholder="https://facebook.com/..."
                                            />
                                            {orgData.socialProfiles.length > 1 && (
                                                <button
                                                    onClick={() => {
                                                        const newProfiles = orgData.socialProfiles.filter((_, i) => i !== idx);
                                                        setOrgData({...orgData, socialProfiles: newProfiles});
                                                    }}
                                                    className="p-2.5 text-brand-dark/40 hover:text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setOrgData({...orgData, socialProfiles: [...orgData.socialProfiles, '']})}
                                        className="w-full py-2 bg-brand-dark text-white text-xs font-bold rounded flex items-center justify-center gap-1 hover:bg-brand-dark/90 transition-colors"
                                    >
                                        <Plus className="w-3 h-3" /> ADD SOCIAL PROFILE
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* PRODUCT FORM */}
                    {selectedType === 'Product' && (
                        <>
                            <div>
                                <label className={labelClass}>Name</label>
                                <input type="text" value={productData.name} onChange={(e) => setProductData({...productData, name: e.target.value})} className={inputClass} placeholder="Executive Leather Chair" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Image URL</label>
                                    <input type="text" value={productData.image} onChange={(e) => setProductData({...productData, image: e.target.value})} className={inputClass} placeholder="https://..." />
                                </div>
                                <div>
                                    <label className={labelClass}>Brand</label>
                                    <input type="text" value={productData.brand} onChange={(e) => setProductData({...productData, brand: e.target.value})} className={inputClass} placeholder="Acme" />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Description</label>
                                <textarea rows={2} value={productData.description} onChange={(e) => setProductData({...productData, description: e.target.value})} className={inputClass} placeholder="Product description..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>SKU</label>
                                    <input type="text" value={productData.sku} onChange={(e) => setProductData({...productData, sku: e.target.value})} className={inputClass} placeholder="12345" />
                                </div>
                                <div>
                                    <label className={labelClass}>Availability</label>
                                    <select 
                                        value={productData.availability} 
                                        onChange={(e) => setProductData({...productData, availability: e.target.value})} 
                                        className={inputClass}
                                    >
                                        <option value="InStock">In Stock</option>
                                        <option value="OutOfStock">Out of Stock</option>
                                        <option value="PreOrder">PreOrder</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Price</label>
                                    <input type="number" value={productData.price} onChange={(e) => setProductData({...productData, price: e.target.value})} className={inputClass} placeholder="99.99" />
                                </div>
                                <div>
                                    <label className={labelClass}>Currency</label>
                                    <input type="text" value={productData.priceCurrency} onChange={(e) => setProductData({...productData, priceCurrency: e.target.value})} className={inputClass} placeholder="USD" />
                                </div>
                            </div>
                        </>
                    )}

                    {/* VIDEO FORM */}
                    {selectedType === 'Video' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Name</label>
                                    <input 
                                        type="text" 
                                        value={videoData.name} 
                                        onChange={(e) => setVideoData({...videoData, name: e.target.value})} 
                                        className={inputClass} 
                                        placeholder="Video Title" 
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Video's Description</label>
                                    <textarea 
                                        rows={1}
                                        value={videoData.description} 
                                        onChange={(e) => setVideoData({...videoData, description: e.target.value})} 
                                        className={`${inputClass} resize-none`} 
                                        placeholder="Brief description..." 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 items-end">
                                <div>
                                    <label className={labelClass}>Upload Date</label>
                                    <div className="relative">
                                        <input 
                                            type="date" 
                                            value={videoData.uploadDate} 
                                            onChange={(e) => setVideoData({...videoData, uploadDate: e.target.value})} 
                                            className={inputClass} 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Minutes</label>
                                    <input 
                                        type="number" 
                                        value={videoData.duration.minutes} 
                                        onChange={(e) => setVideoData({...videoData, duration: {...videoData.duration, minutes: e.target.value}})} 
                                        className={inputClass} 
                                        placeholder="M" 
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Seconds</label>
                                    <input 
                                        type="number" 
                                        value={videoData.duration.seconds} 
                                        onChange={(e) => setVideoData({...videoData, duration: {...videoData.duration, seconds: e.target.value}})} 
                                        className={inputClass} 
                                        placeholder="S" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className={labelClass}>Thumbnail URLs</label>
                                {videoData.thumbnailUrls.map((url, idx) => (
                                    <div key={idx} className="flex gap-2 relative">
                                        <input 
                                            type="text" 
                                            value={url} 
                                            onChange={(e) => {
                                                const newUrls = [...videoData.thumbnailUrls];
                                                newUrls[idx] = e.target.value;
                                                setVideoData({...videoData, thumbnailUrls: newUrls});
                                            }} 
                                            className={inputClass} 
                                            placeholder="https://..." 
                                        />
                                        {videoData.thumbnailUrls.length > 1 && (
                                            <button 
                                                onClick={() => {
                                                    const newUrls = videoData.thumbnailUrls.filter((_, i) => i !== idx);
                                                    setVideoData({...videoData, thumbnailUrls: newUrls});
                                                }}
                                                className="p-2.5 text-brand-dark/40 hover:text-red-500 absolute right-0 top-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <button 
                                    onClick={() => setVideoData({...videoData, thumbnailUrls: [...videoData.thumbnailUrls, '']})}
                                    className="px-4 py-2.5 bg-brand-dark text-white text-xs font-bold rounded flex items-center justify-center gap-2 hover:bg-brand-dark/90 transition-colors"
                                >
                                    <Plus className="w-3 h-3" /> IMAGE
                                </button>
                                <input 
                                    type="text" 
                                    value={videoData.contentUrl} 
                                    onChange={(e) => setVideoData({...videoData, contentUrl: e.target.value})} 
                                    className={inputClass} 
                                    placeholder="Content URL (e.g. .mp4)" 
                                />
                                <input 
                                    type="text" 
                                    value={videoData.embedUrl} 
                                    onChange={(e) => setVideoData({...videoData, embedUrl: e.target.value})} 
                                    className={inputClass} 
                                    placeholder="Embed URL" 
                                />
                            </div>

                            <div>
                                <label className={labelClass}>SeekToAction Target URL</label>
                                <input 
                                    type="text" 
                                    value={videoData.seekToActionTargetUrl} 
                                    onChange={(e) => setVideoData({...videoData, seekToActionTargetUrl: e.target.value})} 
                                    className={inputClass} 
                                    placeholder="https://site.com/video?t=" 
                                />
                            </div>
                        </>
                    )}

                    {/* WEBSITE FORM */}
                    {selectedType === 'Website' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Website's Name</label>
                                    <input type="text" value={websiteData.name} onChange={(e) => setWebsiteData({...websiteData, name: e.target.value})} className={inputClass} placeholder="Site Name" />
                                </div>
                                <div>
                                    <label className={labelClass}>URL</label>
                                    <input type="text" value={websiteData.url} onChange={(e) => setWebsiteData({...websiteData, url: e.target.value})} className={inputClass} placeholder="https://www.example.com" />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Internal site search URL (e.g. https://example.com/search?q=)</label>
                                <input type="text" value={websiteData.internalSearchUrl} onChange={(e) => setWebsiteData({...websiteData, internalSearchUrl: e.target.value})} className={inputClass} placeholder="https://www.example.com/search?q=" />
                            </div>
                            <div>
                                <label className={labelClass}>Optional: string in the search URL after the query</label>
                                <input type="text" value={websiteData.searchQuerySuffix} onChange={(e) => setWebsiteData({...websiteData, searchQuerySuffix: e.target.value})} className={inputClass} placeholder="&src=typo" />
                            </div>
                        </>
                    )}
                 </div>
             )}
          </div>

          {/* Right: JSON-LD Preview */}
          <div className="w-full lg:w-1/2">
             <div className="sticky top-24">
                <div className="bg-[#1E1E1E] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden flex flex-col">
                    
                    {/* Code Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#252526]">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1.5 mr-4">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            </div>
                            <span className="text-gray-400 text-xs font-mono">json-ld-markup.json</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={testInGoogle} 
                                className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                title="Test in Google Rich Results"
                            >
                                <ExternalLink className="w-3.5 h-3.5" /> Test
                            </button>
                            <button 
                                onClick={copyToClipboard} 
                                className="magic-btn"
                            >
                                <div className="magic-btn-content px-3 py-1.5 text-xs">
                                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? 'Copied' : 'Copy'}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Code Body */}
                    <div className="p-6 overflow-x-auto custom-scrollbar bg-[#1E1E1E] min-h-[400px]">
                        <pre className="font-mono text-sm leading-relaxed">
                            <code className="text-gray-300">
{`<script type="application/ld+json">
${jsonLd}
</script>`}
                            </code>
                        </pre>
                    </div>
                </div>

                <div className="mt-6 bg-brand-surface border border-brand-medium/30 rounded-xl p-6">
                    <h4 className="text-sm font-bold text-brand-dark mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-500" />
                        How to use this Schema?
                    </h4>
                    <p className="text-sm text-brand-dark/70 mb-4">
                        Copy the JSON-LD code above and paste it into the <code className="bg-brand-light px-1.5 py-0.5 rounded text-brand-dark font-mono text-xs">&lt;head&gt;</code> or <code className="bg-brand-light px-1.5 py-0.5 rounded text-brand-dark font-mono text-xs">&lt;body&gt;</code> section of your HTML document.
                    </p>
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 rounded-lg text-xs text-yellow-800 dark:text-yellow-200">
                        <div className="mt-0.5 min-w-[16px]">⚠️</div>
                        <p>Always validate your code using the "Test" button (Google Rich Results Test) before deploying to your live site.</p>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SchemaMarkupGenerator;
