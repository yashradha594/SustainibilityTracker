import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TreePine, Zap, Target, Award, Lightbulb, X } from 'lucide-react';
import WeatherWidget from '../components/WeatherWidget';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
       const res = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/dashboard`,
  {
    headers: { Authorization: `Bearer ${user.token}` }
  }
);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user.token]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your eco-dashboard...</div>;

  const hasData = data && data.chartData && data.chartData.length > 0;

  const getBenchmarkStatus = (avg) => {
    if (avg <= 5) return { label: 'Safe', icon: '🌿', color: '#4CAF50' };
    if (avg <= 15) return { label: 'Moderate', icon: '⚖️', color: '#f1c40f' };
    return { label: 'High', icon: '🔥', color: '#e53e3e' };
  };

  const benchmark = data?.avgDailyEmissions !== undefined ? getBenchmarkStatus(data.avgDailyEmissions) : null;
  const last7Days = hasData ? data.chartData.slice(-7) : [];
  const weeklyTotal = last7Days.reduce((sum, d) => sum + d.total, 0);

  return (
    <div style={styles.container}>
      <div className="trivia-banner">
        <strong>💡 Climate Fact:</strong> To keep global warming to 1.5°C, the IPCC sets a sustainable carbon footprint budget of about 2.0 tonnes per person annually. This equates to approximately <strong>5.5 kg of CO₂ emissions per person per day.</strong>
      </div>

      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <h1 className="title">Welcome back, {user.name}!</h1>
            <p className="subtitle">Here's your sustainability overview.</p>
          </div>
          <button onClick={() => setShowInfoModal(true)} style={styles.bulbBtn} title="How is this calculated?">
            <Lightbulb size={24} color="#f1c40f" />
          </button>
        </div>
        <div style={styles.streakBadge}>
          <Award color="white" size={24} />
          <span>{user.currentStreak || 0} Day Streak</span>
        </div>
      </div>

      <div style={styles.topGrid}>
        {/* Weather & Suggestions Widget */}
        <WeatherWidget />

        {/* Score Card */}
        <div className="card" style={{ ...styles.scoreCard, textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Sustainability Score</h3>
          <div style={styles.scoreCircle}>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span style={styles.scoreText}>{data.sustainabilityScore}</span>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginLeft: '2px' }}>/100</span>
            </div>
          </div>
          <p style={{ marginTop: '1rem', fontWeight: '500' }}>
            {data.sustainabilityScore >= 80 ? 'Eco-Champion 🌱' : 
             data.sustainabilityScore >= 50 ? 'Eco-Warrior ⚖️' : 'Needs Improvement ⚠️'}
          </p>
        </div>

        {/* Total Impact Card */}
        <div className="card" style={styles.impactCard}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'white' }}>Your Impact</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Zap size={32} color="#f1c40f" />
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.totalEmissions} kg</p>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Total CO2 Emitted</p>
            </div>
          </div>
          <div style={styles.divider}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
            <div className="tree-avatar">
              <TreePine size={40} color="white" />
            </div>
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.equivalentTrees}</p>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Equivalent Trees Saved</p>
            </div>
          </div>
        </div>
      </div>

      {hasData && benchmark && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Daily CO₂ Benchmark</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ color: benchmark.label === 'Safe' ? '#4CAF50' : 'var(--text-secondary)', fontWeight: benchmark.label === 'Safe' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🌿 Safe: 0–5 kg/day</div>
              <div style={{ color: benchmark.label === 'Moderate' ? '#f1c40f' : 'var(--text-secondary)', fontWeight: benchmark.label === 'Moderate' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>⚖️ Moderate: 5–15 kg/day</div>
              <div style={{ color: benchmark.label === 'High' ? '#e53e3e' : 'var(--text-secondary)', fontWeight: benchmark.label === 'High' ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🔥 High: 15+ kg/day</div>
            </div>
            <div style={{ backgroundColor: benchmark.color, color: 'white', padding: '0.75rem 1.5rem', borderRadius: '30px', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: `0 4px 15px ${benchmark.color}66` }}>
              Your Level: {benchmark.icon} {benchmark.label} ({data.avgDailyEmissions} kg/day)
            </div>
          </div>
        </div>
      )}

      {hasData ? (
        <>
          <div className="card" style={{ marginTop: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>
              <Target size={24} /> Personalized Tips for You
            </h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {data.tips.map((tip, index) => (
                <li key={index} style={{ padding: '1rem', borderBottom: index < data.tips.length - 1 ? '1px solid #edf2f7' : 'none', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', marginTop: '0.5rem' }}></div>
                  <p style={{ flex: 1, fontSize: '1.05rem' }}>{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </>

      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No data yet!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Start tracking your activities to unlock charts, insights, and your sustainability score.</p>
          <Link to="/track" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
            Log Your First Activity
          </Link>
        </div>
      )}

      {showInfoModal && (
        <div className="modal-overlay" onClick={() => setShowInfoModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowInfoModal(false)}><X size={24} /></button>
            <h2 className="title" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>How CO₂ is Calculated</h2>
            
            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontFamily: 'monospace' }}>
              <strong>Formula:</strong> Emissions = Activity Data × Emission Factor
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>🥩 Non-Vegetarian Food Impact</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>Producing meat, especially red meat, releases high greenhouse gases due to livestock farming, feed production, and transportation, increasing daily CO₂ emissions.</p>
              </div>
              
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>🛍️ Plastic Usage Impact</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>Plastic production and disposal generate CO₂ through fossil fuel extraction, manufacturing, and burning or degradation, contributing to daily carbon emissions.</p>
              </div>

              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>🚗 Transport Impact</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>Vehicles burn fuel like petrol and diesel, releasing CO₂ directly into the atmosphere; longer distances and private vehicle use significantly increase daily emissions.</p>
              </div>

              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>⚡ Electricity Usage Impact</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>Electricity generation often relies on fossil fuels like coal and gas, so higher power consumption (in kWh) leads to increased CO₂ emissions depending on the energy source.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    paddingBottom: '3rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  streakBadge: {
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 'bold',
    boxShadow: 'var(--shadow)',
  },
  topGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  scoreCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '8px solid var(--primary-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: 'var(--primary-dark)',
  },
  impactCard: {
    background: 'linear-gradient(135deg, var(--primary-dark), var(--primary-color))',
    color: 'white',
  },
  bulbBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    backgroundColor: 'rgba(241, 196, 15, 0.1)',
  },
  divider: {
    height: '1px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: '100%',
  }
};

export default Dashboard;
