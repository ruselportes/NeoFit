import { useState, useEffect } from 'react';
import * as api from '../api';
import type { DashboardStats } from '../types';

export default function DashboardView({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    api.fetchDashboard()
      .then(setStats)
      .catch(err => {
        console.error(err);
        setError('Failed to load dashboard stats.');
      });
  }, []);

  return (
    <>
      {error && <div className="toast error" style={{marginBottom: '1rem'}}>{error}</div>}
      
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
              {stats?.recentCheckIns && stats.recentCheckIns.length > 0 ? stats.recentCheckIns.map((r) => (
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
