// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './Pages/HomePage/HomePage';
import InfluencerPage from './Pages/InfluencersPage/InfluencerPage';
import InfluencerDetailPage from './Pages/InfluencerDetailPage/InfluencerDetailPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/influencerPage" element={<InfluencerPage />} />
          {/* Dynamic route for influencer detail: accepts channelId and category */}
          <Route path="/influencer-detail/:channelId/:category" element={<InfluencerDetailPage />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
