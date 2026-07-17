import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Car, Utensils, Zap, Trash2, CheckCircle2 } from 'lucide-react';

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    paddingBottom: '3rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
  }
};

const ActivityTracker = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    transportMode: 'none',
    distance: '',
    diet: 'none',
    electricity: '',
    acUsage: '',
    plasticUsage: '',
    recycled: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchToday = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/activity/today', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.data) {
          setIsEditMode(true);
          const d = res.data;
          setFormData({
            transportMode: d.transport?.mode || 'none',
            distance: d.transport?.distance || '',
            diet: d.food?.diet || 'none',
            electricity: d.energy?.electricity || '',
            acUsage: d.energy?.acUsage || '',
            plasticUsage: d.waste?.plasticUsage || '',
            recycled: d.waste?.recycled || false,
          });
        }
      } catch (err) {
        console.error("Could not fetch today's activity", err);
      }
    };
    fetchToday();
  }, [user.token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      transport: {
        mode: formData.transportMode,
        distance: Number(formData.distance) || 0
      },
      food: {
        diet: formData.diet
      },
      energy: {
        electricity: Number(formData.electricity) || 0,
        acUsage: Number(formData.acUsage) || 0
      },
      waste: {
        plasticUsage: Number(formData.plasticUsage) || 0,
        recycled: formData.recycled
      }
    };

    try {
      await axios.post('http://localhost:5000/api/activity', payload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error("Error logging activity", error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div className="card text-center" style={{ padding: '4rem 2rem', maxWidth: '500px', margin: '0 auto' }}>
          <CheckCircle2 color="var(--primary-color)" size={64} style={{ margin: '0 auto', marginBottom: '1rem' }} />
          <h2 className="title">Activity Logged!</h2>
          <p className="subtitle">Great job tracking your daily impact.</p>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 className="title">{isEditMode ? 'Update Today\'s Activity' : 'Log Daily Activity'}</h1>
      <p className="subtitle">{isEditMode ? 'You have already logged data today. Update it below.' : 'Enter your activities for today to see your impact.'}</p>

      <form onSubmit={handleSubmit} style={styles.formGrid}>
        
        {/* Transport */}
        <div className="card" style={styles.section}>
          <div className="flex items-center gap-4 mb-4" style={{ color: 'var(--primary-dark)' }}>
            <Car size={24} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Transport</h3>
          </div>
          <div className="form-group">
            <label className="form-label">Main Mode of Transport</label>
            <select className="form-input" name="transportMode" value={formData.transportMode} onChange={handleChange}>
              <option value="none">None (Stayed home)</option>
              <option value="walking">Walking / Bike</option>
              <option value="public transport">Public Transport</option>
              <option value="car">Car / Ride-share</option>
            </select>
          </div>
          {formData.transportMode !== 'none' && formData.transportMode !== 'walking' && (
            <div className="form-group">
              <label className="form-label">Distance (km)</label>
              <input type="number" className="form-input" name="distance" value={formData.distance} onChange={handleChange} min="0" />
            </div>
          )}
        </div>

        {/* Food */}
        <div className="card" style={styles.section}>
          <div className="flex items-center gap-4 mb-4" style={{ color: '#e67e22' }}>
            <Utensils size={24} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Food</h3>
          </div>
          <div className="form-group">
            <label className="form-label">Primary Diet Today</label>
            <select className="form-input" name="diet" value={formData.diet} onChange={handleChange}>
              <option value="none">Did not eat (fasting)</option>
              <option value="veg">Vegetarian / Vegan</option>
              <option value="dairy">Vegetarian with Dairy</option>
              <option value="non-veg">Non-Vegetarian (Meat)</option>
            </select>
          </div>
        </div>

        {/* Energy */}
        <div className="card" style={styles.section}>
          <div className="flex items-center gap-4 mb-4" style={{ color: '#f1c40f' }}>
            <Zap size={24} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Energy Usage</h3>
          </div>
          <div className="form-group">
            <label className="form-label">Estimated Electricity (in kWh / units consumed)</label>
            <input type="number" className="form-input" name="electricity" value={formData.electricity} onChange={handleChange} min="0" placeholder="e.g. 10" />
            <small style={{ color: 'var(--text-secondary)' }}>If unknown, estimate based on appliance usage.</small>
          </div>
          <div className="form-group">
            <label className="form-label">AC/Heater Usage (hours per day)</label>
            <input type="number" className="form-input" name="acUsage" value={formData.acUsage} onChange={handleChange} min="0" placeholder="e.g. 4" />
          </div>
        </div>

        {/* Waste */}
        <div className="card" style={styles.section}>
          <div className="flex items-center gap-4 mb-4" style={{ color: '#95a5a6' }}>
            <Trash2 size={24} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Waste</h3>
          </div>
          <div className="form-group">
            <label className="form-label">Plastic Items Used</label>
            <input type="number" className="form-input" name="plasticUsage" value={formData.plasticUsage} onChange={handleChange} min="0" placeholder="e.g. 2" />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="recycled" name="recycled" checked={formData.recycled} onChange={handleChange} style={{ width: '20px', height: '20px', accentColor: 'var(--primary-color)' }} />
            <label htmlFor="recycled" style={{ fontWeight: '500' }}>I recycled my waste today</label>
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
            {loading ? 'Saving...' : isEditMode ? 'Update Activity' : 'Save Activity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityTracker;
