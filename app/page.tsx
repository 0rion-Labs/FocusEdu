"use client";
import React from 'react'
import Link from 'next/link'
import Snowfall from 'react-snowfall'
import Navbar from './components/Navbar'
import RotatingCube from "./components/Cube";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <Snowfall />
      
      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-40 pointer-events-none z-0"></div>
       
      <Navbar />
   

      {/* Hero Section */}
      <main className="relative z-10 flex-1">
      
        <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              <span className="text-violet-400 text-sm font-medium">AI-Powered Learning Platform</span>
            </div>
            
            {/* Headline */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent leading-tight">
              Learn Smarter,<br />Not Harder
            </h2>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover personalized YouTube videos and Udemy courses tailored to your skill level. 
              Let AI guide your learning journey.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link 
                href="/suggestions" 
                className="group w-full sm:w-auto px-8 py-4 text-base font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl transition-all no-underline hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Get Started Free
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link 
                href="#features" 
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-white rounded-xl transition-all no-underline flex items-center justify-center gap-2"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">10K+</div>
                <div className="text-xs md:text-sm text-slate-500">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">50K+</div>
                <div className="text-xs md:text-sm text-slate-500">Courses Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">98%</div>
                <div className="text-xs md:text-sm text-slate-500">Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose FocusEdu?</h3>
            <p className="text-slate-400 max-w-xl mx-auto">Powered by cutting-edge AI to deliver the best learning experience</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group p-8 bg-slate-800/30 border border-slate-700/50 rounded-2xl transition-all hover:bg-slate-800/50 hover:border-slate-600 hover:-translate-y-1">
              <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center text-2xl">
                🎯
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">Personalized Recommendations</h4>
              <p className="text-slate-400 text-sm leading-relaxed">AI analyzes your skill level and interests to suggest the perfect courses and videos for you.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="group p-8 bg-slate-800/30 border border-slate-700/50 rounded-2xl transition-all hover:bg-slate-800/50 hover:border-slate-600 hover:-translate-y-1">
              <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center text-2xl">
                📺
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">YouTube & Udemy Integration</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Access the best free and paid content from the world&apos;s largest learning platforms.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="group p-8 bg-slate-800/30 border border-slate-700/50 rounded-2xl transition-all hover:bg-slate-800/50 hover:border-slate-600 hover:-translate-y-1">
              <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center text-2xl">
                ⚡
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">AI-Powered Insights</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Get smart suggestions and learning paths tailored to accelerate your growth.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="relative overflow-hidden bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 rounded-3xl p-10 md:p-16 text-center">
            <div className="absolute top-0 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Learning?</h3>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto">Join thousands of learners who are already using FocusEdu to master new skills.</p>
              <Link 
                href="/signup" 
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold bg-white text-slate-900 rounded-xl transition-all no-underline hover:bg-slate-100 hover:shadow-xl hover:-translate-y-0.5"
              >
                Create Free Account
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900/80 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 no-underline mb-4">
                <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  🎓 FocusEdu
                </span>
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed">AI-powered learning platform helping you discover the best educational content.</p>
            </div>
            
            {/* Links */}
            <div>
              <h5 className="text-white font-semibold mb-4 text-sm">Product</h5>
              <ul className="space-y-2 list-none p-0 m-0">
                <li><Link href="/suggestions" className="text-slate-500 hover:text-white text-sm no-underline transition-colors">AI Suggestions</Link></li>
                <li><Link href="#features" className="text-slate-500 hover:text-white text-sm no-underline transition-colors">Features</Link></li>
                <li><Link href="#" className="text-slate-500 hover:text-white text-sm no-underline transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-white font-semibold mb-4 text-sm">Company</h5>
              <ul className="space-y-2 list-none p-0 m-0">
                <li><Link href="#" className="text-slate-500 hover:text-white text-sm no-underline transition-colors">About</Link></li>
                <li><Link href="#" className="text-slate-500 hover:text-white text-sm no-underline transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-slate-500 hover:text-white text-sm no-underline transition-colors">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-white font-semibold mb-4 text-sm">Legal</h5>
              <ul className="space-y-2 list-none p-0 m-0">
                <li><Link href="#" className="text-slate-500 hover:text-white text-sm no-underline transition-colors">Privacy</Link></li>
                <li><Link href="#" className="text-slate-500 hover:text-white text-sm no-underline transition-colors">Terms</Link></li>
                <li><Link href="#" className="text-slate-500 hover:text-white text-sm no-underline transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm m-0">© 2024 FocusEdu by Orion Labs. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage