
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartMonitoring = () => {
    navigate('/influencerPage');
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=Modern%20digital%20dashboard%20interface%20with%20analytics%20charts%20and%20social%20media%20monitoring%20tools%20displayed%20on%20multiple%20screens%20in%20a%20clean%20minimalist%20office%20environment%20with%20soft%20blue%20lighting%20and%20professional%20atmosphere&width=1440&height=800&seq=hero-bg-001&orientation=landscape"
            alt="Background"
            className="w-full h-full object-cover object-top opacity-10"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Know What Influencers Say —
                <span className="text-blue-600"> Before It Goes Viral</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Track your curated influencers across YouTube, Instagram, and Twitter. Get AI-powered summaries every 48 hours — no noise, just insight.
              </p>

              <button 
                onClick={handleStartMonitoring}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold !rounded-button whitespace-nowrap cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Monitoring Now
              </button>
            </div>

            <div className="relative">
              <img
                src="https://readdy.ai/api/search-image?query=Sleek%20modern%20dashboard%20mockup%20showing%20social%20media%20analytics%20and%20influencer%20tracking%20interface%20with%20clean%20charts%20graphs%20and%20profile%20cards%20displayed%20on%20laptop%20and%20mobile%20devices%20with%20professional%20blue%20and%20white%20color%20scheme&width=600&height=500&seq=hero-dashboard-001&orientation=landscape"
                alt="Dashboard Preview"
                className="w-full h-auto object-cover object-top rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
  )
}

export default HeroSection
