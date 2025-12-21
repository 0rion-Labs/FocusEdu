// components/SearchBar.tsx
'use client';

import { useState } from 'react';
import { SkillLevel } from '@/lib/types';

interface Props {
  onSearch: (topic: string, skillLevel: SkillLevel) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading }: Props) {
  const [topic, setTopic] = useState('');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('beginner');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSearch(topic.trim(), skillLevel);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-3 items-stretch bg-slate-800/50 backdrop-blur-xl p-3 rounded-2xl border border-slate-700/50 shadow-2xl shadow-violet-500/5">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What do you want to learn? (e.g., React, Python, ML)"
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 text-base outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        
        <select
          value={skillLevel}
          onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
          disabled={isLoading}
          className="px-4 py-4 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white text-base font-medium outline-none cursor-pointer transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
        >
          <option value="beginner" className="bg-slate-900">🌱 Beginner</option>
          <option value="intermediate" className="bg-slate-900">📈 Intermediate</option>
          <option value="advanced" className="bg-slate-900">🚀 Advanced</option>
        </select>

        <button 
          type="submit" 
          disabled={isLoading || !topic.trim()}
          className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-violet-600 disabled:hover:to-fuchsia-600 hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 active:translate-y-0"
        >
          {isLoading ? (
            <span className="inline-block animate-spin">⟳</span>
          ) : (
            '🔍 Search'
          )}
        </button>
      </div>
    </form>
  );
}