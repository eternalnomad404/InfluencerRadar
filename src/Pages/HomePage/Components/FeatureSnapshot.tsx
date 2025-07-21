const FeatureSnapshot = () => {
  return (
   <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
                Everything You Need to Stay Ahead
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-brain text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Summaries Every 48 Hours</h3>
                    <p className="text-gray-600">Get intelligent, contextual summaries of all influencer content without the noise.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-share-alt text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Platform Coverage</h3>
                    <p className="text-gray-600">Monitor YouTube, Instagram, and Twitter from a single dashboard.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-tachometer-alt text-purple-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard + Email Briefs</h3>
                    <p className="text-gray-600">Access insights through our web dashboard or receive them directly in your inbox.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-list text-orange-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Customizable Tracking Lists</h3>
                    <p className="text-gray-600">Create and manage multiple lists for different campaigns, competitors, or niches.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://readdy.ai/api/search-image?query=Modern%20analytics%20dashboard%20interface%20showing%20social%20media%20monitoring%20tools%20with%20charts%20graphs%20and%20influencer%20tracking%20data%20displayed%20on%20computer%20screen%20with%20clean%20professional%20design%20and%20blue%20color%20scheme&width=600&height=500&seq=features-dashboard-001&orientation=landscape"
                alt="Features Dashboard"
                className="w-full h-auto object-cover object-top rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
  )
}

export default FeatureSnapshot
