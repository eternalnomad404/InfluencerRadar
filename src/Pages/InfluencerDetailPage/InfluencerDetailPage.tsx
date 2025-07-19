// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';
import Navigation from '../../Components/Navigation/Navigation';

const InfluencerDetailPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [timeRange, setTimeRange] = useState('30');

  const influencerData = {
    name: 'Emma Rodriguez',
    handle: '@emmalifestyle',
    profileImage: 'https://readdy.ai/api/search-image?query=professional%20female%20lifestyle%20influencer%20portrait%20with%20natural%20lighting%20clean%20white%20background%20modern%20aesthetic%20high%20quality%20photography&width=120&height=120&seq=profile001&orientation=squarish',
    niche: 'Lifestyle & Wellness',
    platforms: {
      instagram: { followers: '2.4M', handle: '@emmalifestyle' },
      youtube: { followers: '890K', handle: 'EmmaLifestyle' },
      linkedin: { followers: '45K', handle: 'emma-rodriguez' }
    },
    engagementRate: 4.8,
    totalFollowers: '3.3M'
  };

  const recentPosts = [
    {
      id: 1,
      platform: 'instagram',
      type: 'reel',
      thumbnail: 'https://readdy.ai/api/search-image?query=lifestyle%20wellness%20morning%20routine%20content%20creator%20filming%20with%20natural%20lighting%20clean%20aesthetic%20modern%20apartment%20background&width=300&height=400&seq=post001&orientation=portrait',
      caption: 'Morning routine that changed my life ✨ Starting with gratitude and movement...',
      likes: 45200,
      comments: 892,
      views: 234000,
      date: '2 hours ago'
    },
    {
      id: 2,
      platform: 'youtube',
      type: 'video',
      thumbnail: 'https://readdy.ai/api/search-image?query=healthy%20meal%20prep%20kitchen%20setup%20with%20fresh%20ingredients%20natural%20lighting%20clean%20modern%20kitchen%20background%20lifestyle%20content&width=300&height=200&seq=post002&orientation=landscape',
      caption: 'Weekly Meal Prep That Actually Works | Healthy & Budget-Friendly',
      likes: 12400,
      comments: 456,
      views: 89000,
      date: '1 day ago'
    },
    {
      id: 3,
      platform: 'instagram',
      type: 'post',
      thumbnail: 'https://readdy.ai/api/search-image?query=wellness%20skincare%20routine%20products%20flat%20lay%20with%20natural%20lighting%20clean%20white%20background%20minimalist%20aesthetic&width=300&height=300&seq=post003&orientation=squarish',
      caption: 'My simplified skincare routine for busy mornings 🌅 Less is more approach...',
      likes: 28900,
      comments: 567,
      views: null,
      date: '2 days ago'
    },
    {
      id: 4,
      platform: 'linkedin',
      type: 'article',
      thumbnail: 'https://readdy.ai/api/search-image?query=professional%20workspace%20setup%20with%20laptop%20and%20notebook%20clean%20modern%20office%20background%20natural%20lighting%20business%20content%20creator&width=300&height=200&seq=post004&orientation=landscape',
      caption: 'Building a Personal Brand in the Digital Age: 5 Key Strategies',
      likes: 892,
      comments: 67,
      views: 5600,
      date: '3 days ago'
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
                  <div className="flex items-center space-x-2 px-3 py-1 bg-pink-50 rounded-full cursor-pointer">
                    <i className="fab fa-instagram text-pink-600"></i>
                    <span className="text-sm font-medium text-pink-700">{influencerData.platforms.instagram.followers}</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-red-50 rounded-full cursor-pointer">
                    <i className="fab fa-youtube text-red-600"></i>
                    <span className="text-sm font-medium text-red-700">{influencerData.platforms.youtube.followers}</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full cursor-pointer">
                    <i className="fab fa-linkedin text-blue-600"></i>
                    <span className="text-sm font-medium text-blue-700">{influencerData.platforms.linkedin.followers}</span>
                  </div>
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
                      {['Morning Routines', 'Wellness Tips', 'Sustainable Living', 'Self Care'].map((theme) => (
                        <span key={theme} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Trending Hashtags</h4>
                    <div className="flex flex-wrap gap-2">
                      {['#morningroutine', '#wellness', '#selfcare', '#lifestyle'].map((hashtag) => (
                        <span key={hashtag} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Content Types</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-pink-50 rounded-lg">
                        <div className="text-lg font-semibold text-pink-600">60%</div>
                        <div className="text-xs text-gray-600">Reels</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-semibold text-blue-600">25%</div>
                        <div className="text-xs text-gray-600">Posts</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-semibold text-green-600">15%</div>
                        <div className="text-xs text-gray-600">Stories</div>
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
                    <p className="text-sm text-gray-800 mb-3 line-clamp-2">{post.caption}</p>
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
    </div>
  );
};

export default InfluencerDetailPage;
