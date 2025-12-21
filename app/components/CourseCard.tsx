// components/CourseCard.tsx
'use client';

import { UdemyCourse, StarredCourse } from '@/lib/types';
import { addStarredCourse, removeStarredCourse, isCoursStarred } from '@/lib/storage';
import { useState, useEffect } from 'react';

interface Props {
  course: UdemyCourse;
  onStarChange?: () => void;
}

export default function CourseCard({ course, onStarChange }: Props) {
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    setStarred(isCoursStarred(course.id, 'udemy'));
  }, [course.id]);

  const toggleStar = () => {
    if (starred) {
      removeStarredCourse(course.id, 'udemy');
      setStarred(false);
    } else {
      const starredCourse: StarredCourse = {
        id: course.id,
        title: course.title,
        type: 'udemy',
        url: course.url,
        starredAt: Date.now()
      };
      addStarredCourse(starredCourse);
      setStarred(true);
    }
    onStarChange?.();
  };

  const getLevelBadgeClass = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'intermediate':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/10 hover:border-slate-600">
      <div className="flex justify-between items-center p-5 pb-0">
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase border ${getLevelBadgeClass(course.level)}`}>
          {course.level}
        </div>
        <button
          className={`bg-transparent border-none text-2xl cursor-pointer transition-all duration-200 p-0 leading-none hover:scale-110 ${starred ? 'text-yellow-400' : 'text-slate-500 hover:text-slate-300'}`}
          onClick={toggleStar}
          aria-label={starred ? 'Remove from starred' : 'Add to starred'}
        >
          {starred ? '★' : '☆'}
        </button>
      </div>

      <div className="p-5">
        <h3 className="m-0 mb-3 text-lg font-semibold leading-snug text-white">{course.title}</h3>
        
        <p className="m-0 mb-3 text-slate-400 text-sm flex items-center gap-2">
          <span className="text-base">👨‍🏫</span>
          {course.instructor}
        </p>

        <p className="m-0 mb-4 text-slate-400 text-sm leading-relaxed">{course.description}</p>

        {course.rating && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-amber-400 text-base font-semibold">★ {course.rating.toFixed(1)}</span>
            <span className="text-slate-500 text-xs">Course Rating</span>
          </div>
        )}

        {course.isAiGenerated && (
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 text-violet-300 px-3 py-1.5 rounded-full text-xs font-medium mb-4">
            <span className="text-sm">✨</span>
            AI Recommended
          </div>
        )}

        <a 
          href={course.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-5 py-3 rounded-xl no-underline text-sm font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/25 w-full"
        >
          Explore on Udemy
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}