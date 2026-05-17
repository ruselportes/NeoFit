import { useState, useEffect, useCallback } from 'react';
import * as api from '../api';
import type { Member } from '../types';

export default function MembersView({ role, showNotification }: { role: string | null, showNotification: (message: string, type?: 'success' | 'error') => void }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form, setForm] = useState({ name: '', contact: '', plan: 'Monthly', joined_date: '', expiry_date: '' });
  const [error, setError] = useState('');

  const loadMembers = useCallback(() => {
    setError('');
    api.fetchMembers(search, statusFilter)
      .then(setMembers)
      .catch(err => {
        console.error(err);
        setError('Failed to load members.');
      });
  }, [search, statusFilter]);

  useEffect(() => { loadMembers(); }, [loadMembers]);

  const calcExpiry = (plan: string, joinedDate: string): string => {
    if (!joinedDate) return '';
    const d = new Date(joinedDate);
    if (plan.includes('Monthly') && !plan.includes('Semi')) {
      d.setMonth(d.getMonth() + 1);
    } else if (plan.includes('Semi-Monthly')) {
      d.setDate(d.getDate() + 15);
    } else if (plan.includes('Daily')) {
      d.setDate(d.getDate() + 1);
    }
    return d.toISOString().split('T')[0];
  };

  const defaultPlan = 'Regular Monthly (No Treadmill)';

  const openAdd = () => {
    setEditingMember(null);
    const today = new Date().toISOString().split('T')[0];
    setForm({ name: '', contact: '09', plan: defaultPlan, joined_date: today, expiry_date: calcExpiry(defaultPlan, today) });
    setError('');
    setShowModal(true);
  };

  const openEdit = (m: Member) => {
    setEditingMember(m);
    setForm({
      name: m.name, contact: m.contact, plan: m.plan,
      joined_date: m.joined_date?.split('T')[0] || '',
      expiry_date: m.expiry_date?.split('T')[0] || '',
    });
    setError('');
    setShowModal(true);
  };

  const handleContactChange = (value: string) => {
    // Only allow digits
    const digits = value.replace(/\D/g, '');
    // Ensure it starts with 09 and max 11 digits
    if (digits.length <= 2) {
      setForm({ ...form, contact: '09' });
    } else if (digits.startsWith('09')) {
      setForm({ ...form, contact: digits.slice(0, 11) });
    } else {
      setForm({ ...form, contact: '09' + digits.slice(0, 9) });
    }
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
      showNotification(editingMember ? 'Member updated successfully!' : 'Member added successfully!');
    } catch (e: any) { setError(e.message || 'Failed to save member.'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      await api.deleteMember(id);
      loadMembers();
      showNotification('Member deleted successfully!');
    } catch (e: any) {
      setError(e.message || 'Failed to delete member.');
    }
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

      {error && <div className="toast error" style={{marginBottom: '1rem'}}>{error}</div>}

      <div className="table-container">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Contact</th><th>Plan</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.member_id}</td>
                <td><strong>{m.name}</strong></td>
                <td>{m.contact}</td>
                <td>{m.plan}</td>
                <td><span className={`badge ${m.status.replace(' ','-').toLowerCase()}`}>{m.status}</span></td>
                <td>
                  <button className="btn-text" onClick={() => openEdit(m)}>Edit</button>
                  {role === 'admin' && (
                    <button className="btn-text" style={{color:'var(--danger)',marginLeft:'0.5rem'}} onClick={() => handleDelete(m.id)}>Delete</button>
                  )}
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
            <div className="form-group"><label>Contact</label><input type="tel" className="input-field" placeholder="09XXXXXXXXX" value={form.contact} onChange={e => handleContactChange(e.target.value)} maxLength={11} /></div>
            <div className="form-group"><label>Plan</label>
              <select className="input-field" value={form.plan} onChange={e => {
                const newPlan = e.target.value;
                setForm({ ...form, plan: newPlan, expiry_date: calcExpiry(newPlan, form.joined_date) });
              }}>
                <option>Regular Monthly (No Treadmill)</option>
                <option>Regular Monthly (With Treadmill)</option>
                <option>Student/Senior Monthly (No Treadmill)</option>
                <option>Student/Senior Monthly (With Treadmill)</option>
                <option>Regular Semi-Monthly</option>
                <option>Regular Daily</option>
              </select>
            </div>
            <div className="form-group"><label>Joined Date</label><input type="date" className="input-field" value={form.joined_date} onChange={e => {
              const newDate = e.target.value;
              setForm({ ...form, joined_date: newDate, expiry_date: calcExpiry(form.plan, newDate) });
            }} /></div>
            <div className="form-group"><label>Expiry Date</label><input type="date" className="input-field" value={form.expiry_date} readOnly style={{ opacity: 0.7, cursor: 'not-allowed' }} /></div>
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
