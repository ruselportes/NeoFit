import { useState } from 'react';
import './index.css';

// Import Views
import DashboardView from './views/DashboardView';
import MembersView from './views/MembersView';
import AttendanceView from './views/AttendanceView';
import SettingsView from './views/SettingsView';
import RatesView from './views/RatesView';

// --- Main App ---
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.className = newTheme === 'light' ? 'light-mode' : '';
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
        
        <button 
          className="btn-secondary" 
          onClick={toggleTheme} 
          style={{
            marginTop: 'auto', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px',
            padding: '0.75rem'
          }}
        >
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </aside>
      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

export default App;
