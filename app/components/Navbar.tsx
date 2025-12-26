

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogOut, Home, Sparkles, FileText, BarChart3, Newspaper, GraduationCap, Github } from 'lucide-react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

// Public navigation links (visible to everyone)
const publicNavLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'News', href: '/news', icon: Newspaper },
]

// Authenticated navigation links (visible only when logged in)
const authenticatedNavLinks = [
  { name: 'Suggestions', href: '/suggestions', icon: Sparkles },
  { name: 'Resume Analysis', href: '/resume-analysis', icon: FileText },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Internship', href: '/internship', icon: GraduationCap },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setIsOpen(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href)
  }

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section - Clickable */}
          <Link href="/" className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity flex-shrink-0">
            <h1 className="m-0 text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              🎓 FocusEdu <span className="text-xs text-slate-500 font-normal align-bottom">by Orion Labs</span>
            </h1>
          </Link>

          {/* Desktop Links - Centered */}
          <div className="hidden md:flex flex-1 justify-center items-center">
            <div className="flex items-center space-x-1">
              {/* Public Links */}
              {publicNavLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(link.href)
                        ? 'text-white bg-violet-500/20 border border-violet-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon size={16} />
                    {link.name}
                  </Link>
                )
              })}
              
              {/* Authenticated Links */}
              {user && authenticatedNavLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(link.href)
                        ? 'text-white bg-violet-500/20 border border-violet-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon size={16} />
                    {link.name}
                  </Link>
                )
              })}
              
            </div>
          </div>

          {/* User Actions - Right Side */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {user ? (
              <>
                <span className="text-sm text-slate-300 whitespace-nowrap">
                  Hi, <span className="text-violet-400 font-medium">{user.displayName || user.email?.split('@')[0]}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all border border-slate-600/50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <button className="cursor-pointer text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-slate-800/50">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="cursor-pointer bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-violet-500/20">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Public Links */}
            {publicNavLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 text-base font-medium border-b border-white/5 transition-colors ${
                    isActive(link.href)
                      ? 'text-white bg-violet-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={20} />
                  {link.name}
                </Link>
              )
            })}
            
            {/* Authenticated Links */}
            {user && authenticatedNavLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 text-base font-medium border-b border-white/5 transition-colors ${
                    isActive(link.href)
                      ? 'text-white bg-violet-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={20} />
                  {link.name}
                </Link>
              )
            })}
            
            {/* User Actions */}
            {user ? (
              <div className="px-4 py-4 border-t border-white/10 mt-2">
                <p className="text-sm text-slate-300 mb-4">
                  Hi, <span className="text-violet-400 font-medium">{user.displayName || user.email?.split('@')[0]}</span>
                </p>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 text-base font-medium w-full"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-4 py-4 border-t border-white/10 mt-2 space-y-2">
                <Link
                  href="/login"
                  className="block text-center text-gray-300 hover:text-white px-4 py-2 rounded-lg text-base font-medium transition-all hover:bg-slate-800/50"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block text-center bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-4 py-2 rounded-lg text-base font-semibold transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}