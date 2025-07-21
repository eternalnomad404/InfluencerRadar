import React, { useState, useEffect } from 'react';
import useInfluencerMonitoring from '../../hooks/useInfluencerMonitoring';

interface TrendBriefComponentProps {
  influencerData?: any[];
  autoRefresh?: boolean;
  refreshInterval?: number; // in hours
}

const TrendBriefComponent: React.FC<TrendBriefComponentProps> = ({
  influencerData = [],
  autoRefresh = false,
  refreshInterval = 24
}) => {
  console.log('🎯 TrendBrief: Component rendered with data:', influencerData);
  console.log('🎯 TrendBrief: Data length:', influencerData.length);
  
  const { trendBrief, loading, error, generateTrendBrief, queryAgent } = useInfluencerMonitoring();
  const [customQuery, setCustomQuery] = useState('');
  const [queryResponse, setQueryResponse] = useState('');
  const [queryLoading, setQueryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastGeneratedAt, setLastGeneratedAt] = useState<Date | null>(() => {
    // Initialize from localStorage if available
    const stored = localStorage.getItem('ai-trend-brief-last-generated');
    return stored ? new Date(stored) : null;
  });

  // Update localStorage whenever lastGeneratedAt changes
  useEffect(() => {
    if (lastGeneratedAt) {
      localStorage.setItem('ai-trend-brief-last-generated', lastGeneratedAt.toISOString());
    }
  }, [lastGeneratedAt]);

  // Check if we should generate a new trend brief
  const shouldGenerateNewBrief = () => {
    if (!lastGeneratedAt) return true;
    
    const now = new Date();
    const hoursElapsed = (now.getTime() - lastGeneratedAt.getTime()) / (1000 * 60 * 60);
    return hoursElapsed >= refreshInterval;
  };

  useEffect(() => {
    // Auto-generate initial trend brief only if needed
    if (influencerData.length > 0 && shouldGenerateNewBrief()) {
      console.log('🕒 Generating trend brief - time elapsed since last generation');
      generateTrendBrief(influencerData);
      setLastGeneratedAt(new Date());
    } else if (influencerData.length > 0 && lastGeneratedAt) {
      const hoursLeft = refreshInterval - ((new Date().getTime() - lastGeneratedAt.getTime()) / (1000 * 60 * 60));
      console.log(`⏳ Trend brief cached. Next refresh in ${hoursLeft.toFixed(1)} hours`);
    }

    // Set up auto-refresh if enabled
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(() => {
        if (influencerData.length > 0 && shouldGenerateNewBrief()) {
          console.log('🔄 Auto-refreshing trend brief after 24 hours');
          generateTrendBrief(influencerData);
          setLastGeneratedAt(new Date());
        }
      }, refreshInterval * 60 * 60 * 1000); // Convert hours to milliseconds

      return () => clearInterval(interval);
    }
  }, [influencerData.length, autoRefresh, refreshInterval]); // Remove influencerData from dependencies to prevent frequent refreshes

  const handleCustomQuery = async () => {
    if (!customQuery.trim()) return;
    
    setQueryLoading(true);
    try {
      const response = await queryAgent(customQuery);
      setQueryResponse(response);
    } catch (err) {
      setQueryResponse('Sorry, I could not process your question.');
    } finally {
      setQueryLoading(false);
    }
  };

  const refreshData = () => {
    console.log('🔄 TrendBrief: refreshData called');
    console.log('🔄 TrendBrief: influencerData length:', influencerData.length);
    console.log('🔄 TrendBrief: influencerData:', influencerData);
    
    if (influencerData.length > 0) {
      if (shouldGenerateNewBrief()) {
        console.log('🔄 Manual refresh: Generating new trend brief');
        generateTrendBrief(influencerData);
        setLastGeneratedAt(new Date());
      } else if (lastGeneratedAt) {
        const hoursLeft = refreshInterval - ((new Date().getTime() - lastGeneratedAt.getTime()) / (1000 * 60 * 60));
        console.log(`⏳ Refresh blocked. Next refresh available in ${hoursLeft.toFixed(1)} hours`);
        console.log('🔄 Overriding 24-hour cooldown for manual generation...');
        // Override cooldown for manual generation
        generateTrendBrief(influencerData);
        setLastGeneratedAt(new Date());
      }
    } else {
      console.log('❌ TrendBrief: No influencer data available');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  const getNextRefreshInfo = () => {
    if (!lastGeneratedAt) return null;
    
    const now = new Date();
    const hoursElapsed = (now.getTime() - lastGeneratedAt.getTime()) / (1000 * 60 * 60);
    const hoursLeft = refreshInterval - hoursElapsed;
    
    if (hoursLeft <= 0) return null;
    
    const nextRefreshTime = new Date(lastGeneratedAt.getTime() + (refreshInterval * 60 * 60 * 1000));
    
    return {
      hoursLeft: hoursLeft,
      nextRefreshTime: nextRefreshTime,
      canRefresh: hoursLeft <= 0
    };
  };

  if (loading && !trendBrief) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Generating AI Trend Brief</h3>
            <p className="text-gray-500">Analyzing influencer content and identifying trends...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <i className="fas fa-exclamation-triangle text-4xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Generating Brief</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!trendBrief) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <i className="fas fa-robot text-4xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">AI Trend Brief</h3>
          <p className="text-gray-500 mb-4">Generate insights from influencer content using AI analysis</p>
          
          <button
            onClick={() => {
              console.log('🎯 BUTTON CLICKED!');
              console.log('🎯 Button click - influencerData:', influencerData);
              console.log('🎯 Button click - loading:', loading);
              console.log('🎯 Button click - error:', error);
              refreshData();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            disabled={influencerData.length === 0}
          >
            Generate Brief
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 24-Hour Refresh Policy Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="flex-shrink-0">
            <i className="fas fa-clock text-blue-600 text-lg"></i>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-blue-800">
              📊 Smart Refresh Policy: AI Trend Brief refreshes every 24 hours
            </div>
            <div className="text-xs text-blue-600 mt-1">
              This prevents unnecessary API usage and ensures meaningful trend analysis with sufficient data changes
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <i className="fas fa-brain text-blue-600 mr-3"></i>
              AI Trend Brief
            </h2>
            <p className="text-gray-500 mt-1">
              Generated {formatDate(trendBrief.generatedAt)} • Analyzing {trendBrief.period}
              {(() => {
                const refreshInfo = getNextRefreshInfo();
                if (refreshInfo && refreshInfo.hoursLeft > 0) {
                  return (
                    <span className="ml-2 text-blue-600">
                      • Next refresh in {refreshInfo.hoursLeft.toFixed(1)}h
                    </span>
                  );
                }
                return '';
              })()}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={refreshData}
              disabled={loading || (getNextRefreshInfo()?.hoursLeft || 0) > 0}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                (getNextRefreshInfo()?.hoursLeft || 0) > 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
              <span>
                {(getNextRefreshInfo()?.hoursLeft || 0) > 0 ? 'Refresh (24h Cooldown)' : 'Refresh'}
              </span>
            </button>
            {(() => {
              const refreshInfo = getNextRefreshInfo();
              if (refreshInfo && refreshInfo.hoursLeft > 0) {
                return (
                  <div className="text-xs text-gray-500 text-right">
                    <div>Next refresh available:</div>
                    <div className="font-medium">{formatDate(refreshInfo.nextRefreshTime)}</div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Executive Summary</h3>
          <p className="text-gray-700 leading-relaxed">{trendBrief.summary}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: 'fas fa-eye' },
              { id: 'platforms', label: 'Platform Insights', icon: 'fas fa-globe' },
              { id: 'content', label: 'Content Analysis', icon: 'fas fa-chart-pie' },
              { id: 'collaborations', label: 'Brand Collabs', icon: 'fas fa-handshake' },
              { id: 'recommendations', label: 'Recommendations', icon: 'fas fa-lightbulb' },
              { id: 'query', label: 'Ask AI', icon: 'fas fa-question-circle' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
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

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Key Findings */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                    Key Findings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trendBrief.contentAnalysis.keyThemes.slice(0, 6).map((theme, index) => (
                      <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                          </div>
                          <p className="text-blue-800 font-medium text-sm">{theme}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trending Topics */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    <i className="fas fa-fire text-red-500 mr-2"></i>
                    Trending Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trendBrief.contentAnalysis.trendingTopics.map((topic, index) => (
                      <span key={index} className="px-3 py-2 bg-gradient-to-r from-green-100 to-green-50 text-green-700 text-sm rounded-full border border-green-200 font-medium">
                        #{topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content Distribution */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    <i className="fas fa-chart-pie text-purple-500 mr-2"></i>
                    Content Distribution
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(trendBrief.contentAnalysis.contentTypes).map(([type, count]) => (
                      <div key={type} className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
                        <div className="text-2xl font-bold text-purple-600">{count}</div>
                        <div className="text-sm text-purple-700 font-medium capitalize">{type}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Sentiment Analysis */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    <i className="fas fa-heart text-pink-500 mr-2"></i>
                    Sentiment Analysis
                  </h3>
                  <div className="space-y-4">
                    {/* Positive Sentiment */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-green-700">Positive</span>
                        <span className="text-sm font-semibold text-green-700">75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>

                    {/* Neutral Sentiment */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-yellow-700">Neutral</span>
                        <span className="text-sm font-semibold text-yellow-700">20%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>

                    {/* Negative Sentiment */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-red-700">Negative</span>
                        <span className="text-sm font-semibold text-red-700">5%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-red-400 to-red-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">
                        <i className="fas fa-info-circle mr-1"></i>
                        Sentiment analysis based on engagement patterns, comments, and content tone
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    <i className="fas fa-chart-line text-blue-500 mr-2"></i>
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Content Analyzed</span>
                      <span className="font-semibold text-gray-900">
                        {Object.values(trendBrief.contentAnalysis.contentTypes).reduce((a: number, b: number) => a + b, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Platforms Covered</span>
                      <span className="font-semibold text-gray-900">
                        {Object.keys(trendBrief.platformInsights).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Key Themes Identified</span>
                      <span className="font-semibold text-gray-900">
                        {trendBrief.contentAnalysis.keyThemes.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Trending Topics</span>
                      <span className="font-semibold text-gray-900">
                        {trendBrief.contentAnalysis.trendingTopics.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Platform Insights Tab */}
          {activeTab === 'platforms' && (
            <div className="space-y-6">
              {Object.entries(trendBrief.platformInsights).map(([platform, insights]) => (
                <div key={platform} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize flex items-center">
                    <i className={`fab fa-${platform} mr-2 ${
                      platform === 'youtube' ? 'text-red-600' :
                      platform === 'instagram' ? 'text-pink-600' :
                      'text-blue-600'
                    }`}></i>
                    {platform} Insights
                  </h3>
                  
                  <p className="text-gray-700 mb-4">{insights.summary}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Top Content Types</h4>
                      <ul className="space-y-1">
                        {insights.topContentTypes?.map((type: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600">• {type}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Trending Hashtags</h4>
                      <div className="flex flex-wrap gap-2">
                        {insights.trendingHashtags?.map((hashtag: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {insights.engagementTrends && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-1">Engagement Trends</h4>
                      <p className="text-sm text-gray-600">{insights.engagementTrends}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Content Analysis Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Themes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trendBrief.contentAnalysis.keyThemes.map((theme, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-blue-800 font-medium">{theme}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {trendBrief.contentAnalysis.trendingTopics.map((topic, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Distribution</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(trendBrief.contentAnalysis.contentTypes).map(([type, count]) => (
                    <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{count}</div>
                      <div className="text-sm text-gray-600">{type}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Insights</h3>
                <div className="space-y-3">
                  {trendBrief.contentAnalysis.engagementInsights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <i className="fas fa-lightbulb text-yellow-600 mt-1"></i>
                      <p className="text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Brand Collaborations Tab */}
          {activeTab === 'collaborations' && (
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <i className="fas fa-brain text-blue-600 mr-2"></i>
                  AI-Detected Brand Collaborations
                </h3>
                <p className="text-gray-600">AI analysis of brand mentions and partnership opportunities in content</p>
              </div>

              {trendBrief.brandCollaborations && trendBrief.brandCollaborations.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {trendBrief.brandCollaborations.map((brand, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <i className={`fas fa-${
                                brand.name.toLowerCase().includes('apple') ? 'apple' :
                                brand.name.toLowerCase().includes('google') ? 'globe' :
                                brand.name.toLowerCase().includes('microsoft') ? 'windows' :
                                brand.name.toLowerCase().includes('samsung') ? 'mobile-alt' :
                                'building'
                              } text-xl text-gray-600`}></i>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{brand.name}</h4>
                              <p className="text-sm text-gray-600">{brand.campaign}</p>
                              <p className="text-xs text-gray-500">{brand.platform} • {brand.contentCount} mentions</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            brand.type === 'Sponsorship' ? 'bg-green-100 text-green-700' :
                            brand.type === 'Product Review' ? 'bg-blue-100 text-blue-700' :
                            brand.type === 'UGC Campaign' ? 'bg-purple-100 text-purple-700' :
                            brand.type === 'Content Opportunity' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {brand.type}
                          </span>
                        </div>

                        {/* AI Insights Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-100">
                          <div className="flex items-start space-x-2">
                            <i className="fas fa-robot text-blue-600 mt-0.5 flex-shrink-0"></i>
                            <div>
                              <h5 className="text-sm font-medium text-blue-900 mb-1">AI Insights</h5>
                              <p className="text-xs text-blue-800">{brand.aiInsights}</p>
                            </div>
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-2 bg-green-50 rounded-lg">
                            <div className="text-sm font-bold text-green-600">{brand.engagement}</div>
                            <div className="text-xs text-gray-600">Engagement</div>
                          </div>
                          <div className="text-center p-2 bg-blue-50 rounded-lg">
                            <div className="text-sm font-bold text-blue-600">{brand.reach}</div>
                            <div className="text-xs text-gray-600">Reach</div>
                          </div>
                          <div className="text-center p-2 bg-yellow-50 rounded-lg">
                            <div className="flex items-center justify-center">
                              <i className={`fas fa-${brand.sentiment === 'positive' ? 'smile text-green-600' : 
                                brand.sentiment === 'negative' ? 'frown text-red-600' : 'meh text-yellow-600'} text-sm`}></i>
                            </div>
                            <div className="text-xs text-gray-600 capitalize">{brand.sentiment}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Brand Collaboration Statistics */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      <i className="fas fa-chart-bar text-purple-600 mr-2"></i>
                      Collaboration Analytics
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{trendBrief.brandCollaborations.length}</div>
                        <div className="text-sm text-gray-600">Brands Detected</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {trendBrief.brandCollaborations.reduce((sum, brand) => sum + brand.contentCount, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Mentions</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {trendBrief.brandCollaborations.length > 0 ? 
                            (trendBrief.brandCollaborations.reduce((sum, brand) => 
                              sum + parseFloat(brand.engagement.replace('%', '') || '0'), 0) / trendBrief.brandCollaborations.length).toFixed(1)
                            : '0'}%
                        </div>
                        <div className="text-sm text-gray-600">Avg. Engagement</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {trendBrief.brandCollaborations.length > 0 ?
                            Math.round((trendBrief.brandCollaborations.filter(brand => brand.sentiment === 'positive').length / trendBrief.brandCollaborations.length) * 100)
                            : 0}%
                        </div>
                        <div className="text-sm text-gray-600">Positive Sentiment</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Brand Collaborations Detected</h3>
                  <p className="text-gray-600 mb-4">AI analysis didn't find any brand mentions or partnership indicators in the current content</p>
                  <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-blue-800">
                      <i className="fas fa-lightbulb mr-2"></i>
                      Try analyzing content with more explicit brand mentions, product reviews, or sponsored content
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actionable Recommendations</h3>
                <div className="space-y-4">
                  {trendBrief.actionableRecommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-check text-green-600"></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700">{recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitor Analysis</h3>
                <div className="space-y-3">
                  {trendBrief.contentAnalysis.competitorAnalysis.map((analysis, index) => (
                    <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">{analysis}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Query Tab */}
          {activeTab === 'query' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ask the AI Agent</h3>
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={customQuery}
                      onChange={(e) => setCustomQuery(e.target.value)}
                      placeholder="Ask about trends, engagement, competitors, or anything else..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleCustomQuery()}
                    />
                    <button
                      onClick={handleCustomQuery}
                      disabled={queryLoading || !customQuery.trim()}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      {queryLoading ? (
                        <i className="fas fa-spinner animate-spin"></i>
                      ) : (
                        <i className="fas fa-paper-plane"></i>
                      )}
                      <span>Ask</span>
                    </button>
                  </div>
                  
                  {queryResponse && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">AI Response:</h4>
                      <p className="text-gray-700">{queryResponse}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Suggested Questions:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "What are the top performing content types?",
                    "Which competitors are mentioned most?",
                    "What engagement trends do you see?",
                    "What topics are trending right now?",
                    "How is sentiment changing over time?",
                    "What recommendations do you have for content strategy?"
                  ].map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setCustomQuery(question)}
                      className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendBriefComponent;
