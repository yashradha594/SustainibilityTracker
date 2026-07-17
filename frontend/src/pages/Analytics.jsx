import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { BookOpen } from 'lucide-react';

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user.token]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading analytics...</div>;
  const hasData = data && data.chartData && data.chartData.length > 0;

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <h1 className="title">Detailed Analytics</h1>
      <p className="subtitle">Deep dive into your carbon footprint trends.</p>

      {hasData ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Emissions Over Time</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow)' }} />
                  <Line type="monotone" dataKey="total" stroke="var(--primary-color)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Emissions Breakdown</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow)' }} />
                  <Legend />
                  <Bar dataKey="transport" stackId="a" fill="#3498db" name="Transport" radius={[0,0,4,4]} />
                  <Bar dataKey="food" stackId="a" fill="#e67e22" name="Food" />
                  <Bar dataKey="energy" stackId="a" fill="#f1c40f" name="Energy/Waste" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          No data available for analytics yet.
        </div>
      )}

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>
          <BookOpen size={24} /> Knowledge & Factors
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Formula</h4>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
              Emissions = Activity Data × Emission Factor
            </div>
          </div>
          
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Current Emission Factors</h4>
            <ul style={{ listStyleType: 'none', padding: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li style={{ marginBottom: '0.5rem' }}>• Veg food: 1.0 kg CO₂ / meal</li>
              <li style={{ marginBottom: '0.5rem' }}>• Plastic: 0.05 kg CO₂ / item</li>
              <li style={{ marginBottom: '0.5rem' }}>• Car transport: 0.12 kg CO₂ / km</li>
              <li style={{ marginBottom: '0.5rem' }}>• Public transport: 0.05 kg CO₂ / km</li>
              <li style={{ marginBottom: '0.5rem' }}>• Electricity: 0.82 kg CO₂ / kWh</li>
              <li style={{ marginBottom: '0.5rem' }}>• Non-veg food: 2.5 kg CO₂ / meal</li>

              <li>• AC Usage: 1.5 kg CO₂ / hour</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
