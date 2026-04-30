import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const formStyle = {
  maxWidth: '420px', margin: '5rem auto', padding: '2.5rem',
  background: '#fff', borderRadius: '16px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.1)', border: '1px solid #eee',
};

const inputStyle = {
  width: '100%', padding: '0.75rem', borderRadius: '8px',
  border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box',
  marginBottom: '1rem', outline: 'none',
};

const btnStyle = {
  width: '100%', padding: '0.85rem', borderRadius: '8px', border: 'none',
  background: '#1a1a2e', color: '#fff', fontSize: '1rem',
  fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem',
};

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={formStyle}>
        <h1 style={{ textAlign: 'center', color: '#1a1a2e', marginBottom: '0.25rem', fontSize: '1.75rem' }}>Welcome Back</h1>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: '2rem', fontSize: '0.9rem' }}>Sign in to your NoteMarket account</p>

        {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.35rem' }}>Email</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" style={inputStyle} />

          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.35rem' }}>Password</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="••••••••" style={inputStyle} />

          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
          No account? <Link to="/signup" style={{ color: '#1a1a2e', fontWeight: 600 }}>Sign up free</Link>
        </p>
      </div>
    </div>
  );
};

export const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={formStyle}>
        <h1 style={{ textAlign: 'center', color: '#1a1a2e', marginBottom: '0.25rem', fontSize: '1.75rem' }}>Create Account</h1>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: '2rem', fontSize: '0.9rem' }}>Join NoteMarket today — it's free</p>

        {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.35rem' }}>Full Name</label>
          <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Your name" style={inputStyle} />

          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.35rem' }}>Email</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" style={inputStyle} />

          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.35rem' }}>Password</label>
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="Min. 6 characters" style={inputStyle} />

          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.35rem' }}>Confirm Password</label>
          <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required placeholder="Repeat password" style={inputStyle} />

          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#1a1a2e', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};
