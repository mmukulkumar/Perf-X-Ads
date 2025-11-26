
import React, { useState, useRef } from 'react';
import { Upload, Smartphone, Info, Image as ImageIcon, FileVideo, Music, Heart, MessageCircle, Share2, User } from 'lucide-react';

const TikTokAdMockup = () => {
  const [adType, setAdType] = useState<'takeover' | 'in-feed'>('takeover');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scale, setScale] = useState(100);
  const [appLanguage, setAppLanguage] = useState('English');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  const handleFile = (file: File) => {
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-brand-surface border border-brand-medium/20 rounded-xl p-4 flex flex-wrap items-center gap-4 md:gap-8 shadow-sm">
            <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-brand-dark">Ad Type:</label>
                <select value={adType} onChange={(e) => setAdType(e.target.value as any)} className="bg-brand-light border border-brand-medium/30 rounded-lg px-3 py-1.5 text-sm text-brand-dark focus:ring-2 focus:ring-black/10 outline-none">
                    <option value="takeover">Brand Takeover (Launch)</option>
                    <option value="in-feed">In-Feed Video</option>
                </select>
            </div>
            <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-brand-dark">Device Model:</label>
                <select className="bg-brand-light border border-brand-medium/30 rounded-lg px-3 py-1.5 text-sm text-brand-dark focus:ring-2 focus:ring-black/10 outline-none">
                    <option>iPhone 13 Pro Max</option>
                    <option>iPhone X</option>
                    <option>Samsung Galaxy S21</option>
                </select>
            </div>
            <div className="flex items-center gap-3 ml-auto">
                <label className="text-sm font-semibold text-brand-dark">Scale:</label>
                <input type="range" min="50" max="100" value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-24 accent-brand-dark cursor-pointer" />
                <span className="text-xs font-mono w-8 text-right">{scale}%</span>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-6">
             <div className="bg-brand-surface p-6 rounded-xl border border-brand-medium/30 shadow-sm">
                <h3 className="font-bold text-brand-dark mb-4 flex items-center gap-2"><Upload className="w-4 h-4" /> Upload Creative</h3>
                <div 
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer relative ${isDragging ? 'border-brand-dark bg-brand-light' : 'border-brand-medium/40 hover:border-brand-medium hover:bg-brand-light/30'}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileSelect} />
                    {previewUrl ? (
                        <div className="space-y-3">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                {file?.type.startsWith('video') ? <FileVideo className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                            </div>
                            <p className="text-sm font-medium text-brand-dark truncate max-w-full px-2">{file?.name}</p>
                            <button onClick={(e) => { e.stopPropagation(); setFile(null); setPreviewUrl(null); }} className="text-xs text-red-500 hover:text-red-600 font-medium underline">Remove File</button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="w-12 h-12 bg-brand-light text-brand-dark/40 rounded-full flex items-center justify-center mx-auto"><Upload className="w-6 h-6" /></div>
                            <p className="text-sm font-medium text-brand-dark">Click or Drag to upload</p>
                            <p className="text-xs text-brand-dark/40">Supports JPG, PNG, MP4<br/>Max 500MB</p>
                        </div>
                    )}
                </div>
             </div>
          </div>

          <div className="lg:col-span-5 flex justify-center items-start min-h-[600px] bg-brand-light/30 rounded-2xl border border-brand-medium/10 p-8">
             <div className="relative bg-black rounded-[3rem] shadow-2xl overflow-hidden border-[8px] border-gray-900 ring-1 ring-black/10" style={{ width: `${375 * (scale/100)}px`, height: `${812 * (scale/100)}px`, transition: 'all 0.3s ease' }}>
                <div className="absolute top-0 inset-x-0 h-7 bg-black/0 z-50 flex justify-center"><div className="w-40 h-6 bg-black rounded-b-2xl"></div></div>
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    {previewUrl ? (
                        file?.type.startsWith('video') ? <video src={previewUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline /> : <img src={previewUrl} className="w-full h-full object-cover" alt="Ad Preview" />
                    ) : (
                        <div className="text-white/20 flex flex-col items-center"><Smartphone className="w-12 h-12 mb-2" /><span className="text-xs font-medium">Upload Creative</span></div>
                    )}
                </div>
                {adType === 'takeover' && (
                    <>
                        <div className="absolute top-12 right-4 z-30"><div className="bg-black/40 backdrop-blur-sm text-white text-[10px] px-3 py-1 rounded-full border border-white/20 font-medium">Skip</div></div>
                        <div className="absolute bottom-8 inset-x-0 flex flex-col items-center z-30 px-6 text-center">
                            <div className="bg-white text-black text-xs font-bold px-6 py-3 rounded-sm w-full shadow-lg">LEARN MORE</div>
                            <div className="mt-3 flex items-center gap-1 text-white/60 text-[9px] font-medium uppercase tracking-wider"><span>Ad</span> <span className="w-0.5 h-0.5 bg-white/60 rounded-full"></span> <span>TikTok</span></div>
                        </div>
                    </>
                )}
                {adType === 'in-feed' && (
                    <>
                        <div className="absolute bottom-24 right-2 z-30 flex flex-col items-center gap-4">
                            <div className="relative"><div className="w-10 h-10 rounded-full border border-white bg-gray-800 overflow-hidden"><div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs"><User className="w-5 h-5" /></div></div></div>
                            <div className="flex flex-col items-center gap-1"><Heart className="w-7 h-7 text-white drop-shadow-md fill-white/90" /><span className="text-white text-[10px] font-bold drop-shadow-md">152.1K</span></div>
                            <div className="flex flex-col items-center gap-1"><MessageCircle className="w-7 h-7 text-white drop-shadow-md fill-white" /><span className="text-white text-[10px] font-bold drop-shadow-md">1,042</span></div>
                            <div className="flex flex-col items-center gap-1"><Share2 className="w-7 h-7 text-white drop-shadow-md fill-white" /><span className="text-white text-[10px] font-bold drop-shadow-md">Share</span></div>
                            <div className="w-10 h-10 rounded-full bg-gray-900 border-4 border-gray-800 flex items-center justify-center animate-spin-slow"><Music className="w-4 h-4 text-white" /></div>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 p-4 pb-6 z-30 bg-gradient-to-t from-black/60 to-transparent">
                            <div className="mb-3">
                                <h4 className="text-white font-bold text-[13px] drop-shadow-md mb-1">@BrandName</h4>
                                <p className="text-white/90 text-[12px] leading-tight drop-shadow-md max-w-[75%]">Check out our latest collection! 🔥 #brand #fashion <span className="font-bold">See more</span></p>
                                <div className="flex items-center gap-2 mt-2 text-white/80 text-[11px]"><Music className="w-3 h-3" /><span className="ticker">Original Sound - Brand Name</span></div>
                            </div>
                        </div>
                    </>
                )}
             </div>
          </div>

          <div className="lg:col-span-4">
             <div className="bg-brand-surface p-6 rounded-xl border border-brand-medium/30 shadow-sm sticky top-24">
                <h3 className="font-bold text-brand-dark mb-4 flex items-center gap-2"><Info className="w-4 h-4 text-brand-dark/60" /> Ad Specifications</h3>
                <div className="space-y-6 text-sm text-brand-dark/70">
                    <div><h4 className="font-bold text-brand-dark mb-2">1. Video Specs</h4><ul className="space-y-1.5 list-disc pl-4"><li>Format: .mp4, .mov</li><li>Resolution: 1080x1920 (recommended)</li><li>Aspect Ratio: 9:16</li><li>Length: 5-60s</li></ul></div>
                    <div><h4 className="font-bold text-brand-dark mb-2">2. Safe Zones</h4><p className="mb-2 text-xs">Avoid placing text or logos in these areas:</p><ul className="space-y-1.5 list-disc pl-4 text-xs"><li>Left: 44px</li><li>Right: 140px</li><li>Bottom: 383px</li></ul></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TikTokAdMockup;
