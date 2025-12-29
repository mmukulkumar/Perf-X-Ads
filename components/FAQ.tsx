import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  // General Questions
  {
    category: 'General',
    question: 'What is Perf X Ads and how can it help my business?',
    answer: 'Perf X Ads is a comprehensive digital marketing and SEO toolkit that provides 30+ professional tools for advertisers, marketers, and businesses. Our platform helps you optimize ad campaigns, calculate ROI, generate mockups, improve SEO performance, and streamline your marketing workflows - all in one place.'
  },
  {
    category: 'General',
    question: 'Do I need to create an account to use Perf X Ads tools?',
    answer: 'Many of our basic tools are available for free without an account. However, creating a free account unlocks additional features, saves your work, and provides access to premium tools with advanced capabilities.'
  },
  {
    category: 'General',
    question: 'What platforms and ad networks does Perf X Ads support?',
    answer: 'We support all major advertising platforms including Google Ads, Facebook Ads, Instagram, TikTok, LinkedIn, Twitter (X), Pinterest, Snapchat, YouTube, and more. Our ad specs library covers over 100+ ad formats across these platforms.'
  },

  // AI & GEO Tools
  {
    category: 'AI & GEO Tools',
    question: 'What is AI Keyword Research and how does RAG technology work?',
    answer: 'Our AI Keyword Research tool uses Retrieval-Augmented Generation (RAG) technology to provide real-time keyword insights by analyzing current trends, search patterns, and user intent data from multiple sources. It simulates how AI search engines like ChatGPT and Perplexity retrieve information, giving you keywords that rank well in both traditional and AI-powered search results.'
  },
  {
    category: 'AI & GEO Tools',
    question: 'How can I track my brand visibility in AI search results?',
    answer: 'Use our AI Search Visibility (GEO) tool to monitor your brand\'s share of voice across AI-powered search engines like ChatGPT, Perplexity, and Google Gemini. The tool analyzes ranking prompts, tracks competitor visibility, and provides actionable insights to improve your presence in AI-generated responses.'
  },
  {
    category: 'AI & GEO Tools',
    question: 'What is GEO (Generative Engine Optimization)?',
    answer: 'GEO (Generative Engine Optimization) is the practice of optimizing your content to appear in AI-generated search results. As AI search engines like ChatGPT and Perplexity become more popular, GEO ensures your brand gets cited and recommended in AI responses, complementing traditional SEO strategies.'
  },

  // Technical SEO Tools
  {
    category: 'Technical SEO',
    question: 'How does the URL Inspection Tool work?',
    answer: 'Our URL Inspection Tool simulates Google Search Console\'s functionality, allowing you to check any URL\'s indexability, crawl status, Core Web Vitals, structured data implementation, and mobile-friendliness. It provides detailed SEO recommendations and identifies technical issues that may prevent proper indexing.'
  },
  {
    category: 'Technical SEO',
    question: 'What is the difference between Fetch & Render and Pre-rendering tools?',
    answer: 'The Fetch & Render tool simulates how Googlebot crawls and renders your pages, checking for JavaScript rendering issues and blocked resources. The Pre-rendering Testing Tool specifically verifies if your dynamic rendering or pre-rendering setup correctly serves content to search engine bots versus regular users.'
  },
  {
    category: 'Technical SEO',
    question: 'How can I test if my site is ready for mobile-first indexing?',
    answer: 'Use our Mobile-First Index Tool to compare your mobile and desktop versions, checking for content parity, technical signals, and mobile usability. The tool provides an AI-powered readiness audit with specific recommendations to ensure your site performs well under Google\'s mobile-first indexing.'
  },
  {
    category: 'Technical SEO',
    question: 'What is schema markup and why do I need it?',
    answer: 'Schema markup is structured data code that helps search engines understand your content better, enabling rich results like star ratings, FAQs, and product information in search results. Our Schema Markup Generator creates JSON-LD code for various types including articles, local businesses, products, events, and FAQs, improving your visibility and click-through rates.'
  },
  {
    category: 'Technical SEO',
    question: 'How do I bulk test multiple pages for mobile-friendliness?',
    answer: 'Our Mobile-Friendly Test (Bulk) tool allows you to analyze up to 50 URLs simultaneously for mobile usability issues, viewport configuration, touch element sizing, and content rendering. You can export detailed reports showing which pages need optimization.'
  },
  {
    category: 'Technical SEO',
    question: 'What are AMP pages and should I validate them?',
    answer: 'Accelerated Mobile Pages (AMP) are lightweight HTML pages designed for fast mobile loading. Our AMP Validator performs bulk validation to ensure your AMP pages comply with specifications, checks for linked canonical URLs, and identifies validation errors that could prevent AMP functionality.'
  },
  {
    category: 'Technical SEO',
    question: 'How do I create an XML sitemap for my website?',
    answer: 'Use our XML Sitemap Generator to create professional sitemaps by adding URLs, setting priorities, defining change frequencies, and configuring last modification dates. The tool generates standards-compliant sitemap.xml files that you can download and submit to Google Search Console and Bing Webmaster Tools.'
  },
  {
    category: 'Technical SEO',
    question: 'Can I test my structured data for rich results eligibility?',
    answer: 'Yes, our Rich Results Test tool validates your structured data markup and shows which rich result types (recipes, products, FAQs, reviews, etc.) your page qualifies for. It identifies errors and warnings that need fixing for proper rich snippet display in search results.'
  },

  // Ad Mockup Tools
  {
    category: 'Ad Mockups',
    question: 'How do I create realistic Google Search Ads previews?',
    answer: 'Our Google Ad Mockup Generator lets you visualize search ads with headlines, descriptions, extensions (sitelinks, callouts, structured snippets), and display URLs. Preview how ads appear on both desktop and mobile search results before launching campaigns.'
  },
  {
    category: 'Ad Mockups',
    question: 'Can I preview Facebook ads before spending money on campaigns?',
    answer: 'Absolutely! The Facebook Ad Mockup Generator creates realistic feed ad previews showing your copy, creative images, CTA buttons, and social proof elements exactly as they would appear in users\' Facebook feeds. Perfect for client presentations and A/B testing concepts.'
  },
  {
    category: 'Ad Mockups',
    question: 'What TikTok ad formats can I preview?',
    answer: 'Our TikTok Ad Preview Tool supports Brand Takeover and In-Feed ad formats. Upload your creative assets to visualize them in a realistic TikTok environment with device frame simulation and safe zone guides, ensuring your ads look perfect before launch.'
  },
  {
    category: 'Ad Mockups',
    question: 'Do I need design skills to create ad mockups?',
    answer: 'No design skills required! Simply input your ad copy, upload images, and our tools instantly generate professional-looking mockups. This helps you visualize campaigns, get client approval, and test different creative approaches without expensive design software.'
  },

  // Marketing Calculators
  {
    category: 'Marketing Calculators',
    question: 'How do I calculate ROI for my marketing campaigns?',
    answer: 'Use our Campaign ROI Calculator by entering your total campaign cost, revenue generated, and conversion data. The tool calculates ROI percentage, profit, ROAS (Return on Ad Spend), and cost per acquisition (CPA), helping you evaluate campaign performance and make data-driven decisions.'
  },
  {
    category: 'Marketing Calculators',
    question: 'What is ROAS and how is it different from ROI?',
    answer: 'ROAS (Return on Ad Spend) measures revenue generated per dollar spent on advertising (Revenue ÷ Ad Spend), while ROI measures overall profitability including all costs. ROAS focuses specifically on advertising efficiency, while ROI provides a broader view of campaign profitability. Both metrics are calculated in our ROI Calculator.'
  },
  {
    category: 'Marketing Calculators',
    question: 'How do I plan my advertising budget effectively?',
    answer: 'Our Ad Budget Planner helps you calculate required budgets based on revenue goals, target ROAS, average CPC, and conversion rates. Input your objectives and the tool forecasts budget needs, expected clicks, conversions, and break-even points to ensure profitable campaigns.'
  },
  {
    category: 'Marketing Calculators',
    question: 'What is Customer Lifetime Value (CLV) and why does it matter?',
    answer: 'Customer Lifetime Value (CLV or LTV) represents the total revenue a customer generates over their entire relationship with your business. Our CLV Calculator helps you determine sustainable customer acquisition costs (CAC), showing how much you can spend to acquire customers while remaining profitable.'
  },
  {
    category: 'Marketing Calculators',
    question: 'How can improving my landing page conversion rate impact revenue?',
    answer: 'Our Landing Page Impact Calculator quantifies the revenue impact of CVR improvements. Input your current traffic, conversion rate, and average order value, then see projected revenue gains from various conversion rate optimization scenarios. Small CVR improvements can dramatically increase profitability.'
  },
  {
    category: 'Marketing Calculators',
    question: 'What is the best way to track campaign performance with UTM parameters?',
    answer: 'Use our UTM Tag Generator to create trackable URLs with utm_source, utm_medium, utm_campaign, utm_term, and utm_content parameters. These tagged URLs enable precise tracking in Google Analytics and other analytics platforms, showing exactly which campaigns, ads, and channels drive results.'
  },
  {
    category: 'Marketing Calculators',
    question: 'How do I calculate Enterprise SEO ROI?',
    answer: 'Our Enterprise SEO ROI Calculator projects organic revenue growth, calculates payback periods, and estimates net profit from enterprise SEO investments. Input your traffic goals, conversion data, and SEO costs to build a business case for large-scale SEO initiatives.'
  },

  // SaaS & Business Tools
  {
    category: 'SaaS & Business',
    question: 'How do I evaluate if upgrading my SaaS plan is worth it?',
    answer: 'Our SaaS Pricing ROI Tool calculates the return on investment for plan upgrades by analyzing time savings, efficiency gains, and revenue impact. Compare costs against productivity improvements to determine if premium features justify higher subscription costs.'
  },
  {
    category: 'SaaS & Business',
    question: 'What is customer churn and how much does it cost my business?',
    answer: 'Customer churn is the rate at which customers stop subscribing to your service. Our Churn Impact Calculator quantifies revenue losses from churn and shows the financial value of retention improvements. Even small churn reductions can significantly impact MRR (Monthly Recurring Revenue) and long-term profitability.'
  },
  {
    category: 'SaaS & Business',
    question: 'How do I calculate ROI for B2B software investments?',
    answer: 'The Software ROI Calculator evaluates B2B software purchases by comparing implementation costs (licensing, setup, training) against productivity savings and efficiency gains. Get multi-year projections and total cost of ownership analysis to justify software investments to stakeholders.'
  },
  {
    category: 'SaaS & Business',
    question: 'What is EBITDA and why is it important?',
    answer: 'EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) measures operating performance by showing profitability before non-operating expenses. Our EBITDA Calculator supports both Net Income and Revenue methods, helping businesses analyze operational efficiency and compare performance across periods.'
  },

  // Tax & Finance Tools
  {
    category: 'Tax & Finance',
    question: 'How do I add or remove VAT from prices?',
    answer: 'Our VAT Calculator supports both operations: add VAT to net prices to get gross amounts, or remove VAT from gross prices to find net amounts. Set custom VAT rates (standard rates like 20%, 19%, 10%, or any custom percentage) and instantly calculate tax amounts and totals.'
  },
  {
    category: 'Tax & Finance',
    question: 'Can I calculate corporate taxes for different US states?',
    answer: 'Yes, our US Corporate Tax Calculator estimates federal and state corporate income tax liabilities for all 50 states. Simply enter your taxable income and select your state to see the combined federal and state tax burden, effective tax rate, and after-tax income for 2025.'
  },
  {
    category: 'Tax & Finance',
    question: 'How does Australian company tax work for Base Rate Entities?',
    answer: 'Our Australian Company Tax Calculator handles both Base Rate Entities (25% tax rate) and Standard Rate companies (30% tax rate). Base Rate Entities must meet specific criteria related to passive income and turnover. The calculator helps determine eligibility and calculates accurate tax liabilities for FY 2023-2025.'
  },
  {
    category: 'Tax & Finance',
    question: 'What are the 2024-2025 Stage 3 tax cuts in Australia?',
    answer: 'The Stage 3 tax cuts restructured Australian income tax brackets and rates, providing tax relief for most taxpayers. Our Simple Tax Calculator (AU) includes the updated 2024-2025 brackets, Medicare levy calculations, and handles both resident and non-resident tax calculations accurately.'
  },

  // SERP & Preview Tools
  {
    category: 'SERP & Preview',
    question: 'How do I optimize my meta title and description for Google?',
    answer: 'Use our Google SERP Simulator to preview exactly how your title tags and meta descriptions appear in search results. The tool highlights keywords, shows character limits (titles: ~60 chars, descriptions: ~160 chars), and provides both mobile and desktop previews to maximize click-through rates.'
  },
  {
    category: 'SERP & Preview',
    question: 'What are the recommended character limits for SEO titles and descriptions?',
    answer: 'Title tags should be 50-60 characters to avoid truncation in search results. Meta descriptions should be 150-160 characters for optimal display. Our SERP Simulator shows real-time character counts and visual previews to ensure your metadata displays correctly on both mobile and desktop devices.'
  },

  // Pricing & Plans
  {
    category: 'Pricing',
    question: 'What\'s the difference between Free and Premium plans?',
    answer: 'Free plans offer basic access to essential tools with usage limits. Premium plans ($19/month) provide unlimited access to all 30+ tools, priority support, bulk operations, advanced features, export capabilities, and no usage restrictions. Professional ($49/month) and Enterprise ($99/month) plans add team features, API access, and white-label options.'
  },
  {
    category: 'Pricing',
    question: 'Do you offer annual billing discounts?',
    answer: 'Yes! Annual billing saves you 2 months (equivalent to ~17% discount). Premium is $190/year (vs $228), Professional is $490/year (vs $588), and Enterprise is $990/year (vs $1,188). Annual subscribers also get priority support and early access to new features.'
  },
  {
    category: 'Pricing',
    question: 'Can I cancel my subscription anytime?',
    answer: 'Absolutely. All subscriptions can be canceled anytime from your dashboard with no cancellation fees. You\'ll retain access until the end of your current billing period. We also offer a 14-day money-back guarantee if you\'re not satisfied with our Premium features.'
  },

  // Data & Privacy
  {
    category: 'Data & Privacy',
    question: 'Is my data secure on Perf X Ads?',
    answer: 'Yes. We use enterprise-grade security including SSL encryption, secure authentication, and data isolation. We never sell your data to third parties. Tool inputs and calculations are processed securely and can be deleted anytime from your dashboard. Read our Privacy Policy for full details.'
  },
  {
    category: 'Data & Privacy',
    question: 'Do you store the data I enter into calculators and tools?',
    answer: 'Logged-in users can optionally save their work for future reference. Guest users\' inputs are processed client-side when possible and not stored. You have full control to delete saved data anytime from your account settings. We comply with GDPR and data protection regulations.'
  },

  // Integration & Export
  {
    category: 'Integration',
    question: 'Can I export my calculations and reports?',
    answer: 'Premium and Professional users can export results as PDF reports, CSV files, or JSON data depending on the tool. Exports include detailed breakdowns, charts, and professional formatting suitable for client presentations and stakeholder reports.'
  },
  {
    category: 'Integration',
    question: 'Does Perf X Ads offer an API?',
    answer: 'API access is available for Professional and Enterprise plans. Our RESTful API allows you to integrate Perf X Ads tools into your existing workflows, automate calculations, and build custom applications. Documentation and API keys are provided in your dashboard.'
  },

  // Support & Training
  {
    category: 'Support',
    question: 'How do I get help if I\'m stuck using a tool?',
    answer: 'Each tool includes built-in help tooltips and examples. Premium users get email support with 24-hour response times. Professional and Enterprise users receive priority support via email and live chat. We also offer video tutorials and comprehensive documentation.'
  },
  {
    category: 'Support',
    question: 'Do you provide training for teams?',
    answer: 'Enterprise plans include onboarding sessions and team training. We offer customized training workshops covering tool usage, best practices, and workflow optimization. Contact our sales team to schedule training for your organization.'
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(FAQ_DATA.map(faq => faq.category)))];
  
  const filteredFAQs = selectedCategory === 'All' 
    ? FAQ_DATA 
    : FAQ_DATA.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-brand-light/50 to-white dark:from-brand-dark/50 dark:to-brand-dark">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-primary/10 mb-6">
            <HelpCircle className="w-8 h-8 text-brand-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-brand-dark/60 max-w-2xl mx-auto">
            Everything you need to know about Perf X Ads tools, features, pricing, and more.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex gap-2 min-w-max">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setOpenIndex(null);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                    : 'bg-brand-surface text-brand-dark/70 hover:bg-brand-light hover:text-brand-dark'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-brand-surface rounded-2xl border border-brand-border shadow-sm hover:shadow-md transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-start justify-between p-6 text-left group"
                aria-expanded={openIndex === index}
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold text-brand-primary/60 uppercase tracking-wider mt-1">
                      {faq.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark group-hover:text-brand-primary transition-colors mt-2">
                    {faq.question}
                  </h3>
                </div>
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-lg bg-brand-light flex items-center justify-center transition-all duration-300 ${
                    openIndex === index ? 'rotate-180 bg-brand-primary/10' : ''
                  }`}
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-colors ${
                      openIndex === index ? 'text-brand-primary' : 'text-brand-dark/40'
                    }`}
                  />
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 pt-2">
                  <div className="pl-0 border-l-0">
                    <p className="text-brand-dark/70 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-brand-primary/5 to-purple-500/5 rounded-2xl border border-brand-primary/10">
          <h3 className="text-xl font-bold text-brand-dark mb-2">
            Still have questions?
          </h3>
          <p className="text-brand-dark/60 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:support@perfxads.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-brand-primary/25"
            >
              Contact Support
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('.pricing-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-brand-surface text-brand-dark border border-brand-border rounded-xl font-bold hover:bg-brand-light transition-all"
            >
              View Pricing
            </a>
          </div>
        </div>

        {/* Schema Markup for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": FAQ_DATA.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })
          }}
        />
      </div>
    </section>
  );
};

export default FAQ;
