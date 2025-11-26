
import React, { useState } from 'react';
import { Layout, Download, RefreshCw, Smartphone, Monitor, Info, MoreVertical } from 'lucide-react';

const GoogleAdMockup = () => {
  const [inputs, setInputs] = useState({
    finalUrl: 'https://www.example.com/landing-page',
    headline1: 'High Quality Service',
    headline2: 'Best Prices Guaranteed',
    headline3: 'Book Now & Save',
    path1: 'services',
    path2: 'sale',
    description1: 'Get the best service in town with our award-winning team. 24/7 support available.',
    description2: 'Trusted by over 10,000 customers. Call us today for a free quote.',
    sitelinks: [
      { text: 'Our Services', url: '#' },
      { text: 'Contact Us', url: '#' },
      { text: 'About Us', url: '#' },
      { text: 'Pricing', url: '#' }
    ],
    showSitelinks: false,
    showCallout: false,
    callouts: ['Free Shipping', '24/7 Support', '2 Year Warranty', 'Official Dealer']
  });

  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSitelinkChange = (index: number, value: string) => {
    const newSitelinks = [...inputs.sitelinks];
    newSitelinks[index].text = value;
    setInputs(prev => ({ ...prev, sitelinks: newSitelinks }));
  };

  const handleCalloutChange = (index: number, value: string) => {
    const newCallouts = [...inputs.callouts];
    newCallouts[index] = value;
    setInputs(prev => ({ ...prev, callouts: newCallouts }));
  };

  const LIMITS = { headline: 30, path: 15, description: 90, sitelink: 25, callout: 25 };
  const getCharCountColor = (current: number, max: number) => current > max ? 'text-red-500 font-bold' : 'text-brand-dark/40';

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2 bg-brand-surface p-6 md:p-8 rounded-2xl border border-brand-medium/30 shadow-sm h-fit">
             <div className="flex justify-between items-center mb-6 border-b border-brand-medium/10 pb-4">
                <h3 className="font-bold text-lg text-brand-dark">Ad Editor</h3>
                <button onClick={() => setInputs({ finalUrl: '', headline1: '', headline2: '', headline3: '', path1: '', path2: '', description1: '', description2: '', sitelinks: [{text:'',url:''},{text:'',url:''},{text:'',url:''},{text:'',url:''}], showSitelinks: false, showCallout: false, callouts: ['','','',''] })} className="text-xs font-medium text-brand-dark/60 hover:text-brand-dark flex items-center gap-1 px-3 py-1.5 rounded-lg border border-transparent hover:bg-brand-light transition-colors">
                   <RefreshCw className="w-3 h-3" /> Reset
                </button>
             </div>
             <div className="space-y-6">
                <div>
                   <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5">Final URL</label>
                   <input type="text" name="finalUrl" value={inputs.finalUrl} onChange={handleInputChange} placeholder="https://www.example.com" className="w-full px-4 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" />
                </div>
                <div className="space-y-3">
                   <label className="block text-xs font-bold text-brand-dark/70 uppercase">Headlines</label>
                   {[1, 2, 3].map(num => {
                      const key = `headline${num}` as keyof typeof inputs;
                      return (
                        <div key={num} className="relative">
                           <input type="text" name={key} value={inputs[key] as string} onChange={handleInputChange} placeholder={`Headline ${num}`} className="w-full pl-4 pr-12 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" />
                           <span className={`absolute right-3 top-2.5 text-xs ${getCharCountColor((inputs[key] as string).length, LIMITS.headline)}`}>{(inputs[key] as string).length}/{LIMITS.headline}</span>
                        </div>
                      );
                   })}
                </div>
                <div className="space-y-3">
                   <label className="block text-xs font-bold text-brand-dark/70 uppercase">Descriptions</label>
                   {[1, 2].map(num => {
                      const key = `description${num}` as keyof typeof inputs;
                      return (
                        <div key={num} className="relative">
                           <textarea rows={2} name={key} value={inputs[key] as string} onChange={handleInputChange} placeholder={`Description ${num}`} className="w-full pl-4 pr-12 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm resize-none" />
                           <span className={`absolute right-3 bottom-2.5 text-xs ${getCharCountColor((inputs[key] as string).length, LIMITS.description)}`}>{(inputs[key] as string).length}/{LIMITS.description}</span>
                        </div>
                      );
                   })}
                </div>
             </div>
          </div>

          <div className="w-full lg:w-1/2">
             <div className="sticky top-24">
                <div className="flex justify-center mb-6">
                    <div className="bg-brand-surface border border-brand-medium/20 p-1 rounded-lg inline-flex shadow-sm">
                        <button onClick={() => setViewMode('mobile')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'mobile' ? 'bg-brand-light text-blue-600 shadow-sm' : 'text-brand-dark/60 hover:text-brand-dark'}`}><Smartphone className="w-4 h-4" /> Mobile</button>
                        <button onClick={() => setViewMode('desktop')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'desktop' ? 'bg-brand-light text-blue-600 shadow-sm' : 'text-brand-dark/60 hover:text-brand-dark'}`}><Monitor className="w-4 h-4" /> Desktop</button>
                    </div>
                </div>
                <div className={`bg-white p-6 rounded-2xl shadow-xl border border-gray-200 mx-auto transition-all duration-300 ${viewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-full'}`}>
                    {viewMode === 'mobile' && (
                        <div className="mb-6 border-b pb-4">
                            <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center justify-between text-gray-500 text-xs mb-4">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-400 rounded-full"></div><span>google.com</span></div>
                                <RefreshCw className="w-3 h-3" />
                            </div>
                            <div className="flex items-center gap-3 bg-white border rounded-full px-4 py-2.5 shadow-sm">
                                <div className="w-4 h-4 text-blue-500 font-bold">G</div>
                                <span className="text-gray-800 text-sm">best service near me</span>
                            </div>
                        </div>
                    )}
                    <div className="font-arial text-left">
                        <div className="flex items-start gap-3 mb-1">
                            <div className="flex-shrink-0"><span className="font-bold text-black text-[12px] leading-none">Sponsored</span></div>
                            <div className="flex-shrink-0 ml-auto"><MoreVertical className="w-4 h-4 text-gray-500" /></div>
                        </div>
                        <div className="flex items-center gap-2 mb-2 text-[12px] leading-snug text-gray-700">
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200"><span className="text-[10px] text-gray-500">img</span></div>
                            <div className="flex flex-col"><span className="font-medium text-gray-900">{new URL(inputs.finalUrl).hostname || 'example.com'}</span><span className="text-gray-500 text-[11px]">{inputs.finalUrl}</span></div>
                        </div>
                        <div className="group cursor-pointer">
                            <h3 className="text-[20px] leading-[26px] text-[#1a0dab] hover:underline font-normal mb-1 break-words">
                                {inputs.headline1 || 'Headline 1'} {inputs.headline2 && <span> | {inputs.headline2}</span>} {inputs.headline3 && <span> | {inputs.headline3}</span>}
                            </h3>
                        </div>
                        <div className="text-[14px] leading-[22px] text-[#4d5156]">
                            <span className="break-words">{inputs.description1 || 'Description line 1 goes here.'}</span> {inputs.description2 && <span className="break-words">{inputs.description2}</span>}
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

export default GoogleAdMockup;
