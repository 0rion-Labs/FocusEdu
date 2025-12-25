"use client";
import React, { useState, useEffect } from 'react';
import Background from '../components/Background';
import Navbar from '../components/Navbar';
import { Skeleton } from '../components/ui/skeleton';
import { FiSearch, FiMapPin, FiBriefcase, FiClock, FiExternalLink, FiFilter } from 'react-icons/fi';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';

interface Internship {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo: string | null;
  job_city: string;
  job_state: string;
  job_country: string;
  job_employment_type: string;
  job_apply_link: string;
  job_description: string;
  job_posted_at_datetime_utc: string;
  job_is_remote: boolean;
}

const InternshipPage = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('software engineering intern');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('in');
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);

  const fetchInternships = async (query: string = searchQuery) => {
    setLoading(true);
    try {
      const searchTerm = query.toLowerCase().includes('intern') ? query : `${query} intern`;
      const locationParam = location ? `&location=${encodeURIComponent(location)}` : '';
      const remoteParam = isRemoteOnly ? '&remote_jobs_only=true' : '';
      const countryParam = country ? `&country=${country}` : '';
      
      const response = await fetch(
        `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchTerm)}${locationParam}${remoteParam}${countryParam}&page=1&num_pages=3`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'jsearch.p.rapidapi.com',
            'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
          },
        }
      );
      
      const data = await response.json();
      setInternships(data.data || []);
    } catch (error) {
      console.error('Error fetching internships:', error);
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInternships();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const truncateDescription = (desc: string, maxLength: number = 150) => {
    if (!desc) return 'No description available';
    return desc.length > maxLength ? `${desc.substring(0, maxLength)}...` : desc;
  };

  const quickFilters = [
    'Software Engineering',
    'Data Science',
    'Product Management',
    'UX Design',
    'Marketing',
    'Finance',
  ];

  return (
    <div className="min-h-screen relative">
      <Background />
      <Navbar />
      
      <div className="relative z-10 pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Dream{' '}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Internship
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Discover thousands of internship opportunities from top companies worldwide
          </p>
        </div>

        {/* Search Section */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            {/* Search Input */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xl" />
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            </div>
            
            {/* Location Input */}
            <div className="md:w-64 relative">
              <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xl" />
              <input 
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            </div>
            
            {/* Search Button */}
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all hover:-translate-y-0.5"
            >
              Search
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {/* Country Filter */}
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-full text-zinc-300 focus:outline-none focus:border-violet-500/50 cursor-pointer"
            >
              <option value="in">🇮🇳 India</option>
              <option value="us">🇺🇸 United States</option>
              <option value="gb">🇬🇧 United Kingdom</option>
              <option value="ca">🇨🇦 Canada</option>
              <option value="au">🇦🇺 Australia</option>
              <option value="de">🇩🇪 Germany</option>
              <option value="sg">🇸🇬 Singapore</option>
              <option value="">🌍 All Countries</option>
            </select>
            
            <span className="text-zinc-600">|</span>
            
            <label className="flex items-center gap-2 text-zinc-400 cursor-pointer hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={isRemoteOnly}
                onChange={(e) => setIsRemoteOnly(e.target.checked)}
                className="w-4 h-4 rounded accent-violet-500"
              />
              <span className="text-sm">Remote Only</span>
            </label>
            
            <span className="text-zinc-600">|</span>
            
            {quickFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setSearchQuery(`${filter} intern`);
                  fetchInternships(`${filter} intern`);
                }}
                className="px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-full text-zinc-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all"
              >
                {filter}
              </button>
            ))}
          </div>
        </form>

        {/* Results Count */}
        {!loading && (
          <p className="text-zinc-400 mb-6">
            Found <span className="text-white font-semibold">{internships.length}</span> internship opportunities
          </p>
        )}

        {/* Internship Cards */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Skeleton className="w-14 h-14 rounded-xl bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4 bg-white/10" />
                    <Skeleton className="h-4 w-1/2 bg-white/10" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2 bg-white/10" />
                <Skeleton className="h-4 w-2/3 mb-4 bg-white/10" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
                  <Skeleton className="h-6 w-24 rounded-full bg-white/10" />
                </div>
                <div className="flex justify-between pt-4 border-t border-white/5">
                  <Skeleton className="h-4 w-20 bg-white/10" />
                  <Skeleton className="h-8 w-20 rounded-lg bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : internships.length === 0 ? (
          <div className="text-center py-16">
            <FiBriefcase className="text-6xl text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No internships found</h3>
            <p className="text-zinc-400">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {internships.map((internship) => (
              <div
                key={internship.job_id}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 hover:bg-white/[0.07] transition-all duration-300"
              >
                {/* Company Info */}
                <div className="flex items-start gap-4 mb-4">
                  {internship.employer_logo ? (
                    <img
                      src={internship.employer_logo}
                      alt={internship.employer_name}
                      className="w-14 h-14 rounded-xl object-contain bg-white p-1"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center">
                      <HiOutlineOfficeBuilding className="text-2xl text-violet-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors line-clamp-2">
                      {internship.job_title}
                    </h3>
                    <p className="text-sm text-zinc-400 truncate">{internship.employer_name}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-zinc-500 mb-4 line-clamp-3">
                  {truncateDescription(internship.job_description)}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-violet-500/10 text-violet-400 rounded-full">
                    <FiMapPin className="text-xs" />
                    {internship.job_is_remote ? 'Remote' : `${internship.job_city || ''} ${internship.job_state || internship.job_country || ''}`.trim() || 'Location N/A'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-fuchsia-500/10 text-fuchsia-400 rounded-full">
                    <FiBriefcase className="text-xs" />
                    {internship.job_employment_type || 'Internship'}
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="flex items-center gap-1 text-xs text-zinc-500">
                    <FiClock />
                    {formatDate(internship.job_posted_at_datetime_utc)}
                  </span>
                  <a
                    href={internship.job_apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-4 py-2 text-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all"
                  >
                    Apply
                    <FiExternalLink className="text-xs" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipPage;

