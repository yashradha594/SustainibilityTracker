import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={styles.container}>
      
      {/* Login Card */}
      <div className="card" style={styles.card}>
        <div style={styles.header}>
          <Leaf color="var(--primary-color)" size={48} />
          <h2 className="title" style={{ marginTop: '1rem' }}>Welcome Back</h2>
          <p className="subtitle" style={{ marginBottom: '1.5rem' }}>
            Login to continue your eco-journey
          </p>
        </div>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="enter your email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="enter your password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full" 
            style={{ marginTop: '1rem' }}
          >
            Login
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link 
            to="/register" 
            style={{ color: 'var(--primary-color)', fontWeight: '600' }}
          >
            Register here
          </Link>
        </p>
      </div>

      {/* ✅ Clean Footer (ONLY YR) */}
      <footer style={styles.footer}>
        <span
          style={styles.yr}
          onMouseEnter={(e) => {
            e.target.style.color = '#ffffff';
            e.target.style.textShadow = '0 0 8px #ffffff';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#888888';
            e.target.style.textShadow = 'none';
            e.target.style.transform = 'scale(1)';
          }}
        >
          Y R
        </span>
      </footer>

    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  card: {
    width: '100%',
    maxWidth: '450px',
    padding: '3rem 2rem',
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  error: {
    backgroundColor: '#fed7d7',
    color: '#c53030',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontSize: '0.875rem'
  },

  /* 🔥 Footer */
  footer: {
    position: 'fixed',
    bottom: '15px',
    right: '25px',
    zIndex: 1000,
  },

  /* YR style */
  yr: {
    color: '#888888', // grey
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  }
};

export default Login;