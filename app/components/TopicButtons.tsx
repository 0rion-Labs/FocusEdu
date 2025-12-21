// components/TopicButtons.tsx
'use client';

interface Props {
  onTopicClick: (topic: string) => void;
}

const POPULAR_TOPICS = [
  { name: 'React', icon: '⚛️', color: 'from-cyan-500 to-blue-500' },
  { name: 'Python', icon: '🐍', color: 'from-yellow-500 to-green-500' },
  { name: 'Machine Learning', icon: '🤖', color: 'from-orange-500 to-red-500' },
  { name: 'Data Science', icon: '📊', color: 'from-teal-500 to-emerald-500' },
  { name: 'Web Development', icon: '🌐', color: 'from-pink-500 to-rose-500' },
  { name: 'JavaScript', icon: '💛', color: 'from-yellow-400 to-amber-500' },
  { name: 'AI & Deep Learning', icon: '🧠', color: 'from-purple-500 to-violet-500' },
  { name: 'Cloud Computing', icon: '☁️', color: 'from-blue-500 to-indigo-500' }
];

export default function TopicButtons({ onTopicClick }: Props) {
  return (
    <div className="my-10">
      <h3 className="text-center text-xl font-semibold mb-8 text-white flex items-center justify-center gap-2">
        <span className="text-2xl">🔥</span> Popular Topics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {POPULAR_TOPICS.map((topic) => (
          <button
            key={topic.name}
            onClick={() => onTopicClick(topic.name)}
            className={`group relative flex items-center gap-3 p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl cursor-pointer transition-all duration-300 hover:bg-slate-800 hover:border-slate-600 hover:-translate-y-1 hover:shadow-xl overflow-hidden`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${topic.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            <span className="text-2xl relative z-10">{topic.icon}</span>
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors relative z-10">{topic.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}