import React, { useState } from "react";
import {
  Search,
  Sparkles,
  Bot,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  BarChart2,
  MessageSquare,
  BookOpen,
  Layers,
  ArrowLeft,
  Globe,
  Zap,
  LineChart,
  Laptop,
  FlaskConical,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { useAuth } from "../contexts/AuthContext";

interface KeywordData {
  keyword: string;
  intent: string;
  traffic: string;
  difficulty: string;
  llmVisibility: number;
  strategy: string;
}

interface RedditInsights {
  painPoint: string;
  formatSuggestion: string;
  slangAlert: string;
}

interface AnalysisResult {
  summary: string;
  keywords: KeywordData[];
  redditInsights: RedditInsights;
  definitions: {
    traffic: string;
    difficulty: string;
    visibility: string;
    strategy: string;
  };
}

const AiKeywordResearch = () => {
  const { consumeCredits } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState<"keyword" | "brand">("keyword");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (
    type: "keyword" | "brand",
    inputValue: string
  ) => {
    if (!inputValue.trim()) {
      alert(`Please enter a ${type === "keyword" ? "keyword" : "brand name"}.`);
      return;
    }

    // CREDIT CHECK: High Cost Tool (20 Credits)
    if (!consumeCredits(20)) return;
    
    const apiKey = import.meta.env.VITE_API_KEY as string;
    if (!apiKey) {
      setError("API Key not configured.");
      return;
    }

    setSearchType(type);
    setSearchInput(inputValue);
    setIsAnalyzing(true);
    setError("");
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-2.5-flash";

      const contextInstruction =
        type === "brand"
          ? `Focus heavily on **Brand Visibility**, Sentiment Analysis, and Share of Voice within LLM responses. The user wants to know how this brand appears when users ask AI models about relevant topics.`
          : `Focus on **Topic/Keyword Discovery**, Search Volume patterns, and ranking opportunities in both Google and LLMs.`;

      const prompt = `
            You are an advanced **AI Keyword Research & LLM Ranking Tool**, powered by a **Retrieval-Augmented Generation (RAG) model**. Your primary function is to serve as an expert SEO and Generative AI Optimization (GEO) analyst.

            Your goal is to perform a deep-dive analysis on the user-provided input and generate a comprehensive, prioritized list of keywords/queries, complete with actionable metrics and a strategic ranking prognosis across major Large Language Models (LLMs) and traditional search engines.

            Input Type: ${type.toUpperCase()}
            Input Query: "${inputValue}"
            Context: ${contextInstruction}

            ### 1. **Core Retrieval (RAG System)**

            Before generation, simulate retrieval, analysis, and synthesis of high-quality, up-to-the-minute data from the following specialized knowledge bases:

            * **KB 1: Real-Time Search & Trend Data:**
                * **Source Data:** Current search engine results (Google, Bing), news feeds, real-time social platform trends (e.g., X/Twitter trends).
                * **Focus:** Identifying **emerging, high-growth keywords** and new search intents that traditional tools have not yet captured.
            * **KB 2: LLM & Generative AI Optimization (GEO) Data:**
                * **Source Data:** Aggregated data on LLM search behavior (e.g., Google AI Overviews, Perplexity, ChatGPT, Claude) including citation frequency, brand mention analysis, and identified query fan-out patterns.
                * **Focus:** Understanding how different LLMs cluster and answer queries, and the specific content types they prioritize for citation.
            * **KB 3: High-Quality Community & User Intent Data (Reddit Focus):**
                * **Source Data:** Top-ranking threads, highly-engaged discussions, and direct user questions/pain points from relevant subreddits (e.g., r/AskReddit, r/SEO, niche industry subreddits).
                * **Focus:** Extracting **long-tail, low-competition, and explicit user-intent keywords** that reflect natural language search queries and unmet user needs.

            ### 2. **Output Generation Requirements**

            Output a detailed list of **10 to 15 prioritized keywords/queries** in a structured JSON format.

            ### 3. **Metric Definitions & Strategic Guidance**

            Provide a brief analytical summary before the table and ensure the final output includes a definition of these specialized metrics:

            * **Monthly Traffic (Est.):** A quantitative estimate of monthly search volume.
            * **Traditional Rank Difficulty:** A qualitative assessment of competition for the keyword in classic Google/Bing search results.
            * **LLM Visibility Probability (1-10):** A proprietary score (10 being highest) reflecting the likelihood of your content/brand being:
                1.  **Cited** in an LLM's Generative AI Answer (e.g., Google AI Overview).
                2.  **Used as a source** by models like Perplexity or ChatGPT.
            * **Ranking Strategy:** A concise, high-value, and actionable suggestion for content creation, specifically tailored to the RAG-retrieved data (e.g., *“Create a comparison table answering the common 'X vs Y' debate found on Reddit,”* or *“Target as a Passage: Place a direct, concise answer at the top of an H2 section to maximize LLM citation probability.”*).

            ### 4. **Reddit-Derived Insights**

            Synthesize high-quality insights from the Reddit data.

            ### 5. **JSON Response Format**
            
            Return ONLY a raw JSON object (no markdown, no code blocks) with the following schema:
            {
              "summary": "A brief analytical summary of the topic/brand landscape.",
              "keywords": [
                { 
                  "keyword": "string", 
                  "intent": "Informational/Commercial/Transactional", 
                  "traffic": "Volume Range", 
                  "difficulty": "Low/Medium/High", 
                  "llmVisibility": 1-10 (integer), 
                  "strategy": "Detailed, actionable suggestion based on RAG data" 
                }
              ],
              "redditInsights": {
                "painPoint": "Summarize the single most common problem or question.",
                "formatSuggestion": "Suggest a content format (e.g., table, guide).",
                "slangAlert": "Note specific jargon/slang."
              },
              "definitions": {
                 "traffic": "Definition of Monthly Traffic",
                 "difficulty": "Definition of Traditional Rank Difficulty",
                 "visibility": "Definition of LLM Visibility Probability",
                 "strategy": "Definition of Ranking Strategy"
              }
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
        const data = JSON.parse(text);
        setResult(data);
      }
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to generate analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getVisibilityColor = (score: number) => {
    if (score >= 8)
      return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
    if (score >= 5)
      return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
    return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
  };

  const resetTool = () => {
    setResult(null);
    setSearchInput("");
    setError("");
  };

  return (
    <div className="w-full font-inter animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* LANDING VIEW (No Results Yet) */}
        {!result && !isAnalyzing ? (
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Left Card: Keyword Research */}
            <div className="flex-1 bg-[#FFF5F0] dark:bg-[#2C1810] rounded-3xl p-8 relative overflow-hidden group border border-[#FFE0D0] dark:border-[#4A2818] transition-all hover:shadow-lg">
              <div className="relative z-10 flex flex-col h-full">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                  See what people search for on <br />
                  <span className="text-[#FF5722]">ChatGPT & Google</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                  Win the SEO game before your competitors even know they’re
                  playing.
                </p>

                <div className="mt-auto">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Enter a keyword or topic"
                      className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          handleAnalyze("keyword", e.currentTarget.value);
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = (
                          e.currentTarget
                            .previousElementSibling as HTMLInputElement
                        ).value;
                        handleAnalyze("keyword", input);
                      }}
                      className="bg-gradient-to-r from-[#FF8A65] to-[#FF5722] hover:from-[#FF7043] hover:to-[#F4511E] text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap flex items-center gap-2 justify-center"
                    >
                      <Search className="w-5 h-5" /> Search Keyword
                    </button>
                  </div>
                </div>
              </div>

              {/* Illustration Background - Man with Laptop */}
              <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none transform scale-150 rotate-[-10deg]">
                <Laptop className="w-96 h-96 text-[#FF5722]" />
              </div>
              {/* Character Illustration Approximation */}
              <div className="hidden lg:block absolute bottom-24 right-8 pointer-events-none opacity-90">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-full opacity-20 blur-xl"></div>
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-gray-800 dark:text-gray-200 fill-current"
                  >
                    <circle cx="50" cy="40" r="15" />
                    <path d="M50 60 C 20 60 10 90 10 100 L 90 100 C 90 90 80 60 50 60" />
                  </svg>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4">
                    <Laptop className="w-20 h-20 text-gray-900 dark:text-gray-100 fill-gray-200 dark:fill-gray-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Brand Visibility */}
            <div className="flex-1 bg-[#F0F7FF] dark:bg-[#0F172A] rounded-3xl p-8 relative overflow-hidden group border border-[#D0E5FF] dark:border-[#1E293B] transition-all hover:shadow-lg">
              <div className="relative z-10 flex flex-col h-full">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                  Track your brand’s <br />
                  visibility in <span className="text-[#6366F1]">ChatGPT</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                  AI searches are growing fast. Stay relevant checking what
                  users are asking.
                </p>

                <div className="mt-auto">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Enter your brand"
                      className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          handleAnalyze("brand", e.currentTarget.value);
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = (
                          e.currentTarget
                            .previousElementSibling as HTMLInputElement
                        ).value;
                        handleAnalyze("brand", input);
                      }}
                      className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap flex items-center gap-2 justify-center"
                    >
                      <Sparkles className="w-5 h-5" /> Search AI
                    </button>
                  </div>
                </div>
              </div>

              {/* Illustration Background - Scientist */}
              <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none transform scale-150 rotate-[10deg]">
                <FlaskConical className="w-96 h-96 text-[#6366F1]" />
              </div>
              {/* Character Illustration Approximation */}
              <div className="hidden lg:block absolute bottom-24 right-8 pointer-events-none opacity-90">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-full opacity-20 blur-xl"></div>
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-gray-800 dark:text-gray-200 fill-current"
                  >
                    <circle cx="50" cy="40" r="15" />
                    <path d="M50 60 C 20 60 10 90 10 100 L 90 100 C 90 90 80 60 50 60" />
                  </svg>
                  <div className="absolute bottom-0 right-0 translate-y-[-20%]">
                    <FlaskConical className="w-12 h-12 text-[#6366F1] fill-[#E0E7FF]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* RESULTS VIEW */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Back / Header for Results */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={resetTool}
                className="flex items-center gap-2 text-sm font-bold text-brand-dark/60 hover:text-brand-dark transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Search
              </button>
              {isAnalyzing && (
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing{" "}
                  {searchType}...
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> {error}
              </div>
            )}

            {/* 1. Summary */}
            {result && (
              <div className="bg-brand-surface p-6 rounded-xl border border-brand-medium/30 shadow-sm relative overflow-hidden">
                <div
                  className={`absolute top-0 left-0 w-1 h-full ${
                    searchType === "brand" ? "bg-indigo-500" : "bg-orange-500"
                  }`}
                ></div>
                <h3 className="text-lg font-bold text-brand-dark mb-3 flex items-center gap-2">
                  <BarChart2
                    className={`w-5 h-5 ${
                      searchType === "brand"
                        ? "text-indigo-500"
                        : "text-orange-500"
                    }`}
                  />
                  Analytical Summary:{" "}
                  <span className="text-brand-dark/60 ml-2 font-normal">
                    "{searchInput}"
                  </span>
                </h3>
                <p className="text-brand-dark/80 leading-relaxed">
                  {result.summary}
                </p>
              </div>
            )}

            {/* 2. Keyword Table */}
            {result && (
              <div className="bg-brand-surface rounded-xl border border-brand-medium/30 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-light/50 border-b border-brand-medium/20 text-xs font-bold text-brand-dark/60 uppercase tracking-wider">
                        <th className="p-4">Keyword / Query</th>
                        <th className="p-4">Intent</th>
                        <th className="p-4">Vol (Est.)</th>
                        <th className="p-4">Difficulty</th>
                        <th className="p-4">LLM Visibility</th>
                        <th className="p-4 w-1/3">Ranking Strategy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-medium/10">
                      {result.keywords.map((k, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-brand-light/30 transition-colors"
                        >
                          <td className="p-4 font-bold text-brand-dark">
                            {k.keyword}
                          </td>
                          <td className="p-4 text-sm text-brand-dark/70">
                            <span className="bg-brand-medium/10 px-2 py-1 rounded text-xs">
                              {k.intent}
                            </span>
                          </td>
                          <td className="p-4 text-sm font-mono text-brand-dark/80">
                            {k.traffic}
                          </td>
                          <td className="p-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold ${
                                k.difficulty.toLowerCase() === "high"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                  : k.difficulty.toLowerCase() === "medium"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                              }`}
                            >
                              {k.difficulty}
                            </span>
                          </td>
                          <td className="p-4">
                            <div
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${getVisibilityColor(
                                k.llmVisibility
                              )}`}
                            >
                              {k.llmVisibility}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-brand-dark/80 leading-snug">
                            {k.strategy}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. Reddit Insights */}
            {result && (
              <div className="bg-[#FF4500]/5 dark:bg-[#FF4500]/10 rounded-xl border border-[#FF4500]/20 p-6">
                <h3 className="text-lg font-bold text-[#FF4500] mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> Community & User Intent
                  Insights (Reddit)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-brand-surface rounded-lg border border-brand-medium/10 shadow-sm">
                    <h4 className="text-xs font-bold text-brand-dark/50 uppercase mb-2">
                      Primary Pain Point
                    </h4>
                    <p className="text-sm text-brand-dark font-medium">
                      {result.redditInsights.painPoint}
                    </p>
                  </div>
                  <div className="p-4 bg-brand-surface rounded-lg border border-brand-medium/10 shadow-sm">
                    <h4 className="text-xs font-bold text-brand-dark/50 uppercase mb-2">
                      Content Format Suggestion
                    </h4>
                    <p className="text-sm text-brand-dark font-medium">
                      {result.redditInsights.formatSuggestion}
                    </p>
                  </div>
                  <div className="p-4 bg-brand-surface rounded-lg border border-brand-medium/10 shadow-sm">
                    <h4 className="text-xs font-bold text-brand-dark/50 uppercase mb-2">
                      Language/Slang Alert
                    </h4>
                    <p className="text-sm text-brand-dark font-medium">
                      {result.redditInsights.slangAlert}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Definitions */}
            {result && (
              <div className="bg-brand-surface p-6 rounded-xl border border-brand-medium/30 shadow-sm">
                <h3 className="text-sm font-bold text-brand-dark mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-medium" /> Metric
                  Definitions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-brand-dark/70">
                  <div>
                    <span className="font-bold text-brand-dark block mb-1">
                      Monthly Traffic (Est.)
                    </span>
                    {result.definitions.traffic ||
                      "A quantitative estimate of monthly search volume."}
                  </div>
                  <div>
                    <span className="font-bold text-brand-dark block mb-1">
                      Traditional Rank Difficulty
                    </span>
                    {result.definitions.difficulty ||
                      "Qualitative assessment of competition in classic search."}
                  </div>
                  <div>
                    <span className="font-bold text-brand-dark block mb-1">
                      LLM Visibility Probability
                    </span>
                    {result.definitions.visibility ||
                      "Likelihood of content being cited in AI Overviews or used by models like ChatGPT."}
                  </div>
                  <div>
                    <span className="font-bold text-brand-dark block mb-1">
                      Ranking Strategy
                    </span>
                    {result.definitions.strategy ||
                      "Actionable suggestion for content creation tailored to RAG data."}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiKeywordResearch;
