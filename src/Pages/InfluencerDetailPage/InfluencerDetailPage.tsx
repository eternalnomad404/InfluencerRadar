// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../../Components/Navigation/Navigation';
import Footer from '../../Components/Footer/Footer';

interface InfluencerData {
  id: string;
  name: string;
  handle: string;
  profileImage: string;
  niche: string;
  platforms: {
    instagram?: { followers: string; handle: string };
    youtube?: { followers: string; handle: string };
    linkedin?: { followers: string; handle: string };
  };
  engagementRate: number;
  totalFollowers: string;
  country?: string;
}

const InfluencerDetailPage: React.FC = () => {
  const { channelId, category } = useParams<{ channelId: string; category: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [timeRange, setTimeRange] = useState('30');
  const [influencerData, setInfluencerData] = useState<InfluencerData | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Fetch influencer data based on channelId
  useEffect(() => {
    const fetchInfluencerData = async () => {
      if (!channelId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Try to get data from cache first
        const cachedInfluencers = localStorage.getItem('youtube_tech_influencers');
        if (cachedInfluencers) {
          const influencers = JSON.parse(cachedInfluencers);
          const foundInfluencer = influencers.find((inf: any) => inf.id === channelId);
          
          if (foundInfluencer) {
            setInfluencerData({
              id: foundInfluencer.id,
              name: foundInfluencer.name,
              handle: foundInfluencer.handle || `@${foundInfluencer.name.replace(/\s+/g, '').toLowerCase()}`,
              profileImage: foundInfluencer.profileImage,
              niche: foundInfluencer.category || 'Technology',
              platforms: {
                youtube: { 
                  followers: foundInfluencer.followers, 
                  handle: foundInfluencer.name.replace(/\s+/g, '')
                }
              },
              engagementRate: parseFloat(foundInfluencer.engagement?.replace('%', '')) || 5.1,
              totalFollowers: foundInfluencer.followers,
              country: foundInfluencer.country
            });
            setLoading(false);
            return;
          }
        }

        // If not in cache, fetch from YouTube API
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            const channel = data.items[0];
            const formattedData: InfluencerData = {
              id: channel.id,
              name: channel.snippet.title,
              handle: `@${channel.snippet.title.replace(/\s+/g, '').toLowerCase()}`,
              profileImage: channel.snippet.thumbnails?.medium?.url || channel.snippet.thumbnails?.default?.url || '',
              niche: category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Technology',
              platforms: {
                youtube: { 
                  followers: formatSubscriberCount(channel.statistics.subscriberCount || '0'), 
                  handle: channel.snippet.title.replace(/\s+/g, '')
                }
              },
              engagementRate: 5.1, // Default value
              totalFollowers: formatSubscriberCount(channel.statistics.subscriberCount || '0'),
              country: channel.snippet.country
            };
            setInfluencerData(formattedData);
          }
        }
      } catch (error) {
        console.error('Error fetching influencer data:', error);
        // Fallback to default data
        setInfluencerData({
          id: channelId || 'unknown',
          name: 'Tech Influencer',
          handle: '@techinfluencer',
          profileImage: 'https://readdy.ai/api/search-image?query=professional%20tech%20influencer%20portrait%20with%20smartphone%20modern%20office%20background&width=120&height=120',
          niche: category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Technology',
          platforms: {
            youtube: { followers: '1.2M', handle: 'TechInfluencer' }
          },
          engagementRate: 5.1,
          totalFollowers: '1.2M'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencerData();
  }, [channelId, category]);

  const recentPosts = [
    {
      id: 1,
      platform: 'youtube',
      thumbnail: 'https://readdy.ai/api/search-image?query=smartphone%20review%20tech%20video%20thumbnail&width=300&height=200',
      title: 'iPhone 15 Pro Max - Complete Review!',
      caption: 'Deep dive into the latest iPhone 15 Pro Max with comprehensive testing and real-world usage scenarios.',
      type: 'Video',
      date: '2 days ago',
      views: 1200000,
      likes: 45000,
      comments: 2100
    },
    {
      id: 2,
      platform: 'instagram',
      thumbnail: 'https://readdy.ai/api/search-image?query=android%20phone%20comparison%20tech%20setup&width=300&height=200',
      title: 'Android vs iPhone - Which one wins?',
      caption: 'The ultimate comparison between Android and iPhone ecosystems. Which one should you choose in 2025?',
      type: 'Reel',
      date: '5 days ago',
      views: 850000,
      likes: 32000,
      comments: 1500
    },
    {
      id: 3,
      platform: 'youtube',
      thumbnail: 'https://readdy.ai/api/search-image?query=tech%20gadgets%20accessories%20review%20setup&width=300&height=200',
      title: 'Top 10 Must-Have Tech Accessories',
      caption: 'Essential tech accessories that will upgrade your smartphone experience in 2025.',
      type: 'Video',
      date: '1 week ago',
      views: 900000,
      likes: 28000,
      comments: 890
    },
    {
      id: 4,
      platform: 'instagram',
      thumbnail: 'https://readdy.ai/api/search-image?query=smartphone%20camera%20photography%20tips&width=300&height=200',
      title: 'Pro Camera Tips for Your Phone',
      caption: 'Transform your smartphone photography with these professional tips and tricks.',
      type: 'Post',
      date: '1 week ago',
      views: 420000,
      likes: 18500,
      comments: 645
    },
    {
      id: 5,
      platform: 'linkedin',
      thumbnail: 'https://readdy.ai/api/search-image?query=tech%20industry%20trends%20professional&width=300&height=200',
      title: 'The Future of Mobile Technology',
      caption: 'Industry insights on where mobile technology is heading and what it means for consumers.',
      type: 'Article',
      date: '2 weeks ago',
      views: 125000,
      likes: 8200,
      comments: 340
    },
    {
      id: 6,
      platform: 'youtube',
      thumbnail: 'https://readdy.ai/api/search-image?query=smartphone%20unboxing%20first%20impressions&width=300&height=200',
      title: 'Galaxy S24 Ultra First Impressions',
      caption: 'Unboxing and first impressions of the Samsung Galaxy S24 Ultra with S Pen testing.',
      type: 'Video',
      date: '2 weeks ago',
      views: 750000,
      likes: 22000,
      comments: 980
    }
  ];

  const brandCollaborations = [
    { name: 'Nike', logo: 'fas fa-check-circle', type: 'Sponsorship', campaign: 'Active Lifestyle' },
    { name: 'Sephora', logo: 'fas fa-heart', type: 'Product Review', campaign: 'Beauty Essentials' },
    { name: 'Whole Foods', logo: 'fas fa-leaf', type: 'UGC Campaign', campaign: 'Healthy Living' },
    { name: 'Apple', logo: 'fab fa-apple', type: 'Product Mention', campaign: 'Tech Integration' }
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'fab fa-instagram';
      case 'youtube': return 'fab fa-youtube';
      case 'linkedin': return 'fab fa-linkedin';
      default: return 'fas fa-share-alt';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navigation/>

      {loading ? (
        /* Loading State */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="mb-4">
              <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Influencer Profile...</h3>
            <p className="text-gray-500">Fetching the latest data for this influencer</p>
          </div>
        </div>
      ) : !influencerData ? (
        /* Error State */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="mb-4">
              <i className="fas fa-exclamation-triangle text-4xl text-red-600"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Influencer Not Found</h3>
            <p className="text-gray-500 mb-6">We couldn't find the influencer data for this profile.</p>
            <a 
              href="/influencerPage" 
              className="bg-blue-600 text-white px-6 py-2 rounded-button text-sm font-medium hover:bg-blue-700 cursor-pointer whitespace-nowrap"
            >
              Back to Influencers
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Influencer Profile Section */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start space-x-6">
                  <img
                    src={influencerData.profileImage}
                    alt={influencerData.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{influencerData.name}</h2>
                    <p className="text-lg text-gray-600 mt-1">{influencerData.handle}</p>
                    <p className="text-sm text-gray-500 mt-2">{influencerData.niche}</p>

                    {/* Platform Badges */}
                    <div className="flex items-center space-x-4 mt-4">
                      {influencerData.platforms.instagram && (
                        <div className="flex items-center space-x-2 px-3 py-1 bg-pink-50 rounded-full cursor-pointer">
                          <i className="fab fa-instagram text-pink-600"></i>
                          <span className="text-sm font-medium text-pink-700">{influencerData.platforms.instagram.followers}</span>
                        </div>
                      )}
                      {influencerData.platforms.youtube && (
                        <div className="flex items-center space-x-2 px-3 py-1 bg-red-50 rounded-full cursor-pointer">
                          <i className="fab fa-youtube text-red-600"></i>
                          <span className="text-sm font-medium text-red-700">{influencerData.platforms.youtube.followers}</span>
                        </div>
                      )}
                      {influencerData.platforms.linkedin && (
                        <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full cursor-pointer">
                          <i className="fab fa-linkedin text-blue-600"></i>
                          <span className="text-sm font-medium text-blue-700">{influencerData.platforms.linkedin.followers}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="mt-6 lg:mt-0 grid grid-cols-2 gap-6 lg:block lg:space-y-4">
                  <div className="text-center lg:text-right">
                    <div className="text-2xl font-bold text-gray-900">{influencerData.totalFollowers}</div>
                    <div className="text-sm text-gray-500">Total Followers</div>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="text-2xl font-bold text-green-600">{influencerData.engagementRate}%</div>
                    <div className="text-sm text-gray-500">Avg. Engagement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: 'fas fa-chart-line' },
              { id: 'content', label: 'Recent Content', icon: 'fas fa-images' },
              { id: 'analytics', label: 'Analytics', icon: 'fas fa-analytics' },
              { id: 'collaborations', label: 'Brand Collabs', icon: 'fas fa-handshake' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={tab.icon}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Trend Summary */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    <i className="fas fa-brain text-blue-600 mr-2"></i>
                    AI Trend Summary (Last 48 Hours)
                  </h3>
                  <span className="text-xs text-gray-500">Updated 2 hours ago</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Key Themes</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Smartphone Reviews', 'Tech Comparisons', 'Camera Tests', 'Gaming Performance'].map((theme) => (
                        <span key={theme} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Trending Hashtags</h4>
                    <div className="flex flex-wrap gap-2">
                      {['#smartphone', '#techreview', '#mobile', '#gadgets'].map((hashtag) => (
                        <span key={hashtag} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Content Types</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-lg font-semibold text-red-600">45%</div>
                        <div className="text-xs text-gray-600">Videos</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-semibold text-blue-600">35%</div>
                        <div className="text-xs text-gray-600">Shorts</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-semibold text-green-600">20%</div>
                        <div className="text-xs text-gray-600">Posts</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Performance */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Performance Highlights</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-green-600">+12.5%</div>
                        <div className="text-sm text-gray-600">Follower Growth</div>
                      </div>
                      <i className="fas fa-arrow-up text-green-600 text-xl"></i>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">5.2%</div>
                        <div className="text-sm text-gray-600">Engagement Rate</div>
                      </div>
                      <i className="fas fa-heart text-blue-600 text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Engagement Chart */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Engagement Trends</h3>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-3 py-1 cursor-pointer"
                  >
                    <option value="30">30 Days</option>
                    <option value="60">60 Days</option>
                    <option value="90">90 Days</option>
                  </select>
                </div>
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <i className="fas fa-chart-line text-3xl mb-2"></i>
                    <div className="text-sm">Engagement chart visualization</div>
                  </div>
                </div>
              </div>

              {/* Platform Performance */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <i className="fab fa-instagram text-pink-600"></i>
                      <span className="text-sm font-medium">Instagram</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">4.8%</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <i className="fab fa-youtube text-red-600"></i>
                      <span className="text-sm font-medium">YouTube</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">6.2%</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <i className="fab fa-linkedin text-blue-600"></i>
                      <span className="text-sm font-medium">LinkedIn</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">3.1%</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            {/* Filters */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Platform:</span>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-3 py-1 cursor-pointer"
                  >
                    <option value="all">All Platforms</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Showing {recentPosts.length} recent posts
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <div className="relative">
                    <img
                      src={post.thumbnail}
                      alt="Post thumbnail"
                      className="w-full h-48 object-cover object-top"
                    />
                    <div className="absolute top-3 left-3">
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                        post.platform === 'instagram' ? 'bg-pink-100 text-pink-700' :
                        post.platform === 'youtube' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        <i className={getPlatformIcon(post.platform)}></i>
                        <span className="capitalize">{post.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">{post.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.caption}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <i className="fas fa-heart text-red-500"></i>
                          <span>{formatNumber(post.likes)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i className="fas fa-comment text-blue-500"></i>
                          <span>{formatNumber(post.comments)}</span>
                        </div>
                        {post.views && (
                          <div className="flex items-center space-x-1">
                            <i className="fas fa-eye text-green-500"></i>
                            <span>{formatNumber(post.views)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">{post.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">5.1%</div>
                <div className="text-sm text-gray-600">Avg. Engagement Rate</div>
                <div className="text-xs text-green-600 mt-1">↗ +0.3% vs last month</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="text-3xl font-bold text-green-600">2.1M</div>
                <div className="text-sm text-gray-600">Total Reach</div>
                <div className="text-xs text-green-600 mt-1">↗ +12% vs last month</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="text-3xl font-bold text-purple-600">156K</div>
                <div className="text-sm text-gray-600">Avg. Video Views</div>
                <div className="text-xs text-green-600 mt-1">↗ +8% vs last month</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="text-3xl font-bold text-orange-600">$2.5K</div>
                <div className="text-sm text-gray-600">Est. Post Value</div>
                <div className="text-xs text-gray-500 mt-1">Based on engagement</div>
              </div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Engagement Trends */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Trends (Last 90 Days)</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <i className="fas fa-chart-area text-4xl mb-2"></i>
                    <div className="text-sm">Engagement trends chart would appear here</div>
                    <div className="text-xs text-gray-400 mt-1">Integration with analytics API required</div>
                  </div>
                </div>
              </div>

              {/* Audience Demographics */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Demographics</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Age Groups</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">18-24</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 rounded">
                            <div className="w-3/4 h-2 bg-blue-500 rounded"></div>
                          </div>
                          <span className="text-sm font-medium">35%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">25-34</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 rounded">
                            <div className="w-2/3 h-2 bg-green-500 rounded"></div>
                          </div>
                          <span className="text-sm font-medium">28%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">35-44</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 rounded">
                            <div className="w-1/2 h-2 bg-purple-500 rounded"></div>
                          </div>
                          <span className="text-sm font-medium">22%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">45+</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 rounded">
                            <div className="w-1/3 h-2 bg-orange-500 rounded"></div>
                          </div>
                          <span className="text-sm font-medium">15%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Gender Split</h4>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="text-sm text-gray-600">Male 58%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-pink-500 rounded"></div>
                        <span className="text-sm text-gray-600">Female 42%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Posting Times */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Posting Times</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Peak Engagement Hours</h4>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-semibold text-green-600">9 AM</div>
                        <div className="text-xs text-gray-600">Morning Peak</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-semibold text-blue-600">1 PM</div>
                        <div className="text-xs text-gray-600">Lunch Time</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-semibold text-purple-600">7 PM</div>
                        <div className="text-xs text-gray-600">Evening Peak</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Best Days</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                        <span key={day} className={`px-3 py-1 text-xs rounded-full ${
                          [1, 2, 4].includes(idx) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Performance */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Video Reviews</div>
                      <div className="text-xs text-gray-600">Avg. 890K views</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">High</div>
                      <div className="text-xs text-gray-600">6.2% engagement</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Product Comparisons</div>
                      <div className="text-xs text-gray-600">Avg. 650K views</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-blue-600">Medium</div>
                      <div className="text-xs text-gray-600">4.8% engagement</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Tech Tips</div>
                      <div className="text-xs text-gray-600">Avg. 420K views</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-orange-600">Medium</div>
                      <div className="text-xs text-gray-600">3.9% engagement</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'collaborations' && (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Brand Collaboration History</h3>
              <p className="text-gray-600">Recent partnerships and campaign performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {brandCollaborations.map((brand, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <i className={`${brand.logo} text-xl text-gray-600`}></i>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      brand.type === 'Sponsorship' ? 'bg-green-100 text-green-700' :
                      brand.type === 'Product Review' ? 'bg-blue-100 text-blue-700' :
                      brand.type === 'UGC Campaign' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {brand.type}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{brand.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{brand.campaign}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Campaign Active</span>
                    <i className="fas fa-external-link-alt cursor-pointer hover:text-blue-600"></i>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Collaboration Performance</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">Total Collaborations</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">4.2M</div>
                  <div className="text-sm text-gray-600">Total Reach</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">8.5%</div>
                  <div className="text-sm text-gray-600">Avg. Engagement</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer/>
        </>
      )}
    </div>

  );

};

export default InfluencerDetailPage;
