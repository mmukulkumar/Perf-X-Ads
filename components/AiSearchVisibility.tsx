
import React, { useState } from 'react';
import { 
  Search, Bot, Sparkles, AlertCircle, RefreshCw, BarChart2, 
  Settings, Download, MessageCircle, HelpCircle, Lock, Calendar, ChevronDown, Check, Eye
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useAuth } from '../contexts/AuthContext';

interface Competitor {
  name: string;
  visibility: number;
  logoColor: string;
}

interface PromptData {
  query: string;
  rank: number | string;
  mentioned: boolean;
}

interface DashboardData {
  visibilityScore: number;
  industryRank: number;
  totalCompetitors: number;
  analyzedPromptsCount: number;
  mentionsCount: number;
  competitors: Competitor[];
  topPrompts: PromptData[];
  brandVisibilityBreakdown: {
    mentioned: number;
    notMentioned: number;
  };
  visibilityTrend: number[];
}

const AiSearchVisibility = () => {
  const { consumeCredits } = useAuth();
  // Input State
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');

  // UI State
  const [timeRange, setTimeRange] = useState('Last 30 days');
  const [selectedModel, setSelectedModel] = useState('ChatGPT');

  const handleAnalyze = async () => {
    if (!brandName.trim()) {
      alert("Please enter a brand name.");
      return;
    }
    
    // CREDIT CHECK: High Cost Tool (20 Credits)
    if (!consumeCredits(20)) return;

    const apiKey = import.meta.env.VITE_API_KEY as string;
    if (!apiKey) {
      setError("API Key not configured.");
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setData(null);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-2.5-flash";
      
      const prompt = `
        You are an AI Search Visibility Analyst simulating data for a dashboard similar to Ubersuggest or Semrush, but for LLM visibility.
        
        Brand: "${brandName}"
        Industry/Niche: "${industry || 'Auto-detect based on brand'}"
        Platform: ${selectedModel}

        Task: Simulate an analysis of how visible this brand is in Generative AI responses for transactional and informational queries in their niche.
        
        IMPORTANT: Generate UNIQUE and REALISTIC data specifically for the brand "${brandName}". The data should vary based on:
        - The brand's actual market position and recognition
        - The industry/niche provided
        - Real competitors in that space
        - Realistic prompts users would actually search for
        
        Generate realistic simulated data for:
        1. Overall Visibility Score (0-100%) - should reflect the brand's actual market presence
        2. Industry Rank - realistic position among actual competitors
        3. Top 5 REAL Competitors in this space (use actual company names, not placeholders)
        4. Top 10 Prompts/Questions users might ask where this brand should appear
        5. Trend data for the last 6 time points (should show realistic variation)

        Return ONLY valid raw JSON (no markdown, no code blocks) with this exact structure:
        {
          "visibilityScore": 72,
          "industryRank": 3,
          "totalCompetitors": 15,
          "analyzedPromptsCount": 120,
          "mentionsCount": 86,
          "competitors": [
            { "name": "Competitor Name", "visibility": 85, "logoColor": "#EF4444" },
            { "name": "Another Competitor", "visibility": 60, "logoColor": "#3B82F6" }
          ],
          "topPrompts": [
            { "query": "Best tool for X", "rank": 1, "mentioned": true },
            { "query": "Alternatives to Y", "rank": "-", "mentioned": false }
          ],
          "brandVisibilityBreakdown": {
            "mentioned": 86,
            "notMentioned": 34
          },
          "visibilityTrend": [60, 65, 62, 70, 72, 72]
        }
      `;

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      if (text) {
        const parsedData = JSON.parse(text);
        setData(parsedData);
      } else {
        throw new Error("No response received from AI");
      }
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to generate analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRankColor = (rank: number | string) => {
    if (typeof rank === 'string') return 'text-gray-400';
    if (rank <= 3) return 'text-green-600 font-bold';
    if (rank <= 10) return 'text-blue-600';
    return 'text-orange-600';
  };

  // Helper for simple bar chart width
  const getBarWidth = (value: number) => `${Math.min(value, 100)}%`;

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* INPUT SECTION (Shown if no data) */}
        {!data && !isAnalyzing && (
          <div className="max-w-2xl mx-auto mt-12 bg-brand-surface rounded-2xl border border-brand-medium/30 shadow-lg p-8">
             <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                   <Eye className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-brand-dark mb-2">Check AI Search Visibility</h2>
                <p className="text-brand-dark/60">See how often your brand appears in ChatGPT, Gemini, and Perplexity responses.</p>
             </div>

             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-bold text-brand-dark mb-2">Brand Name</label>
                   <input 
                      type="text" 
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. Mailchimp, Nike, Slack"
                      className="w-full px-4 py-3 bg-brand-light/50 border border-brand-medium/40 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-brand-dark mb-2">Industry / Niche (Optional)</label>
                   <input 
                      type="text" 
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g. Email Marketing, Athletic Shoes"
                      className="w-full px-4 py-3 bg-brand-light/50 border border-brand-medium/40 rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                   />
                </div>
                
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}
                
                <button 
                   onClick={handleAnalyze}
                   className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
                >
                   <Sparkles className="w-5 h-5" /> Analyze Visibility
                </button>
             </div>
          </div>
        )}

        {/* LOADING STATE */}
        {isAnalyzing && (
           <div className="max-w-2xl mx-auto mt-20 text-center">
              <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-6" />
              <h3 className="text-xl font-bold text-brand-dark mb-2">Analyzing AI Footprint...</h3>
              <p className="text-brand-dark/60">Simulating thousands of conversations to find your brand.</p>
           </div>
        )}

        {/* DASHBOARD VIEW */}
        {data && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             
             {/* Header Bar */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                   <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-2xl font-bold text-brand-dark">AI Search Visibility</h1>
                      <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">BETA</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm text-brand-dark/50">
                      <span className="font-bold text-brand-dark">{brandName}</span>
                      <span>|</span>
                      <span>{industry || 'General'}</span>
                      <HelpCircle className="w-3.5 h-3.5" />
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className="relative">
                      <button className="flex items-center gap-2 bg-white dark:bg-brand-surface border border-brand-medium/30 px-3 py-2 rounded-lg text-sm font-medium text-brand-dark hover:bg-brand-light transition-colors">
                         <Calendar className="w-4 h-4 text-brand-medium" />
                         {timeRange}
                         <ChevronDown className="w-3 h-3 opacity-50" />
                      </button>
                   </div>
                   <div className="relative">
                      <button className="flex items-center gap-2 bg-white dark:bg-brand-surface border border-brand-medium/30 px-3 py-2 rounded-lg text-sm font-medium text-brand-dark hover:bg-brand-light transition-colors">
                         <Bot className="w-4 h-4 text-brand-medium" />
                         {selectedModel}
                         <ChevronDown className="w-3 h-3 opacity-50" />
                      </button>
                   </div>
                   <button className="p-2 border border-brand-medium/30 rounded-lg hover:bg-brand-light text-brand-dark/60"><Settings className="w-4 h-4" /></button>
                </div>
             </div>

             {/* Metric Cards Row */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Visibility Score */}
                <div className="bg-brand-surface border border-brand-medium/30 rounded-xl p-6 shadow-sm relative overflow-hidden">
                   <div className="flex justify-between items-start mb-4">
                      <h3 className="text-sm font-bold text-brand-dark flex items-center gap-2">Your Brand Visibility <HelpCircle className="w-3 h-3 text-brand-medium" /></h3>
                   </div>
                   <div className="mb-2">
                      <span className="text-4xl font-extrabold text-brand-dark">{data.visibilityScore}%</span>
                   </div>
                   <p className="text-xs text-brand-dark/50">of responses mention you</p>
                   <div className="absolute bottom-0 left-0 h-1 bg-purple-500" style={{ width: `${data.visibilityScore}%` }}></div>
                </div>

                {/* Industry Rank */}
                <div className="bg-brand-surface border border-brand-medium/30 rounded-xl p-6 shadow-sm relative overflow-hidden">
                   <div className="flex justify-between items-start mb-4">
                      <h3 className="text-sm font-bold text-brand-dark flex items-center gap-2">Your Industry Rank <HelpCircle className="w-3 h-3 text-brand-medium" /></h3>
                   </div>
                   <div className="mb-2">
                      <span className="text-4xl font-extrabold text-brand-dark">{data.industryRank}</span>
                   </div>
                   <p className="text-xs text-brand-dark/50">out of {data.totalCompetitors} competitors</p>
                </div>

                {/* Analyzed Data */}
                <div className="bg-brand-surface border border-brand-medium/30 rounded-xl p-6 shadow-sm relative overflow-hidden">
                   <div className="flex justify-between items-start mb-4">
                      <h3 className="text-sm font-bold text-brand-dark flex items-center gap-2">Analyzed Data <HelpCircle className="w-3 h-3 text-brand-medium" /></h3>
                   </div>
                   <div className="mb-2">
                      <span className="text-4xl font-extrabold text-purple-600">{data.mentionsCount} mentions</span>
                   </div>
                   <p className="text-xs text-brand-dark/50">out of {data.analyzedPromptsCount} simulated prompts</p>
                </div>
             </div>

             {/* Charts Row */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                
                {/* Top Brands Chart */}
                <div className="lg:col-span-2 bg-brand-surface border border-brand-medium/30 rounded-xl p-6 shadow-sm">
                   <h3 className="text-lg font-bold text-brand-dark mb-6 flex items-center gap-2">Top Brands Visibility <HelpCircle className="w-4 h-4 text-brand-medium" /></h3>
                   
                   <div className="space-y-6">
                      {data.competitors.map((comp, idx) => (
                         <div key={idx} className="relative">
                            <div className="flex justify-between text-xs mb-1">
                               <span className="font-bold text-brand-dark flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: comp.logoColor }}></div>
                                  {comp.name}
                               </span>
                               <span className="font-mono text-brand-dark/60">{comp.visibility}%</span>
                            </div>
                            <div className="h-3 w-full bg-brand-light/50 rounded-full overflow-hidden">
                               <div 
                                  className="h-full rounded-full transition-all duration-1000 ease-out"
                                  style={{ 
                                     width: getBarWidth(comp.visibility), 
                                     backgroundColor: comp.logoColor 
                                  }}
                               ></div>
                            </div>
                         </div>
                      ))}
                      
                      {/* Fake "Unlock" row for visual flair */}
                      <div className="relative pt-4 opacity-60 filter blur-[1px]">
                         <div className="flex justify-between text-xs mb-1">
                            <span className="font-bold text-brand-dark flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-300"></div> Competitor X</span>
                            <span className="font-mono text-brand-dark/60">--%</span>
                         </div>
                         <div className="h-3 w-full bg-brand-light/50 rounded-full"></div>
                         
                         <div className="absolute inset-0 flex items-center justify-center z-10">
                            <button className="bg-white dark:bg-brand-surface border border-brand-medium/30 shadow-sm px-4 py-1.5 rounded-full text-xs font-bold text-purple-600 flex items-center gap-1.5 hover:bg-purple-50 transition-colors">
                               <Lock className="w-3 h-3" /> Unlock more competitors
                            </button>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Donut Chart Simulation */}
                <div className="bg-brand-surface border border-brand-medium/30 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
                   <h3 className="text-lg font-bold text-brand-dark mb-6 w-full text-left">Your Brand Visibility</h3>
                   
                   <div className="relative w-48 h-48 mb-6">
                      <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                         {/* Background Circle */}
                         <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E2E8F0"
                            strokeWidth="3.8"
                            className="dark:stroke-gray-700"
                         />
                         {/* Foreground Circle */}
                         <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#FF8A65"
                            strokeWidth="3.8"
                            strokeDasharray={`${data.visibilityScore}, 100`}
                            className="animate-[spin_1s_ease-out_reverse]"
                         />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-3xl font-extrabold text-brand-dark">{data.visibilityScore}%</span>
                         <span className="text-[10px] text-brand-dark/50 uppercase font-bold">Mentioned</span>
                      </div>
                   </div>

                   <div className="w-full space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#FF8A65]"></div>
                            <span className="text-brand-dark/70">Mentioned</span>
                         </div>
                         <span className="font-bold text-brand-dark">{data.visibilityScore}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            <span className="text-brand-dark/70">Not mentioned</span>
                         </div>
                         <span className="font-bold text-brand-dark">{100 - data.visibilityScore}%</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Top Prompts Table */}
             <div className="bg-brand-surface border border-brand-medium/30 rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="px-6 py-5 border-b border-brand-medium/20 flex justify-between items-center bg-brand-light/10">
                   <h3 className="text-lg font-bold text-brand-dark">Top Ranking Prompts</h3>
                   <span className="text-xs text-brand-dark/50">Showing {data.topPrompts.length} results</span>
                </div>
                
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-brand-light/30 text-xs font-bold text-brand-dark/60 uppercase">
                         <tr>
                            <th className="px-6 py-3">Prompt / Query</th>
                            <th className="px-6 py-3 w-32">Your Rank</th>
                            <th className="px-6 py-3 w-32 text-right">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-medium/10 text-sm">
                         {data.topPrompts.map((item, idx) => (
                            <tr key={idx} className="hover:bg-brand-light/20 transition-colors group">
                               <td className="px-6 py-4 font-medium text-brand-dark">{item.query}</td>
                               <td className={`px-6 py-4 font-mono ${getRankColor(item.rank)}`}>
                                  {item.rank === '-' ? '-' : `#${item.rank}`}
                               </td>
                               <td className="px-6 py-4 text-right">
                                  <button className="text-purple-600 hover:text-purple-700 font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                     View Response
                                  </button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
                
                {/* Footer of table */}
                <div className="px-6 py-4 border-t border-brand-medium/20 bg-brand-light/5 text-center">
                   <button className="text-sm font-bold text-brand-dark/60 hover:text-brand-dark transition-colors">
                      View All Prompts
                   </button>
                </div>
             </div>

             {/* Competitor Trend (Line Chart Simulation) */}
             <div className="bg-brand-surface border border-brand-medium/30 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold text-brand-dark">Competitor Visibility Trends</h3>
                   <button className="text-blue-600 text-xs font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Access full history
                   </button>
                </div>
                
                <div className="h-64 relative flex items-end justify-between gap-2 px-4 border-b border-l border-brand-medium/20">
                   {/* Grid lines horizontal */}
                   {[0, 25, 50, 75, 100].map((val) => (
                      <div key={val} className="absolute left-0 w-full border-t border-brand-medium/10 text-[10px] text-brand-dark/30" style={{ bottom: `${val}%` }}>
                         <span className="absolute -left-6 -top-1.5">{val}</span>
                      </div>
                   ))}

                   {/* Render Trend Line Points */}
                   <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                      <polyline
                         fill="none"
                         stroke="#9333EA"
                         strokeWidth="3"
                         points={data.visibilityTrend.map((val, i) => {
                            const x = (i / (data.visibilityTrend.length - 1)) * 100;
                            return `${x}%,${100 - val}%`; 
                         }).join(' ')}
                         className="drop-shadow-sm"
                      />
                   </svg>
                   
                   {/* X-Axis Labels */}
                   {['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Current'].map((label, i) => (
                      <div key={i} className="text-[10px] text-brand-dark/40 translate-y-6">{label}</div>
                   ))}
                </div>
             </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default AiSearchVisibility;
