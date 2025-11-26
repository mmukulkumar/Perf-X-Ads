import React, { useState } from 'react';
import { Search, Globe, Star, RefreshCw, Smartphone, Monitor, Sparkles, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";



const GoogleSerpSimulator = () => {
  const [inputs, setInputs] = useState({
    url: 'www.example.com',
    title: 'Page Title | Brand Name',
    description: 'This is an example meta description that will appear in search results. Keep it between 150-160 characters for optimal display.',
    searchQuery: '',
    device: 'mobile',
    maxLength: 160,
    showDate: false,
    showRating: false,
    showFavicon: true,
  });

  

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiContext, setAiContext] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = e.target.checked;
    
    setInputs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setInputs({
      url: 'www.example.com',
      title: 'Page Title | Brand Name',
      description: 'This is an example meta description that will appear in search results. Keep it between 150-160 characters for optimal display.',
      searchQuery: '',
      device: 'mobile',
      maxLength: 160,
      showDate: false,
      showRating: false,
      showFavicon: true,
    });
    setAiContext('');
    setShowAiInput(false);
  };

  const apiKey = import.meta.env.VITE_API_KEY;

  const handleAiGenerate = async () => {
    if (apiKey) {
        alert("API Key not configured.");
        return;
    }
    if (!aiContext) return;

    setIsGenerating(true);
    try {
        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-2.5-flash';
        
        const prompt = `
            Generate an SEO-optimized Page Title and Meta Description for the following topic/content: "${aiContext}".
            
            Guidelines (RAG Context):
            - Title: Max 60 characters. Include the main keyword near the beginning. Compelling and clickable.
            - Description: Max 155 characters. actionable, summary of page content, includes call to action or value prop.
            - Format: Return strictly JSON with keys "title" and "description".
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        const text = response.text;
        if (text) {
            const data = JSON.parse(text);
            setInputs(prev => ({
                ...prev,
                title: data.title || prev.title,
                description: data.description || prev.description,
                searchQuery: aiContext // Optional: set search query to context
            }));
        }
    } catch (error) {
        console.error("AI Generation failed:", error);
        alert("Failed to generate content. Please try again.");
    } finally {
        setIsGenerating(false);
        setShowAiInput(false);
    }
  };

  // Helper to highlight search terms
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? <b key={i}>{part}</b> : part
        )}
      </>
    );
  };

  const truncatedDescription = inputs.description.length > inputs.maxLength 
    ? inputs.description.substring(0, inputs.maxLength) + ' ...' 
    : inputs.description;

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Input Section */}
          <div className="w-full lg:w-1/2 bg-brand-surface p-6 md:p-8 rounded-2xl border border-brand-medium/30 shadow-sm h-fit">
             <div className="flex justify-between items-center mb-6 border-b border-brand-medium/10 pb-4">
                <h3 className="font-bold text-lg text-brand-dark">Snippet Editor</h3>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowAiInput(!showAiInput)} 
                        className={`text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${showAiInput ? 'bg-purple-100 text-purple-700' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}`}
                    >
                        <Sparkles className="w-3 h-3" /> AI Auto-Fill
                    </button>
                    <button onClick={resetForm} className="text-xs font-medium text-brand-dark/60 hover:text-brand-dark flex items-center gap-1 px-3 py-1.5 rounded-lg border border-transparent hover:bg-brand-light transition-colors">
                       <RefreshCw className="w-3 h-3" /> Reset
                    </button>
                </div>
             </div>

             {showAiInput && (
                 <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800 animate-in fade-in slide-in-from-top-2">
                     <label className="block text-xs font-bold text-purple-800 dark:text-purple-300 uppercase mb-2 flex items-center gap-2">
                         <Bot className="w-3.5 h-3.5" />
                         What is this page about?
                     </label>
                     <div className="flex gap-2">
                         <input 
                            type="text" 
                            value={aiContext} 
                            onChange={(e) => setAiContext(e.target.value)}
                            placeholder="e.g. Best vegan chocolate chip cookies recipe" 
                            className="flex-1 px-3 py-2 bg-white dark:bg-brand-surface border border-purple-200 dark:border-purple-700 rounded-lg text-sm focus:ring-2 focus:ring-purple-500/20 outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                         />
                         <button 
                            onClick={handleAiGenerate} 
                            disabled={isGenerating || !aiContext}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                         >
                             {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                             Generate
                         </button>
                     </div>
                 </div>
             )}

             <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5">URL</label>
                       <input type="text" name="url" value={inputs.url} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" placeholder="https://www.example.com/page" />
                    </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5">Page Title</label>
                   <div className="relative">
                       <input type="text" name="title" value={inputs.title} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" placeholder="Page Title" />
                       <span className={`absolute right-3 top-2.5 text-xs ${inputs.title.length > 60 ? 'text-red-500 font-bold' : 'text-brand-dark/40'}`}>{inputs.title.length} / 60</span>
                   </div>
                   <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                        <div className={`h-full ${inputs.title.length > 60 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min((inputs.title.length / 60) * 100, 100)}%` }}></div>
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5">Meta Description</label>
                   <div className="relative">
                       <textarea name="description" rows={4} value={inputs.description} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm resize-none" placeholder="Meta description..." />
                       <span className={`absolute right-3 bottom-3 text-xs ${inputs.description.length > inputs.maxLength ? 'text-red-500 font-bold' : 'text-brand-dark/40'}`}>{inputs.description.length} / {inputs.maxLength}</span>
                   </div>
                   <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                        <div className={`h-full ${inputs.description.length > inputs.maxLength ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min((inputs.description.length / inputs.maxLength) * 100, 100)}%` }}></div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5">Search Query (for highlighting)</label>
                        <input type="text" name="searchQuery" value={inputs.searchQuery} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" placeholder="keyword" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5">Max Description Length</label>
                        <input type="number" name="maxLength" value={inputs.maxLength} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" />
                    </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-4 border-t border-brand-medium/10">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" name="showDate" checked={inputs.showDate} onChange={handleInputChange} className="w-4 h-4 rounded border-brand-medium text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-brand-dark">Show Date</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" name="showRating" checked={inputs.showRating} onChange={handleInputChange} className="w-4 h-4 rounded border-brand-medium text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-brand-dark">Show Rating</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" name="showFavicon" checked={inputs.showFavicon} onChange={handleInputChange} className="w-4 h-4 rounded border-brand-medium text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-brand-dark">Show Favicon</span>
                    </label>
                </div>
             </div>
          </div>

          {/* Preview Section */}
          <div className="w-full lg:w-1/2">
             <div className="sticky top-24">
                <div className="flex justify-center mb-6">
                    <div className="bg-brand-surface border border-brand-medium/20 p-1 rounded-lg inline-flex shadow-sm">
                        <button 
                            onClick={() => setInputs(prev => ({ ...prev, device: 'mobile' }))} 
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${inputs.device === 'mobile' ? 'bg-brand-light text-blue-600 shadow-sm' : 'text-brand-dark/60 hover:text-brand-dark'}`}
                        >
                            <Smartphone className="w-4 h-4" /> Mobile
                        </button>
                        <button 
                            onClick={() => setInputs(prev => ({ ...prev, device: 'desktop' }))} 
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${inputs.device === 'desktop' ? 'bg-brand-light text-blue-600 shadow-sm' : 'text-brand-dark/60 hover:text-brand-dark'}`}
                        >
                            <Monitor className="w-4 h-4" /> Desktop
                        </button>
                    </div>
                </div>

                <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200 mx-auto transition-all duration-300 ${inputs.device === 'mobile' ? 'max-w-[375px]' : 'max-w-[600px]'}`}>
                    
                    {/* SERP Item */}
                    <div className="font-arial text-left">
                        {/* URL / Breadcrumb */}
                        <div className="flex items-center gap-3 mb-1">
                            {inputs.showFavicon && (
                                <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
                                    <Globe className="w-4 h-4 text-gray-500" />
                                </div>
                            )}
                            <div className="flex flex-col justify-center">
                                <span className="text-xs text-gray-900 leading-tight font-medium">{inputs.url.replace(/^https?:\/\//, '').split('/')[0]}</span>
                                <span className="text-xs text-gray-500 leading-tight">{inputs.url}</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-[20px] leading-[1.3] text-[#1a0dab] hover:underline cursor-pointer mb-1">
                            {inputs.title || 'Page Title'}
                        </h3>

                        {/* Meta Description & Rich Snippets */}
                        <div className="text-[14px] leading-[1.58] text-[#4d5156]">
                            {inputs.showDate && <span className="text-gray-500 mr-2">Oct 28, 2025 —</span>}
                            {inputs.showRating && (
                                <div className="flex items-center gap-1 mb-1">
                                    <div className="flex text-yellow-500">
                                        {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                                    </div>
                                    <span className="text-gray-500 text-xs">4.8 (150)</span>
                                </div>
                            )}
                            <span className="break-words">
                                {highlightText(truncatedDescription, inputs.searchQuery)}
                            </span>
                        </div>
                    </div>

                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleSerpSimulator;