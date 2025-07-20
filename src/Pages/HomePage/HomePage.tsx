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
              <img 
                src="https://readdy.ai/api/search-image?query=Marques%20Brownlee%20MKBHD%20portrait%20professional%20tech%20reviewer%20clean%20background&width=200&height=200&seq=mkbhd-001&orientation=squarish"
                alt="Marques Brownlee"
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover object-center"
              />
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
                onClick={() => navigate('/influencer-detail/UCBJycsmduvYEL83R_U4JriQ/technology')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer transition-colors"
              >
                Track Dashboard
              </button>
            </div>

            {/* Unbox Therapy */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <img 
                src="https://readdy.ai/api/search-image?query=Lewis%20Hilsenteger%20Unbox%20Therapy%20tech%20unboxing%20portrait%20professional&width=200&height=200&seq=unbox-therapy-001&orientation=squarish"
                alt="Unbox Therapy"
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover object-center"
              />
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
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer">
                Track Dashboard
              </button>
            </div>

            {/* Linus Tech Tips */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <img 
                src="https://readdy.ai/api/search-image?query=Linus%20Sebastian%20Linus%20Tech%20Tips%20portrait%20professional%20tech%20content%20creator&width=200&height=200&seq=ltt-001&orientation=squarish"
                alt="Linus Tech Tips"
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover object-center"
              />
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
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer">
                Track Dashboard
              </button>
            </div>

            {/* MrWhosetheBoss */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <img 
                src="https://readdy.ai/api/search-image?query=Arun%20Maini%20Mrwhosetheboss%20tech%20reviewer%20portrait%20professional%20smartphone%20expert&width=200&height=200&seq=mrwhosetheboss-001&orientation=squarish"
                alt="MrWhosetheBoss"
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover object-center"
              />
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
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer">
                Track Dashboard
              </button>
            </div>
          </div>

          {/* Second Row of Influencers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {/* Austin Evans */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <img 
                src="https://readdy.ai/api/search-image?query=Austin%20Evans%20tech%20reviewer%20portrait%20professional%20budget%20tech%20content%20creator&width=200&height=200&seq=austin-evans-001&orientation=squarish"
                alt="Austin Evans"
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover object-center"
              />
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
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer">
                Track Dashboard
              </button>
            </div>

            {/* JerryRigEverything */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <img 
                src="https://readdy.ai/api/search-image?query=Zack%20Nelson%20JerryRigEverything%20durability%20tester%20tech%20portrait%20professional&width=200&height=200&seq=jerryrig-001&orientation=squarish"
                alt="JerryRigEverything"
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover object-center"
              />
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
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer">
                Track Dashboard
              </button>
            </div>

            {/* Technical Guruji */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <img 
                src="https://readdy.ai/api/search-image?query=Gaurav%20Chaudhary%20Technical%20Guruji%20Indian%20tech%20YouTuber%20portrait%20professional&width=200&height=200&seq=technical-guruji-001&orientation=squarish"
                alt="Technical Guruji"
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover object-center"
              />
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
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer">
                Track Dashboard
              </button>
            </div>

            {/* Tech Burner */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <img 
                src="https://readdy.ai/api/search-image?query=Tech%20Burner%20Shlok%20Srivastava%20Indian%20tech%20YouTuber%20portrait%20professional&width=200&height=200&seq=tech-burner-001&orientation=squarish"
                alt="Tech Burner"
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover object-center"
              />
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
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer">
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
