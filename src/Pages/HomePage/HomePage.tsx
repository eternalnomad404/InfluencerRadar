// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../Components/Navigation/Navigation';
import HeroSection from './Components/HeroSection';
import HowItWorksSection from './Components/HowItWorksSection';
import FeatureSnapshot from './Components/FeatureSnapshot';
import Footer from '../../Components/Footer/Footer';

interface CachedInfluencer {
  id: string;
  name: string;
  handle: string;
  profileImage: string;
  niche: string;
  platforms: {
    youtube?: { followers: string; handle: string };
  };
  engagementRate: number;
  totalFollowers: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [cachedInfluencers, setCachedInfluencers] = useState<CachedInfluencer[]>([]);

  // Channel IDs for the featured influencers
  const featuredChannelIds = [
    'UCBJycsmduvYEL83R_U4JriQ', // Marques Brownlee
    'UCsTcErHg8oDvUnTzoqsYeNw', // Unbox Therapy
    'UCXuqSBlHAE6Xw-yeJA0Tunw', // Linus Tech Tips
    'UC6QYFutt9cluQ3uSM8XzKcQ'  // MrWhosetheBoss
  ];

  // Load cached influencer data on component mount
  useEffect(() => {
    const loadCachedData = () => {
      try {
        const cachedData = localStorage.getItem('youtube_tech_influencers');
        if (cachedData) {
          const allInfluencers: CachedInfluencer[] = JSON.parse(cachedData);
          // Filter to only featured influencers
          const featured = allInfluencers.filter(inf => featuredChannelIds.includes(inf.id));
          setCachedInfluencers(featured);
        }
      } catch (error) {
        console.error('Error loading cached influencer data:', error);
      }
    };

    loadCachedData();
  }, []);

  // Get influencer data by channel ID
  const getInfluencerData = (channelId: string) => {
    return cachedInfluencers.find(inf => inf.id === channelId);
  };

  // Handler for navigating to influencer detail page
  const handleInfluencerClick = (channelId: string) => {
    try {
      navigate(`/influencer-detail/${channelId}/technology`);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to influencer page if specific channel fails
      navigate('/influencerPage');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
  <Navigation/>

      {/* Hero Section */}
      <HeroSection/>

      {/* How It Works Section */}
     <HowItWorksSection/>

      {/* Influencer Categories Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Featured Tech Influencers & Content Creators
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Explore top tech influencers with real-time analytics, engagement metrics, and comprehensive performance tracking across multiple platforms
            </p>
            
            {/* Platform Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">67M+</div>
                <div className="text-sm text-gray-600">Total Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">4</div>
                <div className="text-sm text-gray-600">Featured Creators</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">6.8%</div>
                <div className="text-sm text-gray-600">Avg Engagement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Real-time Updates</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Marques Brownlee */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              {getInfluencerData('UCBJycsmduvYEL83R_U4JriQ')?.profileImage ? (
                <img 
                  src={getInfluencerData('UCBJycsmduvYEL83R_U4JriQ')?.profileImage} 
                  alt="Marques Brownlee"
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">MB</span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Marques Brownlee</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Tech Reviews & Cars</p>
              <div className="flex justify-center space-x-2 mb-4">
                <i className="fab fa-youtube text-red-600"></i>
                <i className="fab fa-twitter text-blue-400"></i>
                <i className="fab fa-instagram text-pink-600"></i>
              </div>
              <div className="flex justify-center items-center space-x-3 mb-4">
                <span className="text-sm text-gray-500">
                  {getInfluencerData('UCBJycsmduvYEL83R_U4JriQ')?.platforms?.youtube?.followers || '18.1M subscribers'}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {getInfluencerData('UCBJycsmduvYEL83R_U4JriQ')?.engagementRate ? 
                    `${getInfluencerData('UCBJycsmduvYEL83R_U4JriQ')?.engagementRate.toFixed(1)}% engagement` : 
                    '6.2% engagement'
                  }
                </span>
              </div>
              <button 
                onClick={() => handleInfluencerClick('UCBJycsmduvYEL83R_U4JriQ')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer transition-colors"
              >
                Track Dashboard
              </button>
            </div>

            {/* Unbox Therapy */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              {getInfluencerData('UCsTcErHg8oDvUnTzoqsYeNw')?.profileImage ? (
                <img 
                  src={getInfluencerData('UCsTcErHg8oDvUnTzoqsYeNw')?.profileImage} 
                  alt="Unbox Therapy"
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">UT</span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Unbox Therapy</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Gadget Unboxing & Reviews</p>
              <div className="flex justify-center space-x-2 mb-4">
                <i className="fab fa-youtube text-red-600"></i>
                <i className="fab fa-instagram text-pink-600"></i>
                <i className="fab fa-twitter text-blue-400"></i>
              </div>
              <div className="flex justify-center items-center space-x-3 mb-4">
                <span className="text-sm text-gray-500">
                  {getInfluencerData('UCsTcErHg8oDvUnTzoqsYeNw')?.platforms?.youtube?.followers || '18.4M subscribers'}
                </span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                  {getInfluencerData('UCsTcErHg8oDvUnTzoqsYeNw')?.engagementRate ? 
                    `${getInfluencerData('UCsTcErHg8oDvUnTzoqsYeNw')?.engagementRate.toFixed(1)}% engagement` : 
                    '4.8% engagement'
                  }
                </span>
              </div>
              <button 
                onClick={() => handleInfluencerClick('UCsTcErHg8oDvUnTzoqsYeNw')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer transition-colors"
              >
                Track Dashboard
              </button>
            </div>

            {/* Linus Tech Tips */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              {getInfluencerData('UCXuqSBlHAE6Xw-yeJA0Tunw')?.profileImage ? (
                <img 
                  src={getInfluencerData('UCXuqSBlHAE6Xw-yeJA0Tunw')?.profileImage} 
                  alt="Linus Tech Tips"
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">LTT</span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Linus Tech Tips</h3>
              <p className="text-sm text-gray-600 text-center mb-4">PC Building & Tech</p>
              <div className="flex justify-center space-x-2 mb-4">
                <i className="fab fa-youtube text-red-600"></i>
                <i className="fab fa-twitter text-blue-400"></i>
                <i className="fab fa-twitch text-purple-600"></i>
              </div>
              <div className="flex justify-center items-center space-x-3 mb-4">
                <span className="text-sm text-gray-500">
                  {getInfluencerData('UCXuqSBlHAE6Xw-yeJA0Tunw')?.platforms?.youtube?.followers || '15.6M subscribers'}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {getInfluencerData('UCXuqSBlHAE6Xw-yeJA0Tunw')?.engagementRate ? 
                    `${getInfluencerData('UCXuqSBlHAE6Xw-yeJA0Tunw')?.engagementRate.toFixed(1)}% engagement` : 
                    '7.1% engagement'
                  }
                </span>
              </div>
              <button 
                onClick={() => handleInfluencerClick('UCXuqSBlHAE6Xw-yeJA0Tunw')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer transition-colors"
              >
                Track Dashboard
              </button>
            </div>

            {/* MrWhosetheBoss */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              {getInfluencerData('UC6QYFutt9cluQ3uSM8XzKcQ')?.profileImage ? (
                <img 
                  src={getInfluencerData('UC6QYFutt9cluQ3uSM8XzKcQ')?.profileImage} 
                  alt="Mrwhosetheboss"
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">MWB</span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Mrwhosetheboss</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Smartphone & Tech Reviews</p>
              <div className="flex justify-center space-x-2 mb-4">
                <i className="fab fa-youtube text-red-600"></i>
                <i className="fab fa-instagram text-pink-600"></i>
                <i className="fab fa-twitter text-blue-400"></i>
              </div>
              <div className="flex justify-center items-center space-x-3 mb-4">
                <span className="text-sm text-gray-500">
                  {getInfluencerData('UC6QYFutt9cluQ3uSM8XzKcQ')?.platforms?.youtube?.followers || '14.8M subscribers'}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {getInfluencerData('UC6QYFutt9cluQ3uSM8XzKcQ')?.engagementRate ? 
                    `${getInfluencerData('UC6QYFutt9cluQ3uSM8XzKcQ')?.engagementRate.toFixed(1)}% engagement` : 
                    '8.3% engagement'
                  }
                </span>
              </div>
              <button 
                onClick={() => handleInfluencerClick('UC6QYFutt9cluQ3uSM8XzKcQ')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer transition-colors"
              >
                Track Dashboard
              </button>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Featuring <span className="font-semibold text-blue-600">4 top tech influencers</span> with 
                <span className="font-semibold text-green-600"> 67M+ total subscribers</span>
              </p>
              <p className="text-xs text-gray-500">
                Real-time data • Engagement analytics • Content tracking • Performance insights
              </p>
            </div>
            <button 
              onClick={() => navigate('/influencerPage')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 font-medium !rounded-button whitespace-nowrap cursor-pointer shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <i className="fas fa-chart-line mr-2"></i>
              Explore Full Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Features Snapshot */}
     <FeatureSnapshot/>

      

      {/* Footer */}
     <Footer/>
    </div>
  );
};

export default HomePage;
