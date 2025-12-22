import React from 'react'
import { Skeleton } from "./components/ui/skeleton"

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navbar Skeleton */}
      <nav className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Skeleton className="h-8 w-32 bg-slate-800" />
          <div className="hidden md:flex items-center gap-6">
            <Skeleton className="h-4 w-20 bg-slate-800" />
            <Skeleton className="h-4 w-20 bg-slate-800" />
            <Skeleton className="h-4 w-20 bg-slate-800" />
          </div>
          <Skeleton className="h-10 w-24 rounded-lg bg-slate-800" />
        </div>
      </nav>

      {/* Hero Section Skeleton */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 space-y-6">
            {/* Badge */}
            <Skeleton className="h-8 w-56 rounded-full bg-slate-800" />
            
            {/* Headline */}
            <div className="space-y-3">
              <Skeleton className="h-12 w-full max-w-md bg-slate-800" />
              <Skeleton className="h-12 w-3/4 max-w-sm bg-slate-800" />
            </div>
            
            {/* Subheadline */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-full max-w-lg bg-slate-800" />
              <Skeleton className="h-5 w-5/6 max-w-md bg-slate-800" />
            </div>
            
            {/* CTA Buttons */}
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-14 w-40 rounded-xl bg-slate-800" />
              <Skeleton className="h-14 w-32 rounded-xl bg-slate-800" />
            </div>
            
            {/* Stats */}
            <div className="flex gap-8 pt-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-16 bg-slate-800" />
                <Skeleton className="h-3 w-20 bg-slate-800" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-16 bg-slate-800" />
                <Skeleton className="h-3 w-20 bg-slate-800" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-16 bg-slate-800" />
                <Skeleton className="h-3 w-20 bg-slate-800" />
              </div>
            </div>
          </div>

          {/* Right - 3D Scene Placeholder */}
          <div className="flex-1 w-full max-w-lg">
            <Skeleton className="h-[350px] w-full rounded-2xl bg-slate-800/50" />
          </div>
        </div>
      </main>

      {/* Features Section Skeleton */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12 space-y-4">
          <Skeleton className="h-10 w-64 mx-auto bg-slate-800" />
          <Skeleton className="h-5 w-96 mx-auto bg-slate-800" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-8 rounded-2xl border border-slate-800/50 bg-slate-800/20 space-y-4">
              <Skeleton className="h-14 w-14 rounded-xl bg-slate-800" />
              <Skeleton className="h-6 w-3/4 bg-slate-800" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-slate-800" />
                <Skeleton className="h-4 w-5/6 bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shimmer Animation Overlay */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-700/10 to-transparent" />
      </div>
    </div>
  )
}

export default Loading
