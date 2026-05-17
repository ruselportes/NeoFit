import { useState } from 'react';
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
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (newToken: string, newRole: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    setToken(newToken);
    setRole(newRole);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.className = newTheme === 'light' ? 'light-mode' : '';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView onNavigate={setActiveTab} role={role} />;
      case 'members': return <MembersView role={role} showNotification={showNotification} />;
      case 'attendance': return <AttendanceView showNotification={showNotification} />;
      case 'rates': return <RatesView />;
      case 'settings': 
        return role === 'admin' ? <SettingsView showNotification={showNotification} /> : <DashboardView onNavigate={setActiveTab} role={role} />;
      default: return <DashboardView onNavigate={setActiveTab} role={role} />;
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
            <rect x="6" y="11" width="12" height="2" fill="#ff5722" />
            <rect x="3" y="7" width="3" height="10" rx="1" fill="#ff5722" />
            <rect x="18" y="7" width="3" height="10" rx="1" fill="#ff5722" />
            <rect x="1" y="9" width="2" height="6" rx="0.5" fill="#ff5722" opacity="0.7"/>
            <rect x="21" y="9" width="2" height="6" rx="0.5" fill="#ff5722" opacity="0.7"/>
          </svg>
          <h1>NEO<span className="brand-accent">FIT</span></h1>
        </div>
        <ul className="nav-links">
          {['dashboard', 'members', 'attendance', 'rates', 'settings']
            .filter(tab => role === 'admin' || tab !== 'settings')
            .map(tab => (
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
      
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: notification.type === 'success' ? '#4caf50' : '#f44336',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {notification.type === 'success' ? '✅' : '❌'}
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default App;
