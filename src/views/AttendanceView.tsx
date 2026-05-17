import { useState, useEffect } from 'react';
import * as api from '../api';
import type { CheckIn } from '../types';

export default function AttendanceView() {
  const [memberId, setMemberId] = useState('');
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [feedback, setFeedback] = useState<{ type: string; msg: string } | null>(null);

  const loadCheckIns = () => {
    api.fetchCheckIns()
      .then(setCheckIns)
      .catch(err => {
        console.error(err);
        setFeedback({ type: 'error', msg: 'Failed to load check-ins.' });
      });
  };

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
      setFeedback({ type: 'error', msg: e.message || 'Failed to check in.' });
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
                {checkIns.map((c) => (
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
