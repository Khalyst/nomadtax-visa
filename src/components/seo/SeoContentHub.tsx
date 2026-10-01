import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Share2, 
  ExternalLink,
  ChevronDown,
  ArrowLeft,
  Calculator
} from 'lucide-react';
import { SEO_ARTICLES, SEOArticle } from '../../data/seoArticles';

interface SeoContentHubProps {
  onSelectCalculatorTab?: (tab: string) => void;
}

export const SeoContentHub: React.FC<SeoContentHubProps> = ({ onSelectCalculatorTab }) => {
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const activeArticle = SEO_ARTICLES.find(a => a.id === activeArticleId);

  const filteredArticles = SEO_ARTICLES.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesQuery = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summaryPoints.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const handleShareArticle = (article: SEOArticle) => {
    if (navigator.clipboard) {
      const shareUrl = `${window.location.origin}/#guide=${article.slug}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleGoToCalculator = (presetAction?: string) => {
    if (onSelectCalculatorTab && presetAction) {
      onSelectCalculatorTab(presetAction);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If viewing a single in-depth article
  if (activeArticle) {
    // Generate JSON-LD Schema structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": activeArticle.schemaType === 'FAQPage' ? "FAQPage" : "Article",
      "headline": activeArticle.title,
      "description": activeArticle.metaDescription,
      "dateModified": "2026-10-01",
      "author": {
        "@type": "Organization",
        "name": activeArticle.author,
        "url": "https://nomadtaxvisa.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "NomadTax & Visa Worldwide",
        "url": "https://nomadtaxvisa.com"
      },
      ...(activeArticle.faqs.length > 0 ? {
        "mainEntity": activeArticle.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      } : {})
    };

    return (
      <article className="py-6 max-w-4xl mx-auto space-y-8 animate-fadeIn">
        {/* Schema.org script injection */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Back navigation & Share */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            onClick={() => setActiveArticleId(null)}
            className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Compliance Knowledge Base
          </button>

          <button
            onClick={() => handleShareArticle(activeArticle)}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-xs text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
            {copiedLink ? 'Link Copied!' : 'Share Guide'}
          </button>
        </div>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
              {activeArticle.categoryLabel}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {activeArticle.readingTime}
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              Updated {activeArticle.updatedDate}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {activeArticle.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {activeArticle.subtitle}
          </p>

          <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified by {activeArticle.author}</span>
          </div>
        </header>

        {/* Key Takeaways Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-900/40 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Executive Summary & Key Takeaways</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {activeArticle.summaryPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interactive CTA Banner */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">Interactive Tool</span>
            <h4 className="text-sm sm:text-base font-semibold text-white">{activeArticle.actionPrompt.heading}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{activeArticle.actionPrompt.subtext}</p>
          </div>
          <button
            onClick={() => handleGoToCalculator(activeArticle.actionPrompt.presetAction)}
            className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-indigo-600/30 shrink-0"
          >
            <Calculator className="w-4 h-4" />
            Launch Calculator
          </button>
        </div>

        {/* Table of Contents */}
        <nav className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Table of Contents
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeArticle.tableOfContents.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1.5"
              >
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Main Body HTML Content */}
        <div 
          className="prose prose-invert prose-indigo max-w-none space-y-6 pt-2"
          dangerouslySetInnerHTML={{ __html: activeArticle.contentHtml }}
        />

        {/* Interactive FAQ Section with Schema.org optimization */}
        {activeArticle.faqs.length > 0 && (
          <section id="faq-section" className="space-y-4 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <h3 className="text-xl font-bold text-white">Frequently Asked Questions</h3>
            </div>
            <div className="space-y-3">
              {activeArticle.faqs.map((faq, idx) => {
                const isOpen = expandedFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-800 bg-slate-900/80 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                      className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 text-sm font-semibold text-slate-200 hover:text-white"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Bottom Floating Return Button */}
        <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
          <button
            onClick={() => setActiveArticleId(null)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Guides
          </button>

          <button
            onClick={() => handleGoToCalculator(activeArticle.actionPrompt.presetAction)}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            Open Calculator
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </article>
    );
  }

  // Knowledge Base Catalog View
  return (
    <div className="space-y-8 py-4">
      {/* Knowledge Hub Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/50 border border-indigo-900/40 p-6 sm:p-8">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Digital Nomad Global Compliance Knowledge Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Authoritative Guides on Visas, Tax Residency & Legal Stay Limits
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            In-depth legal analysis, calculation breakdowns, and official immigration regulatory references for remote workers, frequent flyers, and global citizens.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Guides' },
            { id: 'schengen', label: 'Schengen 90/180' },
            { id: 'us-spt', label: 'US SPT' },
            { id: 'tax-residency', label: '183-Day Tax' },
            { id: 'digital-nomad-visas', label: 'Nomad Visas' },
          ].map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search rules, countries, visas..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredArticles.map(article => (
          <div
            key={article.id}
            onClick={() => setActiveArticleId(article.id)}
            className="group cursor-pointer rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-indigo-500/50 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {article.categoryLabel}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readingTime}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                {article.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                {article.subtitle}
              </p>

              {/* Bullet highlights */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                {article.summaryPoints.slice(0, 2).map((point, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-xs text-slate-400">Updated {article.updatedDate}</span>
              <span className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1">
                Read Complete Guide
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-sm">
          No compliance guides match your search query. Try searching for "Schengen", "183 days", or "Thailand".
        </div>
      )}
    </div>
  );
};
