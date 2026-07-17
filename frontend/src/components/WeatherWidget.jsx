import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cloud, Sun, CloudRain, Wind, AlertCircle } from 'lucide-react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ecoAction, setEcoAction] = useState('');

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Fetch weather from Open-Meteo
            const res = await axios.get(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );
            
            const current = res.data.current_weather;
            setWeather(current);
            generateEcoAction(current.temperature, current.weathercode);
            setLoading(false);
          } catch (err) {
            setError('Could not fetch weather data');
            setLoading(false);
          }
        },
        (err) => {
          setError('Location access denied. Cannot fetch local weather.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []);

  const generateEcoAction = (temp, code) => {
    // Basic logic for eco actions based on weather
    if (temp > 28) {
      setEcoAction("It's quite hot! Try using a fan instead of AC to save energy.");
    } else if (temp < 10) {
      setEcoAction("It's cold! Put on a sweater instead of turning up the heater.");
    } else if (code === 0 || code === 1) { // Clear or mainly clear
      setEcoAction("Beautiful weather outside! Great day to walk or bike instead of driving.");
    } else if (code >= 51 && code <= 67) { // Rain
      setEcoAction("It's rainy today. Consider carpooling or taking public transport.");
    } else {
      setEcoAction("A nice day to keep up your sustainable habits!");
    }
  };

  const getWeatherIcon = (code) => {
    if (code === 0 || code === 1) return <Sun size={32} color="#f39c12" />;
    if (code >= 51 && code <= 67) return <CloudRain size={32} color="#3498db" />;
    return <Cloud size={32} color="#95a5a6" />;
  };

  if (loading) return <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>Loading local weather...</div>;
  if (error) return (
    <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
      <AlertCircle color="var(--danger-color)" />
      <p>{error}</p>
    </div>
  );

  return (
    <div className="card" style={styles.weatherCard}>
      <div style={styles.weatherInfo}>
        {getWeatherIcon(weather.weathercode)}
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{weather.temperature}°C</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Current Weather</p>
        </div>
      </div>
      <div style={styles.divider}></div>
      <div style={styles.actionSection}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
          <Wind size={20} />
          <h4 style={{ fontWeight: '600' }}>Smart Suggestion</h4>
        </div>
        <p style={{ fontSize: '0.95rem' }}>{ecoAction}</p>
      </div>
    </div>
  );
};

const styles = {
  weatherCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    color: 'white',
  },
  weatherInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  divider: {
    height: '1px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: '100%',
  },
  actionSection: {
    marginTop: '0.5rem',
  }
};

export default WeatherWidget;
