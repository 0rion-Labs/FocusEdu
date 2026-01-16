'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';

import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';


/* ================= SKILL MISMATCH LOGIC ================= */

const normalizeSkill = (skill: string) =>
  skill.toLowerCase().replace(/[^a-z0-9+#]/g, '');

const calculateSkillMismatch = (
  resumeSkills: string[],
  githubLanguages: string[]
) => {
  const resumeSet = new Set(resumeSkills.map(normalizeSkill));
  const githubSet = new Set(githubLanguages.map(normalizeSkill));

  const matched: string[] = [];
  const claimedNotUsed: string[] = [];
  const usedNotClaimed: string[] = [];

  resumeSet.forEach(skill => {
    if (githubSet.has(skill)) matched.push(skill);
    else claimedNotUsed.push(skill);
  });

  
  githubSet.forEach(skill => {
    if (!resumeSet.has(skill)) usedNotClaimed.push(skill);
  });

  const mismatchScore = Math.round(
    (claimedNotUsed.length / Math.max(resumeSet.size, 1)) * 100
  );

  return {
    matched,
    claimedNotUsed,
    usedNotClaimed,
    mismatchScore,
  };
};
const fetchLatestResumeSkills = async (userId: string): Promise<string[]> => {
  const q = query(
    collection(db, 'resumeAnalysis'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return [];

  const doc = snapshot.docs[0].data();

  // 🔁 Adjust this path if your structure differs
  return doc.analysis?.skills || [];
};


/* ================= TYPES ================= */

interface GitHubAnalysisResult {
  overallScore: number;
  username: string;
  profileUrl: string;
  metrics: {
    languages: Array<{ language: string; repoCount: number; percentage: number }>;
    activity: {
      totalRepos: number;
      recentCommits: boolean;
      daysSinceLastActivity: number | null;
      activeReposCount: number;
      score: number;
    };
    complexity: {
      averageRepoSize: number;
      hasAdvancedProjects: boolean;
      totalStars: number;
      totalForks: number;
      score: number;
    };
    recentActivity: {
      reposUpdatedLast6Months: number;
      reposUpdatedLast12Months: number;
      mostActiveMonth: string;
      score: number;
    };
    openSource: {
      totalStars: number;
      totalForks: number;
      averageStarsPerRepo: number;
      topStarredRepo: string;
      score: number;
    };
  };
  summary: string;
  recommendations: string[];
}

/* ================= COMPONENT ================= */

export default function GitHubAnalysisPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<GitHubAnalysisResult | null>(null);
  const [skillMismatch, setSkillMismatch] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  /* ================= AUTH ================= */

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, currentUser => {
      if (!currentUser) router.push('/login');
      else setUser(currentUser);
    });
    return () => unsub();
  }, [router]);

  /* ================= ANALYZE ================= */

  const analyzeGitHub = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    if (!user) {
      setError('You must be logged in');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setSkillMismatch(null);

    try {
      const response = await fetch('/api/github-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysis(data);

     
     // ✅ Fetch real resume skills from Firestore
const resumeSkills = await fetchLatestResumeSkills(user.uid);

if (resumeSkills.length === 0) {
  console.warn('No resume skills found for user');
}


     const githubLanguages = data.metrics.languages.map(
  (l: any) => l.language
);

const mismatch = calculateSkillMismatch(resumeSkills, githubLanguages);
setSkillMismatch(mismatch);


      await addDoc(collection(db, 'githubAnalysis'), {
        userId: user.uid,
        email: user.email,
        username: data.username,
        overallScore: data.overallScore,
        analysis: data,
        skillMismatch: mismatch,
        createdAt: serverTimestamp(),
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI HELPERS ================= */

  const getScoreColor = (score: number) =>
    score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';

  const getScoreBg = (score: number) =>
    score >= 80
      ? 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30'
      : score >= 60
      ? 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30'
      : 'from-red-500/20 to-red-500/5 border-red-500/30';

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* HEADER */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
            GitHub Profile Analysis
          </h1>
          <p className="text-slate-400 mt-4">
            Verify real skills using GitHub activity
          </p>
        </section>

        {/* INPUT */}
        <section className="mb-12">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8">
            <div className="flex gap-4">
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && analyzeGitHub()}
                placeholder="Enter GitHub username"
                className="flex-1 px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white"
              />
              <button
                onClick={analyzeGitHub}
                disabled={loading}
                className="px-8 py-4 bg-violet-600 rounded-xl text-white"
              >
                {loading ? 'Analyzing…' : 'Analyze'}
              </button>
            </div>

            {error && <p className="text-red-400 mt-4">{error}</p>}
          </div>
        </section>

        {/* RESULTS */}
        {analysis && (
          <section className="space-y-8">

            {/* OVERALL SCORE */}
            <div className={`p-8 rounded-3xl bg-gradient-to-br ${getScoreBg(analysis.overallScore)} border`}>
              <h2 className="text-3xl font-bold text-white">
                Overall Score:{' '}
                <span className={getScoreColor(analysis.overallScore)}>
                  {analysis.overallScore}/100
                </span>
              </h2>
              <p className="text-slate-300 mt-2">{analysis.summary}</p>
            </div>

            {/* GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* LANGUAGES */}
              <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4">💻 Languages</h3>
                {analysis.metrics.languages.slice(0, 5).map((l, i) => (
                  <div key={i} className="flex justify-between text-sm text-slate-300">
                    <span>{l.language}</span>
                    <span className="text-violet-400">{l.percentage}%</span>
                  </div>
                ))}
              </div>

              {/* ACTIVITY */}
              <div className="space-y-2 text-slate-300 text-sm">
  <p>
    <span className="text-slate-400">Total Repositories:</span>{' '}
    <span className="font-semibold text-white">
      {analysis.metrics.activity.totalRepos}
    </span>
  </p>

  <p>
    <span className="text-slate-400">Active Repositories:</span>{' '}
    <span className="font-semibold text-white">
      {analysis.metrics.activity.activeReposCount}
    </span>
  </p>

  {analysis.metrics.activity.daysSinceLastActivity !== null && (
    <p>
      <span className="text-slate-400">Last Activity:</span>{' '}
      <span className="font-semibold text-white">
        {analysis.metrics.activity.daysSinceLastActivity} days ago
      </span>
    </p>
  )}

  <p>
    <span className="text-slate-400">Recent Commits:</span>{' '}
    <span className={`font-semibold ${
      analysis.metrics.activity.recentCommits
        ? 'text-emerald-400'
        : 'text-red-400'
    }`}>
      {analysis.metrics.activity.recentCommits ? 'Yes' : 'No'}
    </span>
  </p>
</div>


              {/* COMPLEXITY */}
              <div className="space-y-2 text-slate-300 text-sm">
  <p>
    <span className="text-slate-400">Total Stars:</span>{' '}
    <span className="font-semibold text-white">
      {analysis.metrics.complexity.totalStars}
    </span>
  </p>

  <p>
    <span className="text-slate-400">Total Forks:</span>{' '}
    <span className="font-semibold text-white">
      {analysis.metrics.complexity.totalForks}
    </span>
  </p>

  <p>
    <span className="text-slate-400">Avg Repo Size:</span>{' '}
    <span className="font-semibold text-white">
      {analysis.metrics.complexity.averageRepoSize} KB
    </span>
  </p>

  <p>
    <span className="text-slate-400">Advanced Projects:</span>{' '}
    <span className={`font-semibold ${
      analysis.metrics.complexity.hasAdvancedProjects
        ? 'text-emerald-400'
        : 'text-slate-400'
    }`}>
      {analysis.metrics.complexity.hasAdvancedProjects ? 'Yes' : 'No'}
    </span>
  </p>
</div>
<div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
  <h3 className="text-xl font-bold text-white mb-4">⭐ Open Source</h3>

  <div className="space-y-2 text-slate-300 text-sm">
    <p>
      <span className="text-slate-400">Total Stars:</span>{' '}
      <span className="font-semibold text-white">
        {analysis.metrics.openSource.totalStars}
      </span>
    </p>

    <p>
      <span className="text-slate-400">Total Forks:</span>{' '}
      <span className="font-semibold text-white">
        {analysis.metrics.openSource.totalForks}
      </span>
    </p>

    <p>
      <span className="text-slate-400">Avg Stars / Repo:</span>{' '}
      <span className="font-semibold text-white">
        {analysis.metrics.openSource.averageStarsPerRepo}
      </span>
    </p>

    <p>
      <span className="text-slate-400">Top Repo:</span>{' '}
      <span className="font-semibold text-violet-400 truncate block">
        {analysis.metrics.openSource.topStarredRepo}
      </span>
    </p>
  </div>
</div>


              {/* SKILL MISMATCH */}
              {skillMismatch && (
                <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
                  <h3 className="text-xl font-bold text-white mb-4">🧠 Skill Consistency</h3>
                  <p className="text-slate-400 mb-3">
                    Match Accuracy:{' '}
                    <span className="text-violet-400 font-bold">
                      {100 - skillMismatch.mismatchScore}%
                    </span>
                  </p>
                  <p className="text-emerald-400">✔ {skillMismatch.matched.join(', ') || 'None'}</p>
                  <p className="text-yellow-400">⚠ {skillMismatch.claimedNotUsed.join(', ') || 'None'}</p>
                  <p className="text-sky-400">➕ {skillMismatch.usedNotClaimed.join(', ') || 'None'}</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
