import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, DollarSign, Tag } from 'lucide-react';
import './AnalyticsPage.css';

const API_URL = 'http://localhost:8000';
const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0'];

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="analytics-page">
        <div className="error">Failed to load analytics. Make sure the backend is running!</div>
      </div>
    );
  }

  // Prepare data for charts
  const categoryData = Object.entries(analytics.categories || {}).map(([name, value]) => ({
    name: name.length > 20 ? name.substring(0, 20) + '...' : name,
    value
  })).slice(0, 8);

  const brandData = Object.entries(analytics.brands || {}).map(([name, value]) => ({
    name: name.length > 15 ? name.substring(0, 15) + '...' : name,
    value
  })).slice(0, 8);

  const materialData = Object.entries(analytics.materials || {}).map(([name, value]) => ({
    name,
    value
  })).slice(0, 6);

  const colorData = Object.entries(analytics.colors || {}).map(([name, value]) => ({
    name,
    value
  })).slice(0, 6);

  return (
    <div className="analytics-page">
      <div className="analytics-container">
        <h1 className="analytics-title">📊 Product Analytics Dashboard</h1>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-icon" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
              <Package size={24} />
            </div>
            <div className="card-content">
              <div className="card-value">{analytics.total_products}</div>
              <div className="card-label">Total Products</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
              <DollarSign size={24} />
            </div>
            <div className="card-content">
              <div className="card-value">${analytics.price_stats.mean.toFixed(2)}</div>
              <div className="card-label">Average Price</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
              <TrendingUp size={24} />
            </div>
            <div className="card-content">
              <div className="card-value">${analytics.price_stats.max.toFixed(2)}</div>
              <div className="card-label">Highest Price</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon" style={{background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'}}>
              <Tag size={24} />
            </div>
            <div className="card-content">
              <div className="card-value">{Object.keys(analytics.categories || {}).length}</div>
              <div className="card-label">Categories</div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Top Categories */}
          <div className="chart-card">
            <h2 className="chart-title">Top Product Categories</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Brands */}
          <div className="chart-card">
            <h2 className="chart-title">Top Brands</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={brandData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#764ba2" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Materials Distribution */}
          <div className="chart-card">
            <h2 className="chart-title">Materials Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={materialData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {materialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Colors Distribution */}
          <div className="chart-card">
            <h2 className="chart-title">Colors Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={colorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {colorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Price Statistics */}
        <div className="chart-card full-width">
          <h2 className="chart-title">Price Statistics</h2>
          <div className="price-stats">
            <div className="stat-item">
              <div className="stat-label">Minimum</div>
              <div className="stat-value">${analytics.price_stats.min.toFixed(2)}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Maximum</div>
              <div className="stat-value">${analytics.price_stats.max.toFixed(2)}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Average</div>
              <div className="stat-value">${analytics.price_stats.mean.toFixed(2)}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Median</div>
              <div className="stat-value">${analytics.price_stats.median.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;