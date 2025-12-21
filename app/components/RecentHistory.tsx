// components/RecentHistory.tsx
'use client';

import { useEffect, useState } from 'react';
import { SearchHistory, SkillLevel } from '@/lib/types';
import { getSearchHistory, clearHistory } from '@/lib/storage';

interface Props {
  onHistoryClick: (topic: string, skillLevel: SkillLevel) => void;
  onUpdate?: () => void;
}

export default function RecentHistory({ onHistoryClick, onUpdate }: Props) {
  const [history, setHistory] = useState<SearchHistory[]>([]);

  const loadHistory = () => {
    setHistory(getSearchHistory());
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    loadHistory();
  }, [onUpdate]);

  const handleClear = () => {
    if (confirm('Clear all search history?')) {
      clearHistory();
      loadHistory();
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 my-8">
      <div className="flex justify-between items-center mb-5">
        <h3 className="m-0 text-lg font-semibold text-white flex items-center gap-2">
          <span>📜</span> Recent Searches
        </h3>
        <button 
          onClick={handleClear} 
          className="px-3 py-1.5 bg-transparent text-red-400 border border-red-400/50 rounded-lg text-xs font-medium cursor-pointer transition-all hover:bg-red-500/10 hover:border-red-400"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {history.map((item, index) => (
          <button
            key={index}
            onClick={() => onHistoryClick(item.topic, item.skillLevel)}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-3 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl cursor-pointer transition-all text-left hover:bg-slate-700/50 hover:border-slate-600 hover:translate-x-1"
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="font-medium text-white text-sm">{item.topic}</span>
              <span className="px-2 py-1 bg-violet-500/20 text-violet-400 border border-violet-500/30 rounded text-xs font-medium capitalize">
                {item.skillLevel}
              </span>
            </div>
            <span className="text-slate-500 text-xs whitespace-nowrap self-end md:self-auto">
              {formatTimestamp(item.timestamp)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}