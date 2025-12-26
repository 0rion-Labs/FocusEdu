'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';

import Navbar from '@/app/components/Navbar';
import { Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend
);

/* ---------------- TYPES ---------------- */

interface ResumeDoc {
  id: string;
  overallScore: number;
  analysis: {
    sections: {
      title: string;
      score: number;
    }[];
  };
  createdAt: Timestamp;
  isPinned?: boolean;
}

/* ---------------- COURSE MAP (MATCHES SECTION TITLES) ---------------- */

const COURSE_MAP: Record<
  string,
  { threshold: number; youtube: string; udemy: string }
> = {
  'Technical Skills': {
    threshold: 75,
    youtube:
      'https://www.youtube.com/results?search_query=technical+skills+software+developer',
    udemy:
      'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
  },
  Projects: {
    threshold: 70,
    youtube:
      'https://www.youtube.com/results?search_query=real+world+software+projects',
    udemy:
      'https://www.udemy.com/course/full-stack-projects/',
  },
  Experience: {
    threshold: 75,
    youtube:
      'https://www.youtube.com/results?search_query=software+engineering+internship',
    udemy:
      'https://www.udemy.com/course/software-engineering-career-guide/',
  },
};

/* ================= PAGE ================= */

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<ResumeDoc[]>([]);
  const [activeTab, setActiveTab] = useState<
    'trend' | 'grade' | 'sections' | 'skills' | 'history' | 'export'
  >('trend');
  const [loading, setLoading] = useState(true);

  /* ---------------- AUTH ---------------- */

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.push('/login');
      else setUser(u);
    });
    return () => unsub();
  }, [router]);

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const q = query(
        collection(db, 'resumeAnalysis'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const snap = await getDocs(q);
      setData(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }))
      );
      setLoading(false);
    };

    fetchData();
  }, [user]);

  /* ---------------- HELPERS ---------------- */

  const getGrade = (s: number) =>
    s >= 80 ? 'A' : s >= 65 ? 'B' : s >= 50 ? 'C' : 'D';

  const pinResume = async (id: string) => {
    await updateDoc(doc(db, 'resumeAnalysis', id), { isPinned: true });
    setData((prev) =>
      prev.map((r) => ({ ...r, isPinned: r.id === id }))
    );
  };

  const streak = () => {
    let s = 0;
    for (let i = data.length - 1; i > 0; i--) {
      if (data[i - 1].overallScore > data[i].overallScore) s++;
      else break;
    }
    return s;
  };

  /* ---------------- CHART DATA ---------------- */

  const trendData = {
    labels: [...data].reverse().map((d) =>
      d.createdAt.toDate().toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Resume Score',
        data: [...data].reverse().map((d) => d.overallScore),
        borderColor: '#8b5cf6',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative">
      {/* Decorative gradient orbs */}
      <div className="fixed top-1/4 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse pointer-events-none z-0"></div>
      <div className="fixed bottom-1/4 -right-32 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl animate-pulse pointer-events-none z-0" style={{ animationDelay: '1s' }}></div>
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10 pt-24 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-lg">📊 Resume Dashboard</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/resume-analysis"
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl transition-all border-0 text-sm font-semibold shadow-md hover:shadow-violet-500/20"
            >
              Resume Analysis
            </Link>
            <Link
              href="/github-analysis"
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl transition-all text-sm font-semibold shadow-md hover:shadow-indigo-500/20"
            >
              GitHub Analysis
            </Link>
            <Link
              href="/internship"
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl transition-all text-sm font-semibold shadow-md hover:shadow-emerald-500/20"
            >
              Internship
            </Link>
          </div>
        </div>

        {/* STREAK */}
        <div className="mb-6 p-6 bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80 rounded-2xl shadow-lg flex items-center gap-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-violet-400/30 to-fuchsia-400/30 text-3xl">
            🏆
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Improvement Streak</h3>
            <p className="text-3xl font-bold text-yellow-300">{streak()} <span className="text-2xl">🔥</span></p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            ['grade', '🅰️ Grades'],
            ['sections', '📊 Sections'],
            ['skills', '🧠 Skills'],
            ['history', '📄 History'],
            ['export', '📥 Export'],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setActiveTab(k as any)}
              className={`px-5 py-2 rounded-xl border font-semibold shadow-sm transition-all duration-200 text-base focus:outline-none focus:ring-2 focus:ring-violet-500/50
                ${activeTab === k
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 border-violet-400 text-white scale-105 shadow-violet-500/20'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700/80 hover:text-white'}
              `}
            >
              {l}
            </button>
          ))}
        </div>

        {/* TREND */}
        {activeTab === 'trend' && (
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <Line data={trendData} />
          </div>
        )}

        {/* GRADES */}
        {activeTab === 'grade' && (
          <div className="grid md:grid-cols-3 gap-6">
            {data.map((d) => (
              <div key={d.id} className="p-6 bg-slate-900/80 border border-violet-700/30 rounded-2xl shadow-md hover:shadow-violet-500/20 transition-all duration-200 group relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-full blur-2xl z-0"></div>
                <div className="relative z-10">
                  <p className="text-sm text-slate-400 mb-2">
                    {d.createdAt.toDate().toLocaleDateString()}
                  </p>
                  <p className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow">
                    Grade {getGrade(d.overallScore)}
                  </p>
                  <button
                    onClick={() => pinResume(d.id)}
                    className="mt-3 px-4 py-1.5 bg-yellow-400/90 hover:bg-yellow-300 text-black rounded-full font-semibold shadow hover:scale-105 transition-all"
                  >
                    📌 Pin
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECTION RADAR */}
        {activeTab === 'sections' && data[0] && (
          <div className="bg-slate-900/80 p-8 rounded-2xl border border-violet-700/30 shadow-md">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Section Breakdown</h2>
            <Radar
              data={{
                labels: data[0].analysis.sections.map((s) => s.title),
                datasets: [
                  {
                    label: 'Section Scores',
                    data: data[0].analysis.sections.map((s) => s.score),
                    backgroundColor: 'rgba(139,92,246,0.3)',
                    borderColor: '#8b5cf6',
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: { labels: { color: '#a78bfa', font: { size: 16 } } },
                },
                scales: {
                  r: {
                    angleLines: { color: '#a78bfa' },
                    grid: { color: '#a78bfa22' },
                    pointLabels: { color: '#f3e8ff', font: { size: 14 } },
                    ticks: { color: '#a78bfa', backdropColor: 'transparent' },
                  },
                },
              }}
            />
          </div>
        )}

        {/* 🧠 SKILL IMPROVEMENT — FIXED */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Skill Improvement</h2>
            {data[0]?.analysis.sections.map((s: any) => {
              const key = s.title.toLowerCase();
              let rec = null;
              if (key.includes('skill')) rec = COURSE_MAP.Skills;
              else if (key.includes('project')) rec = COURSE_MAP.Projects;
              else if (key.includes('experience')) rec = COURSE_MAP.Experience;
              else if (key.includes('education')) rec = COURSE_MAP.Education;
              if (!rec) return null;
              const needsHelp = s.score < rec.threshold;
              return (
                <div
                  key={s.title}
                  className="p-6 bg-slate-900/80 border border-fuchsia-700/30 rounded-2xl shadow-md hover:shadow-fuchsia-500/20 transition-all duration-200 group"
                >
                  <h3 className="text-lg font-semibold mb-2 text-white">{s.title}</h3>
                  <p className="text-sm text-slate-400 mb-3">
                    Score: <span className="font-bold text-violet-400">{s.score}</span> / Target: <span className="font-bold text-fuchsia-400">{rec.threshold}</span>
                  </p>
                  {needsHelp ? (
                    <div className="flex gap-3">
                      <a
                        href={rec.youtube}
                        target="_blank"
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg text-white font-semibold shadow hover:scale-105 transition-all"
                      >
                        ▶ YouTube
                      </a>
                      <a
                        href={rec.udemy}
                        target="_blank"
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-lg text-white font-semibold shadow hover:scale-105 transition-all"
                      >
                        🎓 Udemy
                      </a>
                    </div>
                  ) : (
                    <p className="text-emerald-400 text-sm font-semibold">
                      ✅ Strong performance — keep going
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}


        {/* HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {data.map((d) => (
              <div
                key={d.id}
                onClick={() => router.push(`/analysis/${d.id}`)}
                className="cursor-pointer p-4 bg-slate-900 rounded-xl hover:bg-slate-800"
              >
                <p className="text-sm text-slate-400">
                  {d.createdAt.toDate().toLocaleString()}
                </p>
                <p>Score: {d.overallScore}</p>
              </div>
            ))}
          </div>
        )}
        {/*Analysis History */}
        {/* 📄 RESUME HISTORY LIST */}
{activeTab === 'history' && (
  <section className="space-y-4">
    {data.map((resume) => (
      <div
        key={resume.id}
        onClick={() => router.push(`/analysis/${resume.id}`)}
        className={`cursor-pointer p-5 rounded-xl border transition
          ${
            resume.isPinned
              ? 'bg-yellow-500/10 border-yellow-400'
              : 'bg-slate-900 border-slate-700 hover:bg-slate-800'
          }
        `}
      >
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-slate-400">
            {resume.createdAt.toDate().toLocaleString()}
          </p>

          {resume.isPinned && (
            <span className="px-3 py-1 text-xs bg-yellow-400 text-black rounded-full">
              📌 Pinned
            </span>
          )}
        </div>

        <p className="text-lg font-semibold">
          Overall Score: {resume.overallScore}
        </p>

        <div className="mt-3 grid md:grid-cols-2 gap-2">
          {resume.analysis.sections.slice(0, 4).map((s) => (
            <div
              key={s.title}
              className="text-sm bg-slate-800 rounded-md px-3 py-2"
            >
              {s.title}: <span className="font-semibold">{s.score}</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-violet-400 text-sm">
          Click to view full analysis →
        </p>
      </div>
    ))}
  </section>
)}


        {/* EXPORT */}
        {activeTab === 'export' && (
          <div className="p-6 bg-slate-900 rounded-xl">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-violet-600 rounded-lg"
            >
              Download PDF
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
