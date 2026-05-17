import { useState, useEffect } from 'react';
import './index.css';

// Import Views
import DashboardView from './views/DashboardView';
import MembersView from './views/MembersView';
import AttendanceView from './views/AttendanceView';
import SettingsView from './views/SettingsView';
import RatesView from './views/RatesView';
import LoginView from './views/LoginView';

// --- Main App ---
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.className = newTheme === 'light' ? 'light-mode' : '';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView onNavigate={setActiveTab} />;
      case 'members': return <MembersView />;
      case 'attendance': return <AttendanceView />;
      case 'rates': return <RatesView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView onNavigate={setActiveTab} />;
    }
  };

  if (!token) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#ff5722" />
            <path d="M2 17L12 22L22 17" stroke="#ff5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="#ff5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1>NEO<span className="brand-accent">FIT</span></h1>
        </div>
        <ul className="nav-links">
          {['dashboard', 'members', 'attendance', 'rates', 'settings'].map(tab => (
            <li key={tab} className={`nav-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </li>
          ))}
        </ul>
        
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            className="btn-secondary" 
            onClick={toggleTheme} 
            style={{
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px',
              padding: '0.75rem'
            }}
          >
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          
          <button 
            className="btn-secondary" 
            onClick={handleLogout} 
            style={{
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px',
              padding: '0.75rem',
              color: 'var(--danger)'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>
      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

export default App;
