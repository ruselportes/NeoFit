import { useState, useEffect } from 'react';
import * as api from '../api';
import type { GymSettings } from '../types';

export default function SettingsView() {
  const [form, setForm] = useState<GymSettings>({ gymName: '', contact: '', address: '', announcement: '' });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.fetchSettings()
      .then(setForm)
      .catch(err => {
        console.error(err);
        setError('Failed to load settings.');
      });
  }, []);

  const handleSave = async () => {
    try {
      setError('');
      await api.saveSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      console.error(e);
      setError('Failed to save settings.');
    }
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

      {error && <div className="toast error" style={{marginBottom: '1rem'}}>{error}</div>}

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))' }}>
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
