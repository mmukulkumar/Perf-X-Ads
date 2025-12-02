
import React, { useState } from 'react';
import { Smartphone, Monitor, ThumbsUp, MessageCircle, Share2, MoreHorizontal, Globe, Info, Upload, Image as ImageIcon, RefreshCw } from 'lucide-react';
import ShareTool from './ShareTool';

const FacebookAdMockup = () => {
  const [inputs, setInputs] = useState({
    brandName: 'Perf X Ads',
    primaryText: 'Experience the ultimate marketing toolkit. Boost your ROI and streamline your workflow today! 🚀',
    headline: 'The All-in-One Marketing Suite',
    description: 'Join 10,000+ marketers growing their business.',
    websiteUrl: 'PERFXADS.COM',
    cta: 'Learn More',
    profileImage: null as string | null,
    adImage: null as string | null,
    likes: '1.2K',
    comments: '145 comments',
    shares: '56 shares'
  });

  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage' | 'adImage') => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setInputs(prev => ({ ...prev, [field]: url }));
    }
  };

  const resetForm = () => {
    setInputs({
        brandName: 'Perf X Ads',
        primaryText: 'Experience the ultimate marketing toolkit. Boost your ROI and streamline your workflow today! 🚀',
        headline: 'The All-in-One Marketing Suite',
        description: 'Join 10,000+ marketers growing their business.',
        websiteUrl: 'PERFXADS.COM',
        cta: 'Learn More',
        profileImage: null,
        adImage: null,
        likes: '1.2K',
        comments: '145 comments',
        shares: '56 shares'
    });
  };

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="w-full lg:w-1/2 bg-brand-surface p-6 md:p-8 rounded-2xl border border-brand-medium/30 shadow-sm h-fit">
             <div className="flex justify-between items-center mb-6 border-b border-brand-medium/10 pb-4">
                <h3 className="font-bold text-lg text-brand-dark">Ad Builder</h3>
                <button onClick={resetForm} className="text-xs font-medium text-brand-dark/60 hover:text-brand-dark flex items-center gap-1 px-3 py-1.5 rounded-lg border border-transparent hover:bg-brand-light transition-colors">
                   <RefreshCw className="w-3 h-3" /> Reset
                </button>
             </div>

             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5">Profile Picture</label>
                        <div className="relative flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-light border border-brand-medium/30 overflow-hidden flex-shrink-0">
                                {inputs.profileImage ? <img src={inputs.profileImage} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-brand-dark/20"><ImageIcon className="w-4 h-4" /></div>}
                            </div>
                            <label className="cursor-pointer text-xs bg-brand-light hover:bg-brand-medium/20 text-brand-dark px-3 py-2 rounded-md transition-colors border border-brand-medium/20">
                                Upload
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'profileImage')} />
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5">Brand Name</label>
                        <input type="text" name="brandName" value={inputs.brandName} onChange={handleInputChange} className="w-full px-3 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm" />
                    </div>
                </div>
                <div>
                   <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5">Primary Text</label>
                   <textarea rows={3} name="primaryText" value={inputs.primaryText} onChange={handleInputChange} className="w-full px-3 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm resize-none" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5">Ad Media</label>
                    <div className="border-2 border-dashed border-brand-medium/30 rounded-lg p-6 text-center hover:bg-brand-light/30 transition-colors cursor-pointer relative" onClick={() => document.getElementById('ad-image-upload')?.click()}>
                        {inputs.adImage ? (
                            <div className="relative h-40 w-full overflow-hidden rounded-md"><img src={inputs.adImage} alt="Ad Media" className="w-full h-full object-cover" /></div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-brand-dark/40"><Upload className="w-8 h-8" /><span className="text-xs">Upload Image</span></div>
                        )}
                        <input id="ad-image-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'adImage')} />
                    </div>
                </div>
                <div>
                   <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5">Headline</label>
                   <input type="text" name="headline" value={inputs.headline} onChange={handleInputChange} className="w-full px-3 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5">Description</label>
                        <input type="text" name="description" value={inputs.description} onChange={handleInputChange} className="w-full px-3 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5">Website URL</label>
                        <input type="text" name="websiteUrl" value={inputs.websiteUrl} onChange={handleInputChange} className="w-full px-3 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm uppercase" />
                    </div>
                </div>
                <div>
                   <label className="block text-xs font-bold text-brand-dark/70 uppercase mb-1.5">Call to Action</label>
                   <select name="cta" value={inputs.cta} onChange={handleInputChange} className="w-full px-3 py-2.5 bg-brand-light/30 border border-brand-medium/40 rounded-lg text-brand-dark focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm">
                      <option>Learn More</option><option>Shop Now</option><option>Sign Up</option><option>Book Now</option><option>Download</option>
                   </select>
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
                <div className={`mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 transition-all duration-300 ${viewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-[500px]'}`}>
                    <div className="p-3 flex justify-between items-start">
                        <div className="flex gap-2.5">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                                {inputs.profileImage ? <img src={inputs.profileImage} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100"><ImageIcon className="w-5 h-5" /></div>}
                            </div>
                            <div className="flex flex-col">
                                <h4 className="text-sm font-bold text-gray-900 leading-tight">{inputs.brandName}</h4>
                                <div className="flex items-center gap-1 text-xs text-gray-500"><span>Sponsored</span><span>•</span><Globe className="w-3 h-3 text-gray-400" /></div>
                            </div>
                        </div>
                        <MoreHorizontal className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="px-3 pb-3 text-[15px] text-gray-900 leading-snug whitespace-pre-wrap">{inputs.primaryText}</div>
                    <div className="w-full bg-gray-100 aspect-square overflow-hidden flex items-center justify-center border-y border-gray-100">
                        {inputs.adImage ? <img src={inputs.adImage} alt="Ad Creative" className="w-full h-full object-cover" /> : <div className="text-center text-gray-400"><ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" /><span className="text-sm font-medium">Ad Image Preview</span></div>}
                    </div>
                    <div className="bg-gray-50 p-3 flex justify-between items-center border-b border-gray-100">
                        <div className="flex-1 pr-4 overflow-hidden">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5 truncate">{inputs.websiteUrl}</p>
                            <h3 className="text-[16px] font-bold text-gray-900 leading-tight mb-1 truncate">{inputs.headline}</h3>
                            <p className="text-[14px] text-gray-600 leading-snug truncate">{inputs.description}</p>
                        </div>
                        <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-[14px] font-bold rounded transition-colors whitespace-nowrap">{inputs.cta}</button>
                    </div>
                    <div className="px-3 py-2">
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                            <div className="flex items-center gap-1"><div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><ThumbsUp className="w-2.5 h-2.5 text-white fill-current" /></div><span>{inputs.likes}</span></div>
                            <div className="flex gap-3"><span>{inputs.comments}</span><span>{inputs.shares}</span></div>
                        </div>
                        <div className="border-t border-gray-200 pt-1 flex text-gray-500 font-medium text-[14px]">
                            <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded transition-colors"><ThumbsUp className="w-5 h-5" /> Like</button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded transition-colors"><MessageCircle className="w-5 h-5" /> Comment</button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded transition-colors"><Share2 className="w-5 h-5" /> Share</button>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
        
        <ShareTool title="Facebook Ad Mockup Generator" />
      </div>
    </div>
  );
};

export default FacebookAdMockup;
