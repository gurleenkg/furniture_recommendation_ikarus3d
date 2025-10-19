import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, BarChart3 } from 'lucide-react';
import RecommendationPage from './pages/RecommendationPage';
import AnalyticsPage from './pages/AnalyticsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        {/* Navigation Header */}
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">🪑 Furniture AI Assistant</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">
                <Home size={20} />
                <span>Recommendations</span>
              </Link>
              <Link to="/analytics" className="nav-link">
                <BarChart3 size={20} />
                <span>Analytics</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<RecommendationPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;