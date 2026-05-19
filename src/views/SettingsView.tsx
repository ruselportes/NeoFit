import { useState } from 'react';

export default function SettingsView() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-title">
          <h2>Gym Settings</h2>
          <p>System configuration and administration control panel.</p>
        </div>
      </header>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        background: 'var(--bg-card)',
        borderRadius: 'var(--card-radius)',
        border: '1px solid var(--glass-border)',
        textAlign: 'center',
        maxWidth: '700px',
        margin: '2rem auto 0 auto',
        boxShadow: 'var(--card-shadow)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative ambient glow */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '200px',
          background: 'var(--accent-glow)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          pointerEvents: 'none',
          opacity: 0.5
        }} />

        <div style={{
          background: 'rgba(255, 87, 34, 0.1)',
          border: '1px solid rgba(255, 87, 34, 0.2)',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          color: 'var(--accent)',
          fontSize: '2.5rem',
          animation: 'pulse 2s infinite'
        }}>
          ⚙️
        </div>

        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontWeight: 700 }}>Settings Module Coming Soon</h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '480px', lineHeight: 1.6, marginBottom: '2rem', fontSize: '0.95rem' }}>
          We are building a robust management console. Soon, you will be able to customize gym details, configure automatic database backups, manage staff roles, and set up custom check-in rules.
        </p>

        {/* Features Timeline/List */}
        <div style={{
          width: '100%',
          maxWidth: '400px',
          textAlign: 'left',
          background: 'var(--bg-secondary)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)',
          marginBottom: '2rem'
        }}>
          <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent)', marginBottom: '1rem', fontWeight: 600 }}>Planned Features</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--success)' }}>✓</span> Gym Profile & Signage (Announcement)
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
              <span style={{ color: 'var(--accent)' }}>●</span> Multi-Staff Role Access (RBAC) - <em>In Progress</em>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', opacity: 0.6 }}>
              <span style={{ color: 'var(--text-muted)' }}>○</span> Database Backup & Restore - <em>Scheduled</em>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', opacity: 0.6 }}>
              <span style={{ color: 'var(--text-muted)' }}>○</span> Fingerprint Scanner Config - <em>Scheduled</em>
            </li>
          </ul>
        </div>

        {/* Notify Form */}
        {subscribed ? (
          <div style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🎉 You have been subscribed for launch updates!
          </div>
        ) : (
          <form onSubmit={handleNotify} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '400px' }}>
            <input 
              type="email" 
              placeholder="Enter email for notifications" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field" 
              style={{ margin: 0 }}
            />
            <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>Notify Me</button>
          </form>
        )}
      </div>
    </>
  );
}
