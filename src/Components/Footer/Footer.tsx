

const Footer = () => {
  return (
   <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Influencer Radar</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Stay ahead of trends with AI-powered influencer monitoring across all major social platforms.
              </p>
              <div className="flex space-x-4">
                <i className="fab fa-twitter text-xl text-gray-400 hover:text-white cursor-pointer"></i>
                <i className="fab fa-instagram text-xl text-gray-400 hover:text-white cursor-pointer"></i>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white cursor-pointer">Features</a></li>
                <li><a href="#" className="hover:text-white cursor-pointer">Pricing</a></li>
                <li><a href="#" className="hover:text-white cursor-pointer">API</a></li>
                <li><a href="#" className="hover:text-white cursor-pointer">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white cursor-pointer">About</a></li>
                <li><a href="#" className="hover:text-white cursor-pointer">Contact</a></li>
                <li><a href="#" className="hover:text-white cursor-pointer">Privacy</a></li>
                <li><a href="#" className="hover:text-white cursor-pointer">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Influencer Radar. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer
