import { useState } from "react";

const Navigation = () => {
    
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">Influencer Radar</h1>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">Home</a>
                <a href="/influencerPage" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">Influencers</a>
              </div>
            </div>

            <div className="hidden md:block">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer">
                Login
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
              <a href="#" className="text-gray-900 block px-3 py-2 text-base font-medium cursor-pointer">Home</a>
              <a href="#" className="text-gray-600 block px-3 py-2 text-base font-medium cursor-pointer">Influencers</a>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium !rounded-button whitespace-nowrap cursor-pointer mt-4 ml-3">
                Login
              </button>
            </div>
          </div>
        )}
      </nav>
  )
}

export default Navigation
