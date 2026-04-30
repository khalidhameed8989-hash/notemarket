import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  // const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setChecking(true); setError('');
    try {
      const res = await api.post('/orders/checkout');
      setSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed. Try again.');
    } finally {
      setChecking(false);
    }
  };

  if (success) return (
    <div style={{ maxWidth: '500px', margin: '5rem auto', padding: '2.5rem', textAlign: 'center', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
      <h2 style={{ color: '#1a1a2e', marginBottom: '0.5rem' }}>Order Placed!</h2>
      <p style={{ color: '#666', marginBottom: '0.5rem' }}>Order #{success.orderId} — Total: ${success.total}</p>
      <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '2rem' }}>Your notes are ready to download from My Orders.</p>
      <Link to="/orders" style={{
        background: '#1a1a2e', color: '#fff', textDecoration: 'none',
        padding: '0.85rem 2rem', borderRadius: '8px', fontWeight: 700,
      }}>View My Orders</Link>
    </div>
  );

  if (cart.items.length === 0) return (
    <div style={{ maxWidth: '500px', margin: '5rem auto', padding: '2.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
      <h2 style={{ color: '#1a1a2e', marginBottom: '0.5rem' }}>Your cart is empty</h2>
      <p style={{ color: '#888', marginBottom: '2rem' }}>Browse our collection and add some notes!</p>
      <Link to="/shop" style={{ background: '#1a1a2e', color: '#fff', textDecoration: 'none', padding: '0.85rem 2rem', borderRadius: '8px', fontWeight: 700 }}>
        Browse Notes
      </Link>
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '2.5rem auto', padding: '0 1.5rem' }}>
      <h1 style={{ color: '#1a1a2e', marginBottom: '2rem', fontWeight: 800 }}>Your Cart ({cart.items.length})</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'flex-start' }}>
        <div>
          {cart.items.map(item => (
            <div key={item.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: '#fff', borderRadius: '12px', padding: '1.25rem',
              marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #eee',
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: '#1a1a2e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>📄</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#1a1a2e' }}>{item.title}</h3>
                  <p style={{ margin: '3px 0 0', color: '#888', fontSize: '0.8rem' }}>{item.subject} • {item.pages} pages</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a1a2e' }}>${parseFloat(item.price).toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1.2rem',
                }}>✕</button>
              </div>
            </div>
          ))}

          <button onClick={clearCart} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '0.85rem', textDecoration: 'underline' }}>
            Clear all items
          </button>
        </div>

        {/* Order Summary */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '1px solid #eee', position: 'sticky', top: '80px' }}>
          <h3 style={{ color: '#1a1a2e', marginBottom: '1.5rem', fontWeight: 700 }}>Order Summary</h3>

          {cart.items.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#555' }}>{item.title.substring(0, 25)}{item.title.length > 25 ? '...' : ''}</span>
              <span style={{ fontWeight: 500 }}>${parseFloat(item.price).toFixed(2)}</span>
            </div>
          ))}

          <div style={{ borderTop: '1px solid #eee', margin: '1rem 0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total</span>
            <span style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1a1a2e' }}>${cart.total}</span>
          </div>

          {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

          <button onClick={handleCheckout} disabled={checking} style={{
            width: '100%', padding: '0.9rem', background: '#1a1a2e', color: '#fff',
            border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
          }}>
            {checking ? 'Processing...' : 'Complete Order →'}
          </button>
          <p style={{ textAlign: 'center', color: '#888', fontSize: '0.8rem', marginTop: '0.75rem' }}>
            🔒 Secure checkout — instant PDF access
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
