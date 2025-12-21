// components/VideoCard.tsx
'use client';

import { YouTubeVideo, StarredCourse } from '@/lib/types';
import { addStarredCourse, removeStarredCourse, isCoursStarred } from '@/lib/storage';
import { useState, useEffect } from 'react';

interface Props {
  video: YouTubeVideo;
  onStarChange?: () => void;
}

export default function VideoCard({ video, onStarChange }: Props) {
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    setStarred(isCoursStarred(video.id, 'youtube'));
  }, [video.id]);

  const toggleStar = () => {
    if (starred) {
      removeStarredCourse(video.id, 'youtube');
      setStarred(false);
    } else {
      const starredCourse: StarredCourse = {
        id: video.id,
        title: video.title,
        type: 'youtube',
        url: video.url,
        thumbnail: video.thumbnail,
        starredAt: Date.now()
      };
      addStarredCourse(starredCourse);
      setStarred(true);
    }
    onStarChange?.();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/10 hover:border-slate-600">
      <div className="relative w-full pt-[56.25%] overflow-hidden bg-slate-900">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          className={`absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm border-none text-xl w-10 h-10 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-slate-900 hover:scale-110 ${starred ? 'text-yellow-400' : 'text-slate-400'}`}
          onClick={toggleStar}
          aria-label={starred ? 'Remove from starred' : 'Add to starred'}
        >
          {starred ? '★' : '☆'}
        </button>
        <div className="absolute bottom-3 left-3 px-2 py-1 bg-red-600 text-white text-xs font-medium rounded">
          YouTube
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="m-0 mb-2 text-base font-semibold leading-snug">
          <a 
            href={video.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white no-underline hover:text-violet-400 transition-colors"
          >
            {video.title}
          </a>
        </h3>
        
        <p className="m-0 mb-3 text-violet-400 text-sm font-medium">{video.channelTitle}</p>
        
        <p className="m-0 mb-3 text-slate-400 text-sm leading-relaxed">
          {video.description.slice(0, 120)}
          {video.description.length > 120 ? '...' : ''}
        </p>
        
        <div className="flex gap-3 mb-4 text-xs text-slate-500">
          <span>{formatDate(video.publishedAt)}</span>
        </div>
        
        <a 
          href={video.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg no-underline text-sm font-medium transition-all hover:-translate-y-0.5"
        >
          Watch on YouTube
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}