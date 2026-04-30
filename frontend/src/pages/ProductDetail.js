import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
  if (!product) return null;

  const inCart = cart.items.some(i => i.id === product.id);

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    await addToCart(product.id);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '2.5rem auto', padding: '0 1.5rem' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        ← Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>
        {/* Left: Info */}
        <div>
          <span style={{ background: '#f0f0f0', color: '#555', fontSize: '0.8rem', padding: '3px 10px', borderRadius: '20px' }}>
            {product.category_name}
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a2e', margin: '1rem 0 0.75rem', lineHeight: 1.2 }}>
            {product.title}
          </h1>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
            <span>📄 {product.pages} pages</span>
            <span>📚 {product.subject}</span>
            {product.download_count > 0 && <span>⬇️ {product.download_count} downloads</span>}
          </div>

          <p style={{ color: '#444', lineHeight: 1.8, fontSize: '1rem', marginBottom: '2rem' }}>
            {product.description}
          </p>

          {/* Reviews */}
          {product.reviews && product.reviews.length > 0 && (
            <div>
              <h3 style={{ color: '#1a1a2e', marginBottom: '1rem' }}>Student Reviews</h3>
              {product.reviews.map(r => (
                <div key={r.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <strong style={{ fontSize: '0.9rem' }}>{r.user_name}</strong>
                    <span style={{ color: '#e2c97e' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Purchase Card */}
        <div style={{
          background: '#fff', borderRadius: '16px', padding: '2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)', position: 'sticky', top: '80px',
          border: '1px solid #eee',
        }}>
          {/* Preview box */}
          <div style={{
            height: '200px', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1.5rem', fontSize: '4rem',
          }}>📄</div>

          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1a2e', marginBottom: '0.25rem' }}>
            ${parseFloat(product.price).toFixed(2)}
          </div>
          <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>One-time purchase • Instant PDF download</p>

          <button
            onClick={handleAddToCart}
            disabled={inCart}
            style={{
              width: '100%', padding: '0.9rem', borderRadius: '8px', border: 'none',
              background: inCart ? '#22c55e' : '#1a1a2e', color: '#fff',
              fontSize: '1rem', fontWeight: 700, cursor: inCart ? 'default' : 'pointer',
              marginBottom: '0.75rem',
            }}>
            {inCart ? '✓ Added to Cart' : 'Add to Cart'}
          </button>

          {inCart && (
            <button onClick={() => navigate('/cart')} style={{
              width: '100%', padding: '0.9rem', borderRadius: '8px',
              border: '2px solid #1a1a2e', background: 'transparent',
              color: '#1a1a2e', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
            }}>Go to Cart →</button>
          )}

          <div style={{ borderTop: '1px solid #eee', marginTop: '1.5rem', paddingTop: '1rem' }}>
            {['✔ Handwritten quality notes', '✔ Instant PDF download', '✔ Mobile & desktop friendly', '✔ Print-ready format'].map(f => (
              <p key={f} style={{ margin: '0.4rem 0', fontSize: '0.85rem', color: '#555' }}>{f}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
