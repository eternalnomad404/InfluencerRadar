// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../Components/Navigation/Navigation';
import HeroSection from './Components/HeroSection';
import HowItWorksSection from './Components/HowItWorksSection';
import FeatureSnapshot from './Components/FeatureSnapshot';
import Footer from '../../Components/Footer/Footer';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

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
                <div className="text-3xl font-bold text-blue-600 mb-1">150M+</div>
                <div className="text-sm text-gray-600">Total Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">15+</div>
                <div className="text-sm text-gray-600">Verified Creators</div>
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
              <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">MB</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Marques Brownlee</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Tech Reviews & Cars</p>
              <div className="flex justify-center space-x-2 mb-4">
                <i className="fab fa-youtube text-red-600"></i>
                <i className="fab fa-twitter text-blue-400"></i>
                <i className="fab fa-instagram text-pink-600"></i>
              </div>
              <div className="flex justify-center items-center space-x-3 mb-4">
                <span className="text-sm text-gray-500">18.1M subscribers</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">6.2% engagement</span>
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
              <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">UT</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Unbox Therapy</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Gadget Unboxing & Reviews</p>
              <div className="flex justify-center space-x-2 mb-4">
                <i className="fab fa-youtube text-red-600"></i>
                <i className="fab fa-instagram text-pink-600"></i>
                <i className="fab fa-twitter text-blue-400"></i>
              </div>
              <div className="flex justify-center items-center space-x-3 mb-4">
                <span className="text-sm text-gray-500">18.4M subscribers</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">4.8% engagement</span>
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
              <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">LTT</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Linus Tech Tips</h3>
              <p className="text-sm text-gray-600 text-center mb-4">PC Building & Tech</p>
              <div className="flex justify-center space-x-2 mb-4">
                <i className="fab fa-youtube text-red-600"></i>
                <i className="fab fa-twitter text-blue-400"></i>
                <i className="fab fa-twitch text-purple-600"></i>
              </div>
              <div className="flex justify-center items-center space-x-3 mb-4">
                <span className="text-sm text-gray-500">15.6M subscribers</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">7.1% engagement</span>
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
              <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">MWB</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Mrwhosetheboss</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Smartphone & Tech Reviews</p>
              <div className="flex justify-center space-x-2 mb-4">
                <i className="fab fa-youtube text-red-600"></i>
                <i className="fab fa-instagram text-pink-600"></i>
                <i className="fab fa-twitter text-blue-400"></i>
              </div>
              <div className="flex justify-center items-center space-x-3 mb-4">
                <span className="text-sm text-gray-500">14.8M subscribers</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">8.3% engagement</span>
              </div>
              <button 
                onClick={() => handleInfluencerClick('UC6QYFutt9cluQ3uSM8XzKcQ')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer transition-colors"
              >
                Track Dashboard
              </button>
            </div>
          </div>

          {/* Second Row of Influencers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {/* Austin Evans */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">AE</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Austin Evans</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Budget Tech & Gaming</p>
              <div className="flex justify-center space-x-2 mb-4">
                <i className="fab fa-youtube text-red-600"></i>
                <i className="fab fa-twitter text-blue-400"></i>
                <i className="fab fa-instagram text-pink-600"></i>
              </div>
              <div className="flex justify-center items-center space-x-3 mb-4">
                <span className="text-sm text-gray-500">5.42M subscribers</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">5.7% engagement</span>
              </div>
              <button 
                onClick={() => handleInfluencerClick('UCXGgrKt94gR6lmN4aN3mYTg')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer transition-colors"
              >
                Track Dashboard
              </button>
            </div>

            {/* JerryRigEverything */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">JRE</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">JerryRigEverything</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Durability Testing</p>
              <div className="flex justify-center space-x-2 mb-4">
                <i className="fab fa-youtube text-red-600"></i>
                <i className="fab fa-instagram text-pink-600"></i>
                <i className="fab fa-twitter text-blue-400"></i>
              </div>
              <div className="flex justify-center items-center space-x-3 mb-4">
                <span className="text-sm text-gray-500">7.88M subscribers</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">9.2% engagement</span>
              </div>
              <button 
                onClick={() => handleInfluencerClick('UCWFKCr40YwOZQx8FHU_ZqqQ')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer transition-colors"
              >
                Track Dashboard
              </button>
            </div>

            {/* Technical Guruji */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">TG</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Technical Guruji</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Hindi Tech Content</p>
              <div className="flex justify-center space-x-2 mb-4">
                <i className="fab fa-youtube text-red-600"></i>
                <i className="fab fa-instagram text-pink-600"></i>
                <i className="fab fa-twitter text-blue-400"></i>
              </div>
              <div className="flex justify-center items-center space-x-3 mb-4">
                <span className="text-sm text-gray-500">23.1M subscribers</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">6.8% engagement</span>
              </div>
              <button 
                onClick={() => handleInfluencerClick('UCmYTgAKDyZR-MG2-dJ8M8lA')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer transition-colors"
              >
                Track Dashboard
              </button>
            </div>

            {/* Tech Burner */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">TB</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Tech Burner</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Indian Tech Reviews</p>
              <div className="flex justify-center space-x-2 mb-4">
                <i className="fab fa-youtube text-red-600"></i>
                <i className="fab fa-instagram text-pink-600"></i>
                <i className="fab fa-twitter text-blue-400"></i>
              </div>
              <div className="flex justify-center items-center space-x-3 mb-4">
                <span className="text-sm text-gray-500">12.2M subscribers</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">4.9% engagement</span>
              </div>
              <button 
                onClick={() => handleInfluencerClick('UCe24XAEotUKjSTQ5EPVgieA')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer transition-colors"
              >
                Track Dashboard
              </button>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Featuring <span className="font-semibold text-blue-600">15+ verified tech influencers</span> with 
                <span className="font-semibold text-green-600"> 150M+ total subscribers</span>
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
