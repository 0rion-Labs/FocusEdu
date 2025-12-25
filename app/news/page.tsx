"use client";
import React, { useState, useEffect } from 'react';
import Background from '../components/Background';
import Navbar from '../components/Navbar';
import { Skeleton } from '../components/ui/skeleton';
import { FiExternalLink, FiClock, FiTrendingUp } from 'react-icons/fi';
import { HiOutlineNewspaper } from 'react-icons/hi';

interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  thumbnail?: string;
  description?: string;
}

const NewsPage = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/news');
      
      const data = await response.json();
      console.log('API Response:', data);
      
      // Handle NewsData.io response format
      let articles: NewsArticle[] = [];
      if (data.results && Array.isArray(data.results)) {
        // NewsData.io format
        articles = data.results.map((item: any) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          source: item.source_name || item.source_id || 'News',
          thumbnail: item.image_url,
          description: item.description || '',
        }));
      } else if (Array.isArray(data)) {
        articles = data.map((item: any) => ({
          title: item.title,
          link: item.url || item.link,
          pubDate: item.date || item.publishedAt || item.pubDate,
          source: item.source?.name || item.source_name || 'News',
          thumbnail: item.thumbnail || item.image || item.image_url,
          description: item.excerpt || item.description || '',
        }));
      }
      
      setNews(articles);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="min-h-screen relative">
      <Background />
      <Navbar />
      
      <div className="relative z-10 pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tech{' '}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              News
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Stay updated with the latest technology news and trends
          </p>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <Skeleton className="w-full h-48 bg-white/10" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-24 bg-white/10" />
                  <Skeleton className="h-6 w-full bg-white/10" />
                  <Skeleton className="h-6 w-3/4 bg-white/10" />
                  <Skeleton className="h-4 w-full bg-white/10" />
                  <Skeleton className="h-4 w-2/3 bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16">
            <HiOutlineNewspaper className="text-6xl text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No news found</h3>
            <p className="text-zinc-400">Try selecting a different category</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((article, index) => (
              <a
                key={index}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/30 hover:bg-white/[0.07] transition-all duration-300"
              >
                {/* Thumbnail */}
                {article.thumbnail ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center">
                    <HiOutlineNewspaper className="text-5xl text-violet-400/50" />
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  {/* Source & Date */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-violet-400 uppercase tracking-wider">
                      {article.source || 'Tech News'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                      <FiClock className="text-xs" />
                      {formatDate(article.pubDate)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors line-clamp-2 mb-2">
                    {article.title}
                  </h3>

                  {/* Description */}
                  {article.description && (
                    <p className="text-sm text-zinc-500 line-clamp-2 mb-4">
                      {truncateText(article.description)}
                    </p>
                  )}

                  {/* Read More */}
                  <div className="flex items-center gap-1 text-sm text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors">
                    <span>Read more</span>
                    <FiExternalLink className="text-xs group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Trending Section */}
        {!loading && news.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <FiTrendingUp className="text-xl text-fuchsia-400" />
              <h2 className="text-2xl font-bold text-white">Trending Now</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {news.slice(0, 4).map((article, index) => (
                <a
                  key={`trending-${index}`}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-violet-500/30 hover:bg-white/[0.07] transition-all group"
                >
                  <span className="text-3xl font-bold bg-gradient-to-br from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white group-hover:text-violet-400 transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    <span className="text-xs text-zinc-500 mt-1 block">
                      {article.source} • {formatDate(article.pubDate)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
