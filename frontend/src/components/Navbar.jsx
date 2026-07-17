import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Leaf, LogOut, LayoutDashboard, PlusCircle, LineChart } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          <Leaf color="var(--primary-color)" size={28} />
          <span style={styles.brandText}>EcoTrack</span>
        </Link>
        
        {user ? (
          <div style={styles.navLinks}>
            <Link to="/" className="nav-link">
              <LayoutDashboard size={20} />
              <span className="hide-mobile">Dashboard</span>
            </Link>
            <Link to="/analytics" className="nav-link">
              <LineChart size={20} />
              <span className="hide-mobile">Analytics</span>
            </Link>
            <Link to="/track" className="nav-link">
              <PlusCircle size={20} />
              <span className="hide-mobile">Log Activity</span>
            </Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              <LogOut size={20} />
              <span className="hide-mobile">Logout</span>
            </button>
          </div>
        ) : (
          <div style={styles.navLinks}>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: 'var(--surface-color)',
    boxShadow: 'var(--shadow)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
  },
  brandText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--primary-dark)',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'none',
    border: 'none',
    color: 'var(--danger-color)',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '1rem',
  }
};

export default Navbar;
