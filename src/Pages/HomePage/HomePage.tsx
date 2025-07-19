// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import '@fortawesome/fontawesome-free/css/all.min.css';
import Navigation from '../../Components/Navigation/Navigation';
import HeroSection from './Components/HeroSection';
import HowItWorksSection from './Components/HowItWorksSection';
import FeatureSnapshot from './Components/FeatureSnapshot';
import Footer from '../../Components/Footer/Footer';

const HomePage: React.FC = () => {

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
              Preview Our Curated Influencer List
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover top influencers across different tech niches and start tracking their content
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <img 
                src="https://readdy.ai/api/search-image?query=Professional%20tech%20influencer%20portrait%20of%20young%20entrepreneur%20with%20modern%20office%20background%20clean%20lighting%20and%20confident%20expression%20wearing%20business%20casual%20attire&width=200&height=200&seq=influencer-001&orientation=squarish"
                alt="Tech Influencer"
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover object-top"
              />
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Sarah Chen</h3>
              <p className="text-sm text-gray-600 text-center mb-4">AI & Machine Learning</p>
              <div className="flex justify-center space-x-2 mb-4">
                <i className="fab fa-youtube text-red-600"></i>
                <i className="fab fa-linkedin text-blue-600"></i>
                <i className="fab fa-twitter text-blue-400"></i>
              </div>
              <p className="text-sm text-gray-500 text-center mb-4">2.3M followers</p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer">
                Track This
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <img 
                src="https://readdy.ai/api/search-image?query=Professional%20startup%20founder%20portrait%20with%20modern%20tech%20office%20background%20clean%20professional%20lighting%20wearing%20casual%20business%20attire%20confident%20expression&width=200&height=200&seq=influencer-002&orientation=squarish"
                alt="Startup Influencer"
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover object-top"
              />
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Marcus Rodriguez</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Startup & VC</p>
              <div className="flex justify-center space-x-2 mb-4">
                <i className="fab fa-instagram text-pink-600"></i>
                <i className="fab fa-linkedin text-blue-600"></i>
                <i className="fab fa-twitter text-blue-400"></i>
              </div>
              <p className="text-sm text-gray-500 text-center mb-4">1.8M followers</p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer">
                Track This
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <img 
                src="https://readdy.ai/api/search-image?query=Professional%20female%20tech%20expert%20portrait%20with%20modern%20workspace%20background%20clean%20lighting%20wearing%20professional%20attire%20confident%20and%20approachable%20expression&width=200&height=200&seq=influencer-003&orientation=squarish"
                alt="DevOps Influencer"
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover object-top"
              />
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Emma Thompson</h3>
              <p className="text-sm text-gray-600 text-center mb-4">DevOps & Cloud</p>
              <div className="flex justify-center space-x-2 mb-4">
                <i className="fab fa-youtube text-red-600"></i>
                <i className="fab fa-twitter text-blue-400"></i>
              </div>
              <p className="text-sm text-gray-500 text-center mb-4">950K followers</p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer">
                Track This
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <img 
                src="https://readdy.ai/api/search-image?query=Professional%20cybersecurity%20expert%20portrait%20with%20modern%20tech%20office%20background%20clean%20professional%20lighting%20wearing%20business%20casual%20attire%20confident%20expression&width=200&height=200&seq=influencer-004&orientation=squarish"
                alt="Security Influencer"
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover object-top"
              />
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">David Kim</h3>
              <p className="text-sm text-gray-600 text-center mb-4">Cybersecurity</p>
              <div className="flex justify-center space-x-2 mb-4">
                <i className="fab fa-linkedin text-blue-600"></i>
                <i className="fab fa-twitter text-blue-400"></i>
                <i className="fab fa-instagram text-pink-600"></i>
              </div>
              <p className="text-sm text-gray-500 text-center mb-4">1.2M followers</p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer">
                Track This
              </button>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 font-medium !rounded-button whitespace-nowrap cursor-pointer">
              View All Influencers
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
