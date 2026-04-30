import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/products/featured').then(r => setFeatured(r.data)).catch(() => {});
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const categoryIcons = {
    'Mathematics': '📐', 'Physics': '⚛️', 'Chemistry': '🧪',
    'Biology': '🧬', 'Computer Science': '💻', 'History': '🏛️',
    'Economics': '📊', 'English': '📖',
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: '#fff', padding: '5rem 1.5rem', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <span style={{
            background: 'rgba(226,201,126,0.15)', color: '#e2c97e',
            padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600,
          }}>✦ Premium Study Materials</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, margin: '1.5rem 0 1rem', lineHeight: 1.15 }}>
            Handwritten Notes That<br />
            <span style={{ color: '#e2c97e' }}>Actually Make Sense</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#aab', lineHeight: 1.7, marginBottom: '2rem' }}>
            Browse hundreds of carefully handwritten PDF notes across all subjects.
            Preview before you buy. Download instantly after purchase.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" style={{
              background: '#e2c97e', color: '#1a1a2e', textDecoration: 'none',
              padding: '0.85rem 2rem', borderRadius: '8px', fontWeight: 700, fontSize: '1rem',
            }}>Browse Notes →</Link>
            <Link to="/signup" style={{
              background: 'transparent', color: '#fff', textDecoration: 'none',
              padding: '0.85rem 2rem', borderRadius: '8px', fontWeight: 500, fontSize: '1rem',
              border: '1px solid rgba(255,255,255,0.3)',
            }}>Create Account</Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
            {[['500+', 'Notes Available'], ['10K+', 'Happy Students'], ['4.8★', 'Avg. Rating']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e2c97e' }}>{val}</div>
                <div style={{ fontSize: '0.8rem', color: '#889', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem', color: '#1a1a2e' }}>
            Browse by Subject
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
            {categories.map(cat => (
              <Link key={cat.id} to={`/shop?category=${cat.slug}`} style={{
                textDecoration: 'none', background: '#f8f8f8', borderRadius: '10px',
                padding: '1.25rem 1rem', textAlign: 'center', transition: 'all 0.2s',
                border: '1px solid #eee',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1a1a2e'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f8f8f8'; e.currentTarget.style.color = ''; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{categoryIcons[cat.name] || '📚'}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'inherit' }}>{cat.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '2px' }}>{cat.product_count} notes</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section style={{ padding: '2rem 1.5rem 4rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Featured Notes</h2>
            <Link to="/shop" style={{ color: '#1a1a2e', fontSize: '0.9rem', fontWeight: 500 }}>View all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section style={{ background: '#f9f7f1', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2.5rem', color: '#1a1a2e' }}>
            Why Students Love NoteMarket
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {[
              ['🖊️', 'Handwritten Quality', 'Real pen-to-paper notes with clear diagrams and step-by-step solutions.'],
              ['👁️', 'Preview Before Buy', 'See sample pages before purchasing so you know exactly what you\'re getting.'],
              ['⚡', 'Instant Download', 'Access your PDFs immediately after purchase, no waiting.'],
              ['💯', 'Subject Experts', 'All notes are created by top students and subject matter experts.'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ padding: '1.5rem', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#1a1a2e' }}>{title}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#1a1a2e', color: '#fff', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Ready to Study Smarter?</h2>
        <p style={{ color: '#aab', marginBottom: '2rem' }}>Join thousands of students already using NoteMarket.</p>
        <Link to="/signup" style={{
          background: '#e2c97e', color: '#1a1a2e', textDecoration: 'none',
          padding: '0.85rem 2.5rem', borderRadius: '8px', fontWeight: 700, fontSize: '1.05rem',
        }}>Get Started Free →</Link>
      </section>
    </div>
  );
};

export default Home;
