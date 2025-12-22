"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Snowfall from "react-snowfall";
import Navbar from "@/app/components/Navbar";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

/* ---------------- TYPES ---------------- */

interface AnalysisResult {
  overallScore: number;
  summary: string;
}

/* ---------------- COMPONENT ---------------- */

export default function ResumeAnalysisPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------- AUTH GUARD ---------------- */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  /* ---------------- LOAD USER DATA ---------------- */

  useEffect(() => {
    if (!user) return;

    const loadAnalysis = async () => {
      const snap = await getDoc(doc(db, "resumeAnalysis", user.uid));
      if (snap.exists()) {
        setAnalysis(snap.data().analysis);
      }
    };

    loadAnalysis();
  }, [user]);

  /* ---------------- FILE HANDLING ---------------- */

  const handleFile = (file: File) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowed.includes(file.type)) {
      setError("Please upload a PDF, DOCX, or TXT file");
      return;
    }

    setFile(file);
    setAnalysis(null);
    setError(null);
  };

  /* ---------------- ANALYZE + SAVE ---------------- */

  const analyzeResume = async () => {
    if (!file || !user) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/resume-analysis", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data: AnalysisResult = await response.json();

      setAnalysis(data);

      await setDoc(doc(db, "resumeAnalysis", user.uid), {
        email: user.email,
        analysis: data,
        updatedAt: new Date(),
      });
    } catch (err) {
      setError("Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Snowfall />

      {/* NAVBAR WITH LOGOUT */}
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Welcome back 👋
        </h1>

        <p className="text-center text-slate-400 mb-10">
          Logged in as <span className="text-violet-400">{user?.email}</span>
        </p>

        {/* Upload Box */}
        <div
          className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition ${
            dragActive
              ? "border-violet-500 bg-violet-500/10"
              : "border-slate-700 bg-slate-800/20"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept=".pdf,.docx,.txt"
            onChange={(e) =>
              e.target.files && handleFile(e.target.files[0])
            }
          />

          {file ? (
            <p className="text-white font-medium">{file.name}</p>
          ) : (
            <p className="text-slate-400">
              Drag & drop or click to upload
            </p>
          )}
        </div>

        {error && (
          <p className="text-red-400 text-center mt-4">{error}</p>
        )}

        {file && !analysis && (
          <div className="text-center mt-6">
            <button
              onClick={analyzeResume}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </div>
        )}

        {analysis && (
          <div className="mt-12 bg-slate-800/40 p-8 rounded-3xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Overall Score: {analysis.overallScore}/100
            </h2>
            <p className="text-slate-300">{analysis.summary}</p>
          </div>
        )}
      </main>
    </div>
  );
}
