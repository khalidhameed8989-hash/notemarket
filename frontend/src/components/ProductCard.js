import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StarRating = ({ rating }) => {
  return (
    <span style={{ color: '#e2c97e', fontSize: '0.85rem' }}>
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
      <span style={{ color: '#888', marginLeft: '4px' }}>({rating.toFixed(1)})</span>
    </span>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const inCart = cart.items.some(i => i.id === product.id);

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    if (!inCart) await addToCart(product.id);
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      display: 'flex',
      flexDirection: 'column',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.14)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.08)'; }}
    >
      {/* Thumbnail placeholder */}
      <div style={{
        height: '160px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <span style={{ fontSize: '3rem' }}>📄</span>
        {product.is_featured && (
          <span style={{
            position: 'absolute', top: '12px', left: '12px',
            background: '#e2c97e', color: '#1a1a2e',
            fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px',
            borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>Featured</span>
        )}
        <span style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'rgba(255,255,255,0.15)', color: '#fff',
          fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px',
        }}>{product.pages} pages</span>
      </div>

      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <span style={{
          background: '#f0f0f0', color: '#555', fontSize: '0.75rem',
          padding: '2px 8px', borderRadius: '20px', alignSelf: 'flex-start',
        }}>{product.category_name || product.subject}</span>

        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#1a1a2e', lineHeight: 1.3 }}>
          {product.title}
        </h3>

        <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', lineHeight: 1.5, flex: 1 }}>
          {product.description?.substring(0, 80)}...
        </p>

        {product.rating > 0 && <StarRating rating={parseFloat(product.rating)} />}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1a2e' }}>
            ${parseFloat(product.price).toFixed(2)}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/product/${product.id}`} style={{
              background: 'transparent', border: '1px solid #1a1a2e', color: '#1a1a2e',
              padding: '0.4rem 0.75rem', borderRadius: '6px', textDecoration: 'none',
              fontSize: '0.8rem', fontWeight: 500,
            }}>Preview</Link>
            <button onClick={handleAddToCart} style={{
              background: inCart ? '#22c55e' : '#1a1a2e', color: '#fff',
              border: 'none', padding: '0.4rem 0.75rem', borderRadius: '6px',
              cursor: inCart ? 'default' : 'pointer', fontSize: '0.8rem', fontWeight: 500,
            }}>
              {inCart ? '✓ Added' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
