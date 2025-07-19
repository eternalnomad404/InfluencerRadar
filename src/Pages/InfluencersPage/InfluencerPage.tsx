// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';
import Navigation from '../../Components/Navigation/Navigation';
import Pagination from './Components/Pagination';
import { Link } from 'react-router-dom';

const InfluencerPage: React.FC = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedFollowerRange, setSelectedFollowerRange] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('most-followers');
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  const influencers = [
    {
      id: 1,
      name: 'Alex Chen',
      handle: '@alextech',
      profileImage: 'https://readdy.ai/api/search-image?query=professional%20tech%20influencer%20portrait%20young%20asian%20man%20with%20modern%20glasses%20clean%20white%20background%20studio%20lighting%20high%20quality%20headshot&width=100&height=100&seq=alex001&orientation=squarish',
      platforms: ['youtube', 'twitter', 'linkedin'],
      followers: '2.5M',
      category: 'Technology',
      engagement: '4.2%',
      country: 'United States'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      handle: '@sarahcodes',
      profileImage: 'https://readdy.ai/api/search-image?query=professional%20tech%20influencer%20portrait%20young%20woman%20with%20blonde%20hair%20clean%20white%20background%20studio%20lighting%20high%20quality%20headshot%20modern%20style&width=100&height=100&seq=sarah002&orientation=squarish',
      platforms: ['instagram', 'youtube', 'twitter'],
      followers: '1.8M',
      category: 'Technology',
      engagement: '5.1%',
      country: 'Canada'
    },
    {
      id: 3,
      name: 'Marcus Rodriguez',
      handle: '@marcustech',
      profileImage: 'https://readdy.ai/api/search-image?query=professional%20tech%20influencer%20portrait%20young%20hispanic%20man%20with%20beard%20clean%20white%20background%20studio%20lighting%20high%20quality%20headshot%20confident%20expression&width=100&height=100&seq=marcus003&orientation=squarish',
      platforms: ['linkedin', 'youtube', 'twitter'],
      followers: '3.2M',
      category: 'Technology',
      engagement: '3.8%',
      country: 'United Kingdom'
    },
    {
      id: 4,
      name: 'Emma Thompson',
      handle: '@emmaai',
      profileImage: 'https://readdy.ai/api/search-image?query=professional%20tech%20influencer%20portrait%20young%20woman%20with%20brown%20hair%20clean%20white%20background%20studio%20lighting%20high%20quality%20headshot%20smart%20casual%20style&width=100&height=100&seq=emma004&orientation=squarish',
      platforms: ['instagram', 'linkedin', 'twitter'],
      followers: '4.1M',
      category: 'Technology',
      engagement: '6.3%',
      country: 'Australia'
    },
    {
      id: 5,
      name: 'David Kim',
      handle: '@daviddev',
      profileImage: 'https://readdy.ai/api/search-image?query=professional%20tech%20influencer%20portrait%20young%20korean%20man%20with%20modern%20haircut%20clean%20white%20background%20studio%20lighting%20high%20quality%20headshot%20professional%20attire&width=100&height=100&seq=david005&orientation=squarish',
      platforms: ['youtube', 'twitter', 'linkedin'],
      followers: '1.3M',
      category: 'Technology',
      engagement: '4.7%',
      country: 'South Korea'
    },
    {
      id: 6,
      name: 'Lisa Wang',
      handle: '@lisatech',
      profileImage: 'https://readdy.ai/api/search-image?query=professional%20tech%20influencer%20portrait%20young%20asian%20woman%20with%20long%20black%20hair%20clean%20white%20background%20studio%20lighting%20high%20quality%20headshot%20modern%20professional%20style&width=100&height=100&seq=lisa006&orientation=squarish',
      platforms: ['instagram', 'youtube', 'linkedin'],
      followers: '2.9M',
      category: 'Technology',
      engagement: '5.5%',
      country: 'Singapore'
    }
  ];

  const platforms = [
    { id: 'youtube', name: 'YouTube', icon: 'fab fa-youtube' },
    { id: 'instagram', name: 'Instagram', icon: 'fab fa-instagram' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'fab fa-linkedin' },
    { id: 'twitter', name: 'Twitter', icon: 'fab fa-twitter' }
  ];

  const followerRanges = [
    { value: '', label: 'All Followers' },
    { value: '1m+', label: '1M+' },
    { value: '5m+', label: '5M+' },
    { value: '10m+', label: '10M+' }
  ];

  const countries = [
    { value: '', label: 'All Countries' },
    { value: 'United States', label: 'United States' },
    { value: 'Canada', label: 'Canada' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'Australia', label: 'Australia' },
    { value: 'South Korea', label: 'South Korea' },
    { value: 'Singapore', label: 'Singapore' }
  ];

  const sortOptions = [
    { value: 'most-followers', label: 'Most Followers' },
    { value: 'highest-engagement', label: 'Highest Engagement' },
    { value: 'recently-added', label: 'Recently Added' },
    { value: 'alphabetical', label: 'Alphabetical A-Z' }
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const clearAllFilters = () => {
    setSelectedPlatforms([]);
    setSelectedFollowerRange('');
    setSelectedCountry('');
    setSortBy('most-followers');
  };

  const filteredInfluencers = influencers.filter(influencer => {
    if (selectedPlatforms.length > 0 && !selectedPlatforms.some(platform => influencer.platforms.includes(platform))) {
      return false;
    }
    if (selectedCountry && influencer.country !== selectedCountry) {
      return false;
    }
    if (selectedFollowerRange) {
      const followers = parseFloat(influencer.followers.replace('M', ''));
      if (selectedFollowerRange === '1m+' && followers < 1) return false;
      if (selectedFollowerRange === '5m+' && followers < 5) return false;
      if (selectedFollowerRange === '10m+' && followers < 10) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
  <Navigation/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tech Influencers Directory</h1>
          <p className="text-lg text-gray-600">Explore Top Tech Influencers</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="w-full bg-white border border-gray-300 px-4 py-2 !rounded-button text-left flex items-center justify-between cursor-pointer whitespace-nowrap"
              >
                <span className="text-sm font-medium">Filters</span>
                <i className={`fas fa-chevron-${filtersOpen ? 'up' : 'down'} text-gray-400`}></i>
              </button>
            </div>

            <div className={`bg-white p-6 rounded-lg shadow-sm border ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer whitespace-nowrap"
                >
                  Clear All
                </button>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Platforms */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Platforms</label>
                <div className="space-y-2">
                  {platforms.map(platform => (
                    <label key={platform.id} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.includes(platform.id)}
                        onChange={() => handlePlatformToggle(platform.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <div className="ml-3 flex items-center">
                        <i className={`${platform.icon} text-gray-600 mr-2`}></i>
                        <span className="text-sm text-gray-700">{platform.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Follower Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Follower Range</label>
                <select
                  value={selectedFollowerRange}
                  onChange={(e) => setSelectedFollowerRange(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {followerRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Country */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 !rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {countries.map(country => (
                    <option key={country.value} value={country.value}>{country.label}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="bg-blue-50 border border-blue-200 px-3 py-2 !rounded-button">
                  <span className="text-sm text-blue-700 font-medium">Technology</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {filteredInfluencers.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <div className="mb-4">
                  <i className="fas fa-search text-4xl text-gray-300"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No influencers match your filters</h3>
                <p className="text-gray-500 mb-6">Try resetting your filters to see more results</p>
                <button
                  onClick={clearAllFilters}
                  className="bg-blue-600 text-white px-6 py-2 !rounded-button font-medium hover:bg-blue-700 cursor-pointer whitespace-nowrap"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    Showing {filteredInfluencers.length} of {influencers.length} influencers
                  </p>
                </div>

                {/* Influencer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
                  {filteredInfluencers.map(influencer => (
                    <div key={influencer.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="text-center mb-4">
                        <img
                          src={influencer.profileImage}
                          alt={influencer.name}
                          className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                        />
                        <h3 className="font-semibold text-gray-900 text-lg">{influencer.name}</h3>
                        <p className="text-gray-500 text-sm">{influencer.handle}</p>
                      </div>

                      <div className="flex justify-center space-x-3 mb-4">
                        {influencer.platforms.map(platform => {
                          const platformInfo = platforms.find(p => p.id === platform);
                          return (
                            <i key={platform} className={`${platformInfo?.icon} text-gray-600 text-lg`}></i>
                          );
                        })}
                      </div>

                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-gray-900 mb-1">{influencer.followers}</div>
                        <div className="text-sm text-gray-500">Followers</div>
                      </div>

                      <div className="flex justify-center mb-4">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                          {influencer.category}
                        </span>
                      </div>

                      <div className="text-center mb-4">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-green-600">{influencer.engagement}</span> engagement
                        </div>
                      </div>

                  <Link to="/influencerDetailPage" className="w-full">
  <button className="w-full bg-blue-600 text-white py-2 !rounded-button text-sm font-medium hover:bg-blue-700 cursor-pointer whitespace-nowrap">
    View Dashboard
  </button>
</Link>

                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <Pagination/>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .!rounded-button {
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default InfluencerPage;
