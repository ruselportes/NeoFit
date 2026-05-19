import { useState, useEffect } from 'react';
import * as api from '../api';
import type { CheckIn } from '../types';

export default function AttendanceView({ showNotification }: { showNotification: (message: string, type?: 'success' | 'error') => void }) {
  const [memberId, setMemberId] = useState('M-');
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [feedback, setFeedback] = useState<{ type: string; msg: string } | null>(null);

  const handleMemberIdChange = (value: string) => {
    // Always keep the M- prefix
    if (!value.startsWith('M-')) {
      setMemberId('M-');
      return;
    }
    const afterPrefix = value.slice(2).replace(/\D/g, ''); // digits only after M-
    setMemberId('M-' + afterPrefix.slice(0, 3)); // max 3 digits (M-001 to M-999)
  };

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
      showNotification(`${result.memberName} checked in successfully!`);
      setMemberId('M-');
      loadCheckIns();
    } catch (e: any) {
      showNotification(e.message || 'Failed to check in.', 'error');
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

      <div className="scanner-box" style={{ position: 'relative', overflow: 'hidden' }}>
        <span style={{ 
          position: 'absolute', 
          top: '12px', 
          right: '12px', 
          fontSize: '0.75rem', 
          background: 'rgba(255, 87, 34, 0.15)', 
          color: 'var(--accent)', 
          padding: '4px 10px', 
          borderRadius: '12px', 
          fontWeight: 600,
          border: '1px solid rgba(255, 87, 34, 0.3)'
        }}>
          Coming Soon
        </span>
        <span className="icon" style={{ opacity: 0.6 }}>👆</span>
        <h3 style={{ fontSize: '1.5rem', opacity: 0.8 }}>Fingerprint Scanner</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '1.1rem', opacity: 0.7 }}>
          Biometric integration is scheduled for future deployment.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
        <span style={{ color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '1px' }}>MANUAL ENTRY</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
      </div>



      <div className="search-bar" style={{ justifyContent: 'center' }}>
        <input
          type="text" className="input-field" placeholder="M-001"
          value={memberId} onChange={e => handleMemberIdChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCheckIn()}
          style={{ maxWidth: '300px' }}
          maxLength={5}
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
