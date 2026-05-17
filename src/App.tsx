import { useState, useEffect, useCallback } from 'react';
import './index.css';
import * as api from './api';

// --- Dashboard View ---
function DashboardView({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.fetchDashboard().then(setStats).catch(console.error);
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-title">
          <h2>Welcome Back, Admin</h2>
          <p>Here's what's happening at Neofit today.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => onNavigate('members')}>+ Add New Member</button>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Active Members</div>
          <div className="stat-value">{stats?.activeMembers ?? '—'}</div>
          <div className="stat-change positive">of {stats?.totalMembers ?? 0} total</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Today's Check-ins</div>
          <div className="stat-value">{stats?.todayCheckIns ?? '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Members</div>
          <div className="stat-value">{stats?.totalMembers ?? '—'}</div>
        </div>
      </section>

      <section className="recent-activity">
        <h3 className="section-title">Live Check-ins Today</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Member</th><th>Time-In</th><th>Plan</th><th>Status</th></tr>
            </thead>
            <tbody>
              {stats?.recentCheckIns?.length > 0 ? stats.recentCheckIns.map((r: any) => (
                <tr key={r.id}>
                  <td><strong>{r.memberName}</strong></td>
                  <td>{r.time}</td>
                  <td>{r.plan}</td>
                  <td><span className={`badge ${r.status.replace(' ', '-').toLowerCase()}`}>{r.status}</span></td>
                </tr>
              )) : (
                <tr><td colSpan={4} style={{textAlign:'center',color:'var(--text-muted)',padding:'3rem'}}>No check-ins today yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

// --- Members View ---
function MembersView() {
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [form, setForm] = useState({ name: '', contact: '', plan: 'Monthly', joined_date: '', expiry_date: '' });
  const [error, setError] = useState('');

  const loadMembers = useCallback(() => {
    api.fetchMembers(search, statusFilter).then(setMembers).catch(console.error);
  }, [search, statusFilter]);

  useEffect(() => { loadMembers(); }, [loadMembers]);

  const openAdd = () => {
    setEditingMember(null);
    setForm({ name: '', contact: '', plan: 'Monthly', joined_date: new Date().toISOString().split('T')[0], expiry_date: '' });
    setError('');
    setShowModal(true);
  };

  const openEdit = (m: any) => {
    setEditingMember(m);
    setForm({
      name: m.name, contact: m.contact, plan: m.plan,
      joined_date: m.joined_date?.split('T')[0] || '',
      expiry_date: m.expiry_date?.split('T')[0] || '',
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setError('');
      if (!form.name || !form.contact || !form.expiry_date) { setError('Please fill in all fields.'); return; }
      if (editingMember) {
        await api.updateMember(editingMember.id, form);
      } else {
        await api.createMember(form);
      }
      setShowModal(false);
      loadMembers();
    } catch (e: any) { setError(e.message); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    await api.deleteMember(id);
    loadMembers();
  };

  return (
    <>
      <header className="header">
        <div className="header-title">
          <h2>Member Management</h2>
          <p>View and manage all gym members.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={openAdd}>+ Add New Member</button>
        </div>
      </header>

      <div className="search-bar">
        <input type="text" className="input-field" placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} style={{maxWidth:'300px'}} />
        <select className="input-field" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{maxWidth:'160px'}}>
          <option>All Status</option>
          <option>Active</option>
          <option>Expiring Soon</option>
          <option>Expired</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Contact</th><th>Plan</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {members.map((m: any) => (
              <tr key={m.id}>
                <td>{m.member_id}</td>
                <td><strong>{m.name}</strong></td>
                <td>{m.contact}</td>
                <td>{m.plan}</td>
                <td><span className={`badge ${m.status.replace(' ','-').toLowerCase()}`}>{m.status}</span></td>
                <td>
                  <button className="btn-text" onClick={() => openEdit(m)}>Edit</button>
                  <button className="btn-text" style={{color:'var(--danger)',marginLeft:'0.5rem'}} onClick={() => handleDelete(m.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingMember ? 'Edit Member' : 'Add New Member'}</h3>
            {error && <p className="form-error">{error}</p>}
            <div className="form-group"><label>Full Name</label><input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div className="form-group"><label>Contact</label><input className="input-field" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} /></div>
            <div className="form-group"><label>Plan</label>
              <select className="input-field" value={form.plan} onChange={e => setForm({...form, plan: e.target.value})}>
                <option>Daily Pass</option><option>Monthly</option><option>Annual</option>
              </select>
            </div>
            <div className="form-group"><label>Joined Date</label><input type="date" className="input-field" value={form.joined_date} onChange={e => setForm({...form, joined_date: e.target.value})} /></div>
            <div className="form-group"><label>Expiry Date</label><input type="date" className="input-field" value={form.expiry_date} onChange={e => setForm({...form, expiry_date: e.target.value})} /></div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>{editingMember ? 'Update' : 'Add Member'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- Attendance View ---
function AttendanceView() {
  const [memberId, setMemberId] = useState('');
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<{ type: string; msg: string } | null>(null);

  const loadCheckIns = () => { api.fetchCheckIns().then(setCheckIns).catch(console.error); };
  useEffect(() => { loadCheckIns(); }, []);

  const handleCheckIn = async () => {
    if (!memberId.trim()) return;
    try {
      const result = await api.createCheckIn(memberId.trim());
      setFeedback({ type: 'success', msg: `✅ ${result.memberName} checked in successfully!` });
      setMemberId('');
      loadCheckIns();
      setTimeout(() => setFeedback(null), 4000);
    } catch (e: any) {
      setFeedback({ type: 'error', msg: e.message });
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header className="header">
        <div className="header-title">
          <h2>Attendance Tracker</h2>
          <p>Monitor live gym check-ins via biometrics or manual entry.</p>
        </div>
      </header>

      <div className="scanner-box">
        <span className="icon">👆</span>
        <h3 style={{ fontSize: '1.5rem' }}>Waiting for Fingerprint...</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '1.1rem' }}>
          Scanner integration pending hardware setup.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
        <span style={{ color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '1px' }}>MANUAL ENTRY</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
      </div>

      {feedback && (
        <div className={`toast ${feedback.type}`}>{feedback.msg}</div>
      )}

      <div className="search-bar" style={{ justifyContent: 'center' }}>
        <input
          type="text" className="input-field" placeholder="Enter Member ID (e.g. M-001)"
          value={memberId} onChange={e => setMemberId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCheckIn()}
          style={{ maxWidth: '300px' }}
        />
        <button className="btn-primary" onClick={handleCheckIn}>Check In</button>
      </div>

      {checkIns.length > 0 && (
        <div style={{ marginTop: '2.5rem' }}>
          <h3 className="section-title">Today's Log</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Member</th><th>ID</th><th>Time-In</th><th>Status</th></tr></thead>
              <tbody>
                {checkIns.map((c: any) => (
                  <tr key={c.id}>
                    <td><strong>{c.memberName}</strong></td>
                    <td>{c.memberId}</td>
                    <td>{c.time}</td>
                    <td><span className={`badge ${c.status.replace(' ','-').toLowerCase()}`}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Settings View ---
function SettingsView() {
  const [form, setForm] = useState({ gymName: '', contact: '', address: '', announcement: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.fetchSettings().then(setForm).catch(console.error);
  }, []);

  const handleSave = async () => {
    await api.saveSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <header className="header">
        <div className="header-title">
          <h2>Gym Settings</h2>
          <p>Update system configuration and announcements.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleSave}>
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        <div className="stat-card" style={{ padding: '2rem' }}>
          <h3 className="section-title">General Information</h3>
          <div className="form-group"><label>Gym Name</label>
            <input className="input-field" value={form.gymName} onChange={e => setForm({ ...form, gymName: e.target.value })} />
          </div>
          <div className="form-group"><label>Contact Number</label>
            <input className="input-field" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
          </div>
          <div className="form-group"><label>Address</label>
            <textarea className="input-field" rows={3} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}></textarea>
          </div>
        </div>

        <div className="stat-card" style={{ padding: '2rem' }}>
          <h3 className="section-title">Public Announcement</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            This message will be displayed on the member portal or digital signage.
          </p>
          <div className="form-group"><label>Announcement Text</label>
            <textarea className="input-field" rows={5} value={form.announcement} onChange={e => setForm({ ...form, announcement: e.target.value })}></textarea>
          </div>
        </div>
      </div>
    </>
  );
}

// --- Main App ---
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView onNavigate={setActiveTab} />;
      case 'members': return <MembersView />;
      case 'attendance': return <AttendanceView />;
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
          {['dashboard', 'members', 'attendance', 'settings'].map(tab => (
            <li key={tab} className={`nav-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </li>
          ))}
        </ul>
      </aside>
      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

export default App;
