// app/page.tsx
'use client';

import { useState } from 'react';
import Snowfall from 'react-snowfall'
import Link from 'next/link';
import SearchBar from '@/app/components/SearchBar';
import TopicButtons from '@/app/components/TopicButtons';
import VideoCard from '@/app/components/VideoCard';
import CourseCard from '@/app/components/CourseCard';
import RecentHistory from '@/app/components/RecentHistory';
import { YouTubeVideo, UdemyCourse, SkillLevel } from '@/lib/types';
import { addToHistory } from '@/lib/storage';

export default function HomePage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [courses, setCourses] = useState<UdemyCourse[]>([]);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [historyUpdate, setHistoryUpdate] = useState(0);

  const fetchRecommendations = async (topic: string, skillLevel: SkillLevel) => {
    setLoading(true);
    setError(null);
    setCurrentTopic(topic);
    setVideos([]);
    setCourses([]);
    setAiInsights('');

    try {
      // Add to history
      addToHistory(topic, skillLevel);
      setHistoryUpdate(prev => prev + 1);

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          skillLevel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setVideos(data.youtubeVideos || []);
      setCourses(data.udemyCourses || []);
      setAiInsights(data.aiInsights || '');
    } catch (err) {
      setError('Failed to load recommendations. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (topic: string) => {
    fetchRecommendations(topic, 'beginner');
  };

  const handleHistoryClick = (topic: string, skillLevel: SkillLevel) => {
    fetchRecommendations(topic, skillLevel);
  };

  return (
    
    
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Snowfall/>
      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-40 pointer-events-none -z-10"></div>
      
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="m-0 text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            🎓 FocusEdu <span className="text-xs text-slate-500 font-normal align-bottom">by Orion Labs</span>
          </h1>
          <nav className="flex gap-6">
            <Link href="/" className="text-slate-400 no-underline font-medium transition-all hover:text-white">
              Home
            </Link>
            <Link href="/suggestions" className="text-white no-underline font-medium relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-violet-500 after:to-fuchsia-500">
              AI Suggestions
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative">
        <section className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
            <span className="text-violet-400 text-sm font-medium">✨ AI-Powered Learning</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent leading-tight">
            Discover Your Perfect<br />Learning Path
          </h2>
          <p className="text-lg text-slate-400 m-0 max-w-2xl mx-auto">
            Get personalized YouTube videos and Udemy course recommendations powered by advanced AI
          </p>
        </section>

        <section className="mb-16">
          <SearchBar onSearch={fetchRecommendations} isLoading={loading} />
        </section>

        <TopicButtons onTopicClick={handleTopicClick} />

        <RecentHistory 
          onHistoryClick={handleHistoryClick}
          onUpdate={() => setHistoryUpdate(prev => prev + 1)}
        />

        {loading && (
          <div className="text-center py-20 px-5">
            <div className="w-14 h-14 mx-auto mb-6 border-4 border-slate-700 border-t-violet-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-lg">Finding the best learning resources for you...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-xl text-center backdrop-blur-sm">
            <p className="m-0">{error}</p>
          </div>
        )}

        {!loading && currentTopic && (
          <>
            {aiInsights && (
              <div className="relative overflow-hidden bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 text-white p-8 rounded-2xl mb-10 backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="m-0 mb-4 text-xl font-semibold flex items-center gap-2">
                  <span className="text-2xl">✨</span> AI Insights
                </h3>
                <p className="m-0 leading-relaxed text-slate-300">{aiInsights}</p>
              </div>
            )}

            {videos.length > 0 && (
              <section className="mb-14">
                <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                  <span className="text-3xl">📺</span> YouTube Videos for <span className="text-violet-400">{currentTopic}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </section>
            )}

            {courses.length > 0 && (
              <section className="mb-14">
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                  <span className="text-3xl">🎓</span> Recommended Udemy Courses
                </h2>
                <div className="bg-slate-800/50 border border-slate-700 text-slate-300 px-5 py-3 rounded-xl mb-8 text-sm backdrop-blur-sm flex items-center gap-2">
                  <span className="text-blue-400">ℹ️</span> These courses are AI-recommended based on your search. Click to explore similar courses on Udemy.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {!loading && !currentTopic && (
          <div className="text-center py-20 px-8 bg-slate-800/30 border border-slate-700/50 rounded-2xl backdrop-blur-sm">
            <div className="text-6xl mb-6">👋</div>
            <h3 className="text-2xl font-bold mb-3 text-white">Welcome to FocusedU!</h3>
            <p className="text-base text-slate-400 max-w-md mx-auto">Search for a topic or click on a popular topic above to discover personalized learning resources</p>
          </div>
        )}
      </main>
    </div>
  );
}