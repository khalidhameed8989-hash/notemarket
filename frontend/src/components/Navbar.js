import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: '#1a1a2e',
      color: '#fff',
      padding: '0 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
    }}>
      <Link to="/" style={{ color: '#e2c97e', textDecoration: 'none', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.5px' }}>
        📝 NoteMarket
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/shop" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.95rem' }}>Shop</Link>

        {user ? (
          <>
            <Link to="/cart" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.95rem', position: 'relative' }}>
              🛒 Cart
              {cartCount > 0 && (
                <span style={{
                  background: '#e2c97e', color: '#1a1a2e', borderRadius: '50%',
                  width: '18px', height: '18px', fontSize: '0.7rem', fontWeight: 700,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  position: 'absolute', top: '-8px', right: '-10px',
                }}>{cartCount}</span>
              )}
            </Link>
            <Link to="/orders" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.95rem' }}>My Orders</Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: '#e2c97e', textDecoration: 'none', fontSize: '0.95rem' }}>Admin</Link>
            )}
            <button onClick={handleLogout} style={{
              background: 'transparent', border: '1px solid #555', color: '#ccc',
              padding: '0.4rem 0.9rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem',
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.95rem' }}>Login</Link>
            <Link to="/signup" style={{
              background: '#e2c97e', color: '#1a1a2e', textDecoration: 'none',
              padding: '0.4rem 1rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.9rem',
            }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
