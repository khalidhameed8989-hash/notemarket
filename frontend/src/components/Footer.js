import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{
    background: '#1a1a2e', color: '#aaa', padding: '2.5rem 1.5rem 1.5rem',
    marginTop: 'auto',
  }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
      <div>
        <h3 style={{ color: '#e2c97e', marginBottom: '0.75rem', fontSize: '1.1rem' }}>📝 NoteMarket</h3>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>Quality handwritten educational notes for students worldwide.</p>
      </div>
      <div>
        <h4 style={{ color: '#ddd', marginBottom: '0.75rem' }}>Shop</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/shop" style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.9rem' }}>All Notes</Link>
          <Link to="/shop?category=mathematics" style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.9rem' }}>Mathematics</Link>
          <Link to="/shop?category=physics" style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.9rem' }}>Physics</Link>
          <Link to="/shop?category=computer-science" style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.9rem' }}>Computer Science</Link>
        </div>
      </div>
      <div>
        <h4 style={{ color: '#ddd', marginBottom: '0.75rem' }}>Account</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/login" style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.9rem' }}>Login</Link>
          <Link to="/signup" style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.9rem' }}>Sign Up</Link>
          <Link to="/orders" style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.9rem' }}>My Orders</Link>
        </div>
      </div>
    </div>
    <div style={{ borderTop: '1px solid #333', paddingTop: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>
      © {new Date().getFullYear()} NoteMarket. All rights reserved.
    </div>
  </footer>
);

export default Footer;
