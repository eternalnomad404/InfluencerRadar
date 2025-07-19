// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect } from 'react';
import Navigation from '../../Components/Navigation/Navigation';
import Pagination from './Components/Pagination';
import { Link } from 'react-router-dom';

interface YouTubeInfluencer {
  id: string;
  name: string;
  handle: string;
  profileImage: string;
  platforms: string[];
  followers: string;
  category: string;
  engagement: string;
  country: string;
}

const InfluencerPage: React.FC = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedFollowerRange, setSelectedFollowerRange] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('most-followers');
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [influencers, setInfluencers] = useState<YouTubeInfluencer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const YOUTUBE_API_KEY = 'AIzaSyCZ1y5wlvF9Vof4eCWxBFwXTsfRGvB_K9U';

  const formatSubscriberCount = (count: string): string => {
    const num = parseInt(count);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return count;
  };

  const fetchYouTubeInfluencers = async () => {
    try {
      setLoading(true);

      // Check if we have cached data (cache for 1 hour)
      const cacheKey = 'youtube_tech_influencers';
      const cacheTimeKey = 'youtube_tech_influencers_timestamp';
      const cacheExpiry = 60 * 60 * 60 * 1000; // 60 hour in milliseconds

      const cachedData = localStorage.getItem(cacheKey);
      const cachedTime = localStorage.getItem(cacheTimeKey);

      if (cachedData && cachedTime) {
        const timeDiff = Date.now() - parseInt(cachedTime);
        if (timeDiff < cacheExpiry) {
          console.log('Using cached YouTube data');
          setInfluencers(JSON.parse(cachedData));
          setLoading(false);
          return;
        }
      }

      console.log('Fetching fresh YouTube data');

      // First, let's search for channels by name to get their IDs
      const channelNames = [
        'Unbox Therapy',
        'Marques Brownlee',
        'Mrwhosetheboss',
        'Linus Tech Tips',
        'Austin Evans',
        'UrAvgConsumer',
        'JerryRigEverything',
        'Technical Guruji',
        'Trakin Tech',
        'Tech Burner',
        'Technology Gyan',
        'Geeky Ranjit',
        'TechBar',
        'Tech Boss',
        'Gogi Tech'
      ];

      const channelIds = new Set<string>();

      // Search for each channel by name
      for (const channelName of channelNames) {
        try {
          const searchResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(channelName)}&maxResults=1&key=${YOUTUBE_API_KEY}`
          );

          if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            if (searchData.items && searchData.items.length > 0) {
              channelIds.add(searchData.items[0].snippet.channelId);
              console.log(`Found channel ID for ${channelName}: ${searchData.items[0].snippet.channelId}`);
            }
          }
        } catch (error) {
          console.error(`Error searching for ${channelName}:`, error);
        }
      }

      const channelIdsArray = Array.from(channelIds);

      if (channelIdsArray.length === 0) {
        setInfluencers([]);
        setLoading(false);
        return;
      }

      // Get channel statistics
      const channelsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIdsArray.join(',')}&key=${YOUTUBE_API_KEY}`
      );

      if (channelsResponse.ok) {
        const channelsData = await channelsResponse.json();

        const fetchedInfluencers: YouTubeInfluencer[] = channelsData.items?.map((channel: any) => ({
          id: channel.id,
          name: channel.snippet.title,
          handle: '', // Keep blank as requested
          profileImage: channel.snippet.thumbnails?.medium?.url || channel.snippet.thumbnails?.default?.url || '',
          platforms: ['youtube'],
          followers: formatSubscriberCount(channel.statistics.subscriberCount || '0'),
          category: 'Technology',
          engagement: '', // Keep blank as requested
          country: channel.snippet.country || '' // Extract country if available
        })) || [];

        // Sort by subscriber count (descending)
        fetchedInfluencers.sort((a, b) => {
          const aCount = parseInt(a.followers.replace(/[MK]/, '')) * (a.followers.includes('M') ? 1000000 : a.followers.includes('K') ? 1000 : 1);
          const bCount = parseInt(b.followers.replace(/[MK]/, '')) * (b.followers.includes('M') ? 1000000 : b.followers.includes('K') ? 1000 : 1);
          return bCount - aCount;
        });

        setInfluencers(fetchedInfluencers); // Show all specific YouTubers

        // Cache the data in localStorage
        localStorage.setItem(cacheKey, JSON.stringify(fetchedInfluencers));
        localStorage.setItem(cacheTimeKey, Date.now().toString());
        console.log('YouTube data cached successfully');
      }
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
      // Fallback to original data if API fails
      setInfluencers([
        {
          id: '1',
          name: 'Alex Chen',
          handle: '@alextech',
          profileImage: 'https://readdy.ai/api/search-image?query=professional%20tech%20influencer%20portrait%20young%20asian%20man%20with%20modern%20glasses%20clean%20white%20background%20studio%20lighting%20high%20quality%20headshot&width=100&height=100&seq=alex001&orientation=squarish',
          platforms: ['youtube', 'twitter', 'linkedin'],
          followers: '2.5M',
          category: 'Technology',
          engagement: '4.2%',
          country: 'United States'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYouTubeInfluencers();
  }, []);

  const filteredInfluencers = influencers.filter(influencer => {
    if (selectedPlatforms.length > 0 && !selectedPlatforms.some(platform => influencer.platforms.includes(platform))) {
      return false;
    }
    if (selectedCountry && influencer.country !== selectedCountry) {
      return false;
    }
    if (selectedFollowerRange) {
      const followers = parseFloat(influencer.followers.replace('M', '').replace('K', ''));
      const multiplier = influencer.followers.includes('M') ? 1000000 : influencer.followers.includes('K') ? 1000 : 1;
      const actualFollowers = followers * multiplier;

      if (selectedFollowerRange === '1m+' && actualFollowers < 1000000) return false;
      if (selectedFollowerRange === '5m+' && actualFollowers < 5000000) return false;
      if (selectedFollowerRange === '10m+' && actualFollowers < 10000000) return false;
    }
    return true;
  });

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

  const refreshData = () => {
    // Clear cache and fetch fresh data
    localStorage.removeItem('youtube_tech_influencers');
    localStorage.removeItem('youtube_tech_influencers_timestamp');
    fetchYouTubeInfluencers();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
  <Navigation/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">YouTube Tech Influencers Directory</h1>
              <p className="text-lg text-gray-600">Explore Top Tech Influencers on YouTube</p>
            </div>
            <button
              onClick={refreshData}
              className="bg-green-600 text-white px-4 py-2 !rounded-button text-sm font-medium hover:bg-green-700 cursor-pointer whitespace-nowrap flex items-center gap-2"
              disabled={loading}
            >
              <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
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
            {loading ? (
              /* Loading State */
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <div className="mb-4">
                  <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Loading YouTube Influencers...</h3>
                <p className="text-gray-500">Fetching the latest data from YouTube</p>
              </div>
            ) : filteredInfluencers.length === 0 ? (
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
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Showing {filteredInfluencers.length} of {influencers.length} YouTube tech influencers
                  </p>
                  {(() => {
                    const cachedTime = localStorage.getItem('youtube_tech_influencers_timestamp');
                    if (cachedTime) {
                      const lastUpdated = new Date(parseInt(cachedTime)).toLocaleString();
                      return (
                        <p className="text-xs text-gray-400">
                          Last updated: {lastUpdated}
                        </p>
                      );
                    }
                    return null;
                  })()}
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
                        {influencer.handle && (
                          <p className="text-gray-500 text-sm">{influencer.handle}</p>
                        )}
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
                        {influencer.engagement ? (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium text-green-600">{influencer.engagement}</span> engagement
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">
                            Engagement data not available
                          </div>
                        )}
                      </div>

                  <Link to={`/influencerDetailPage/${influencer.id}/technology`} className="w-full">
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
