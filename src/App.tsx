import { useState } from 'react';
import './index.css';

// --- Dashboard View Component ---
function DashboardView() {
  const recentCheckIns = [
    { id: 1, name: 'John Doe', time: '08:45 AM', plan: 'Monthly', status: 'Active' },
    { id: 2, name: 'Sarah Connor', time: '09:12 AM', plan: 'Annual', status: 'Active' },
    { id: 3, name: 'Mike Ross', time: '10:05 AM', plan: 'Daily Pass', status: 'Expired' },
    { id: 4, name: 'Jane Smith', time: '10:30 AM', plan: 'Monthly', status: 'Active' },
  ];

  return (
    <>
      <header className="header">
        <div className="header-title">
          <h2>Welcome Back, Admin</h2>
          <p>Here's what's happening at Neofit today.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary">+ Add New Member</button>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Active Members</div>
          <div className="stat-value">212</div>
          <div className="stat-change positive">↑ 12% vs last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Today's Check-ins</div>
          <div className="stat-value">45</div>
          <div className="stat-change positive">↑ 5% vs yesterday</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Monthly Revenue</div>
          <div className="stat-value">₱45,200</div>
          <div className="stat-change positive">↑ 8% vs last month</div>
        </div>
      </section>

      <section className="recent-activity">
        <h3 className="section-title">Live Check-ins</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Time-In</th>
                <th>Plan Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentCheckIns.map(record => (
                <tr key={record.id}>
                  <td><strong>{record.name}</strong></td>
                  <td>{record.time}</td>
                  <td>{record.plan}</td>
                  <td>
                    <span className={`badge ${record.status.toLowerCase()}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

// --- Members View Component ---
function MembersView() {
  const members = [
    { id: 'M-001', name: 'John Doe', contact: '09123456789', joined: 'Jan 15, 2026', status: 'Active' },
    { id: 'M-002', name: 'Sarah Connor', contact: '09987654321', joined: 'Feb 02, 2026', status: 'Active' },
    { id: 'M-003', name: 'Mike Ross', contact: '09112223344', joined: 'Mar 10, 2026', status: 'Expired' },
    { id: 'M-004', name: 'Jane Smith', contact: '09887776655', joined: 'Apr 05, 2026', status: 'Active' },
    { id: 'M-005', name: 'Bruce Wayne', contact: '09334445566', joined: 'May 01, 2026', status: 'Expiring Soon' },
  ];

  return (
    <>
      <header className="header">
        <div className="header-title">
          <h2>Member Management</h2>
          <p>View and manage all gym members.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary">+ Add New Member</button>
        </div>
      </header>
      
      <div className="search-bar">
        <input type="text" className="input-field" placeholder="Search members by name or ID..." style={{maxWidth: '300px'}} />
        <select className="input-field" style={{maxWidth: '150px'}}>
          <option>All Status</option>
          <option>Active</option>
          <option>Expiring Soon</option>
          <option>Expired</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td><strong>{member.name}</strong></td>
                <td>{member.contact}</td>
                <td>{member.joined}</td>
                <td>
                  <span className={`badge ${member.status.replace(' ', '-').toLowerCase()}`}>
                    {member.status}
                  </span>
                </td>
                <td>
                  <button className="btn-text">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// --- Attendance View Component ---
function AttendanceView() {
  return (
    <div style={{maxWidth: '800px', margin: '0 auto'}}>
      <header className="header">
        <div className="header-title">
          <h2>Attendance Tracker</h2>
          <p>Monitor live gym check-ins via biometrics.</p>
        </div>
      </header>

      <div className="scanner-box">
        <span className="icon">👆</span>
        <h3 style={{fontSize: '1.5rem'}}>Waiting for Fingerprint...</h3>
        <p style={{color: 'var(--text-muted)', marginTop: '8px', fontSize: '1.1rem'}}>Please ask the member to place their finger on the scanner.</p>
      </div>

      <div style={{display: 'flex', alignItems: 'center', gap: '1rem', margin: '3rem 0'}}>
        <div style={{flex: 1, height: '1px', background: 'var(--glass-border)'}}></div>
        <span style={{color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '1px'}}>OR MANUAL ENTRY</span>
        <div style={{flex: 1, height: '1px', background: 'var(--glass-border)'}}></div>
      </div>

      <div className="search-bar" style={{justifyContent: 'center'}}>
        <input type="text" className="input-field" placeholder="Enter Member ID (e.g. M-001)" style={{maxWidth: '300px'}} />
        <button className="btn-primary">Check In</button>
      </div>
    </div>
  );
}

// --- Settings View Component ---
function SettingsView() {
  return (
    <>
      <header className="header">
        <div className="header-title">
          <h2>Gym Settings</h2>
          <p>Update system configuration and announcements.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary">Save Changes</button>
        </div>
      </header>

      <div className="settings-grid" style={{display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'}}>
        <div className="stat-card" style={{padding: '2rem'}}>
          <h3 className="section-title">General Information</h3>
          <div className="form-group">
            <label>Gym Name</label>
            <input type="text" className="input-field" defaultValue="Neofit Fitness Gym" />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input type="text" className="input-field" defaultValue="0908 305 2660" />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea className="input-field" rows={3} defaultValue="PUROK 1 TAGUM SUR, TRINIDAD, BOHOL, Trinidad, Philippines, 6324"></textarea>
          </div>
        </div>

        <div className="stat-card" style={{padding: '2rem'}}>
          <h3 className="section-title">Public Announcement</h3>
          <p style={{color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem'}}>This message will be displayed on the member portal or digital signage.</p>
          <div className="form-group">
            <label>Announcement Text</label>
            <textarea className="input-field" rows={5} defaultValue="Good day, dear clients! Please be advised that APRIL 2 AND 3, 2026 gym will be closed due to the HOLIDAY SEASON. Please be guided."></textarea>
          </div>
        </div>
      </div>
    </>
  );
}

// --- Main App Component ---
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'members': return <MembersView />;
      case 'attendance': return <AttendanceView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#ff5722"/>
            <path d="M2 17L12 22L22 17" stroke="#ff5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="#ff5722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1>NEO<span className="brand-accent">FIT</span></h1>
        </div>
        
        <ul className="nav-links">
          <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </li>
          <li className={`nav-item ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')}>
            Members
          </li>
          <li className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
            Attendance
          </li>
          <li className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            Settings
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
