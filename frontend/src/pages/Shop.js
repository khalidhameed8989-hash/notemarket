import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'created_at';
  const page = parseInt(searchParams.get('page')) || 1;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort, page, limit: 9 });
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      const res = await api.get(`/products?${params}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [category, search, sort, page]);

  useEffect(() => {
    fetchProducts();
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {});
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

      {/* Sidebar Filters */}
      <aside style={{ width: '220px', flexShrink: 0 }}>
        <div style={{ position: 'sticky', top: '80px' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1a1a2e', fontWeight: 700 }}>Filters</h3>

          {/* Search */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.5rem' }}>Search</label>
            <input
              type="text"
              placeholder="Search notes..."
              defaultValue={search}
              onKeyDown={e => e.key === 'Enter' && updateParam('search', e.target.value)}
              style={{
                width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px',
                border: '1px solid #ddd', fontSize: '0.9rem', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Categories */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.5rem' }}>Category</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={() => updateParam('category', '')}
                style={{
                  textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: '6px',
                  border: 'none', cursor: 'pointer', fontSize: '0.9rem',
                  background: !category ? '#1a1a2e' : 'transparent',
                  color: !category ? '#fff' : '#444',
                  fontWeight: !category ? 600 : 400,
                }}>All Subjects</button>
              {categories.map(cat => (
                <button key={cat.id}
                  onClick={() => updateParam('category', cat.slug)}
                  style={{
                    textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: '6px',
                    border: 'none', cursor: 'pointer', fontSize: '0.9rem',
                    background: category === cat.slug ? '#1a1a2e' : 'transparent',
                    color: category === cat.slug ? '#fff' : '#444',
                    fontWeight: category === cat.slug ? 600 : 400,
                  }}>{cat.name}
                  <span style={{ color: '#888', fontSize: '0.8rem', marginLeft: '4px' }}>({cat.product_count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.5rem' }}>Sort By</label>
            <select
              value={sort}
              onChange={e => updateParam('sort', e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.9rem' }}
            >
              <option value="created_at">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="rating">Highest Rated</option>
              <option value="download_count">Most Popular</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#1a1a2e', fontWeight: 700 }}>
            {category ? categories.find(c => c.slug === category)?.name || 'Notes' : 'All Notes'}
            {pagination.total !== undefined && (
              <span style={{ color: '#888', fontSize: '0.9rem', fontWeight: 400, marginLeft: '8px' }}>
                ({pagination.total} results)
              </span>
            )}
          </h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>Loading notes...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p>No notes found. Try a different filter.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button key={p}
                    onClick={() => { const n = new URLSearchParams(searchParams); n.set('page', p); setSearchParams(n); }}
                    style={{
                      width: '36px', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                      background: p === page ? '#1a1a2e' : '#f0f0f0',
                      color: p === page ? '#fff' : '#444', fontWeight: p === page ? 700 : 400,
                    }}>{p}</button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Shop;
