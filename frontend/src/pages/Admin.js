import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const tabs = ['Dashboard', 'Products', 'Add Note', 'Users', 'Orders'];

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', price: '', subject: '', pages: '', category_id: '', is_featured: false });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/');
  }, [user, navigate]);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, usersRes, ordersRes, statsRes] = await Promise.all([
        api.get('/products?limit=100'),
        api.get('/categories'),
        api.get('/admin/users'),
        api.get('/admin/orders'),
        api.get('/admin/stats'),
      ]);
      setProducts(productsRes.data.products || []);
      setCategories(categoriesRes.data || []);
      setUsers(usersRes.data || []);
      setOrders(ordersRes.data || []);
      setStats(statsRes.data || {});
    } catch (err) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/products', form);
      setMessage('✅ Product added successfully!');
      setForm({ title: '', description: '', price: '', subject: '', pages: '', category_id: '', is_featured: false });
      fetchAll();
    } catch (err) {
      setMessage('❌ Failed to add product.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${editProduct.id}`, editProduct);
      setMessage('✅ Product updated!');
      setEditProduct(null);
      fetchAll();
    } catch (err) {
      setMessage('❌ Failed to update product.');
    }
  };

  const sidebarStyle = { width: '220px', background: '#1a1a2e', minHeight: '100vh', padding: '2rem 0', flexShrink: 0 };
  const tabStyle = (tab) => ({
    display: 'block', width: '100%', padding: '0.85rem 1.5rem',
    background: activeTab === tab ? 'rgba(226,201,126,0.15)' : 'transparent',
    color: activeTab === tab ? '#e2c97e' : '#aaa',
    border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.95rem',
    fontWeight: activeTab === tab ? 600 : 400,
    borderLeft: activeTab === tab ? '3px solid #e2c97e' : '3px solid transparent',
  });
  const inputStyle = { width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', boxSizing: 'border-box', marginBottom: '1rem' };
  const tableHeader = { padding: '1rem', textAlign: 'left', fontSize: '0.85rem', color: '#555', fontWeight: 600 };
  const tableCell = { padding: '0.75rem 1rem', fontSize: '0.9rem' };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading admin panel...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
      <aside style={sidebarStyle}>
        <div style={{ padding: '0 1.5rem 2rem', borderBottom: '1px solid #333' }}>
          <h2 style={{ color: '#e2c97e', fontSize: '1.1rem', margin: 0 }}>⚙️ Admin Panel</h2>
          <p style={{ color: '#888', fontSize: '0.8rem', margin: '4px 0 0' }}>{user?.email}</p>
        </div>
        <nav style={{ marginTop: '1rem' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setMessage(''); }} style={tabStyle(tab)}>
              {tab === 'Dashboard' ? '📊' : tab === 'Products' ? '📝' : tab === 'Add Note' ? '➕' : tab === 'Users' ? '👥' : '📦'} {tab}
            </button>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '2rem' }}>

        {activeTab === 'Dashboard' && (
          <div>
            <h1 style={{ color: '#1a1a2e', marginBottom: '2rem', fontWeight: 800 }}>Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {[
                ['👥', 'Total Users', stats.totalUsers || 0],
                ['📝', 'Total Notes', stats.totalProducts || 0],
                ['📦', 'Total Orders', stats.totalOrders || 0],
                ['💰', 'Total Revenue', `$${parseFloat(stats.totalRevenue || 0).toFixed(2)}`],
              ].map(([icon, label, value]) => (
                <div key={label} style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a1a2e' }}>{value}</div>
                  <div style={{ color: '#888', fontSize: '0.85rem' }}>{label}</div>
                </div>
              ))}
            </div>
            <h2 style={{ color: '#1a1a2e', marginBottom: '1rem', fontWeight: 700 }}>Recent Orders</h2>
            <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              {orders.length === 0 ? <p style={{ padding: '2rem', color: '#888', textAlign: 'center' }}>No orders yet.</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#f8f8f8' }}>
                    {['Order ID', 'Customer', 'Email', 'Total', 'Status', 'Date'].map(h => <th key={h} style={tableHeader}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                        <td style={tableCell}>#{o.id}</td>
                        <td style={tableCell}>{o.name}</td>
                        <td style={tableCell}>{o.email}</td>
                        <td style={tableCell}>${parseFloat(o.total).toFixed(2)}</td>
                        <td style={tableCell}><span style={{ background: o.status === 'completed' ? '#dcfce7' : '#fee2e2', color: o.status === 'completed' ? '#16a34a' : '#dc2626', padding: '3px 8px', borderRadius: '20px', fontSize: '0.8rem' }}>{o.status}</span></td>
                        <td style={{ ...tableCell, color: '#888', fontSize: '0.8rem' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Products' && (
          <div>
            <h1 style={{ color: '#1a1a2e', marginBottom: '2rem', fontWeight: 800 }}>All Products ({products.length})</h1>
            {editProduct && (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>Edit Product</h3>
                <form onSubmit={handleUpdateProduct}>
                  <input value={editProduct.title} onChange={e => setEditProduct({ ...editProduct, title: e.target.value })} placeholder="Title" style={inputStyle} />
                  <textarea value={editProduct.description} onChange={e => setEditProduct({ ...editProduct, description: e.target.value })} placeholder="Description" style={{ ...inputStyle, height: '80px' }} />
                  <input type="number" value={editProduct.price} onChange={e => setEditProduct({ ...editProduct, price: e.target.value })} placeholder="Price" style={inputStyle} />
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" style={{ background: '#1a1a2e', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Save</button>
                    <button type="button" onClick={() => setEditProduct(null)} style={{ background: '#eee', color: '#333', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
            {message && <div style={{ background: message.includes('✅') ? '#dcfce7' : '#fee2e2', color: message.includes('✅') ? '#16a34a' : '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>{message}</div>}
            <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f8f8f8' }}>
                  {['ID', 'Title', 'Price', 'Subject', 'Pages', 'Actions'].map(h => <th key={h} style={tableHeader}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                      <td style={{ ...tableCell, color: '#888' }}>#{p.id}</td>
                      <td style={{ ...tableCell, fontWeight: 500 }}>{p.title}</td>
                      <td style={tableCell}>${parseFloat(p.price).toFixed(2)}</td>
                      <td style={tableCell}>{p.subject}</td>
                      <td style={tableCell}>{p.pages}</td>
                      <td style={tableCell}>
                        <button onClick={() => setEditProduct(p)} style={{ background: '#e2c97e', color: '#1a1a2e', border: 'none', padding: '0.4rem 0.75rem', borderRadius: '6px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>Edit</button>
                        <button onClick={() => handleDeleteProduct(p.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.4rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Add Note' && (
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ color: '#1a1a2e', marginBottom: '2rem', fontWeight: 800 }}>Add New Note</h1>
            {message && <div style={{ background: message.includes('✅') ? '#dcfce7' : '#fee2e2', color: message.includes('✅') ? '#16a34a' : '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>{message}</div>}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <form onSubmit={handleAddProduct}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.35rem' }}>Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Calculus Complete Notes" style={inputStyle} />
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.35rem' }}>Description *</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required placeholder="Describe the notes..." style={{ ...inputStyle, height: '100px', resize: 'vertical' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.35rem' }}>Price ($) *</label>
                    <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required placeholder="9.99" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.35rem' }}>Pages</label>
                    <input type="number" value={form.pages} onChange={e => setForm({ ...form, pages: e.target.value })} placeholder="80" style={inputStyle} />
                  </div>
                </div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.35rem' }}>Subject</label>
                <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Mathematics" style={inputStyle} />
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.35rem' }}>Category</label>
                <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} style={inputStyle}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} />
                  <span style={{ fontSize: '0.9rem', color: '#555' }}>Mark as Featured</span>
                </label>
                <button type="submit" style={{ width: '100%', padding: '0.9rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
                  ➕ Add Note
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'Users' && (
          <div>
            <h1 style={{ color: '#1a1a2e', marginBottom: '2rem', fontWeight: 800 }}>Users ({users.length})</h1>
            <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              {users.length === 0 ? <p style={{ padding: '2rem', color: '#888', textAlign: 'center' }}>No users found.</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#f8f8f8' }}>
                    {['ID', 'Name', 'Email', 'Role', 'Joined'].map(h => <th key={h} style={tableHeader}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                        <td style={{ ...tableCell, color: '#888' }}>#{u.id}</td>
                        <td style={{ ...tableCell, fontWeight: 500 }}>{u.name}</td>
                        <td style={tableCell}>{u.email}</td>
                        <td style={tableCell}>
                          <span style={{ background: u.role === 'admin' ? '#fef3c7' : '#f0f0f0', color: u.role === 'admin' ? '#d97706' : '#555', padding: '3px 8px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>{u.role}</span>
                        </td>
                        <td style={{ ...tableCell, color: '#888', fontSize: '0.8rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Orders' && (
          <div>
            <h1 style={{ color: '#1a1a2e', marginBottom: '2rem', fontWeight: 800 }}>All Orders ({orders.length})</h1>
            <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              {orders.length === 0 ? <p style={{ padding: '2rem', color: '#888', textAlign: 'center' }}>No orders yet.</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#f8f8f8' }}>
                    {['Order ID', 'Customer', 'Email', 'Total', 'Status', 'Date'].map(h => <th key={h} style={tableHeader}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                        <td style={{ ...tableCell, color: '#888' }}>#{o.id}</td>
                        <td style={{ ...tableCell, fontWeight: 500 }}>{o.name}</td>
                        <td style={tableCell}>{o.email}</td>
                        <td style={{ ...tableCell, fontWeight: 600 }}>${parseFloat(o.total).toFixed(2)}</td>
                        <td style={tableCell}><span style={{ background: o.status === 'completed' ? '#dcfce7' : '#fee2e2', color: o.status === 'completed' ? '#16a34a' : '#dc2626', padding: '3px 8px', borderRadius: '20px', fontSize: '0.8rem' }}>{o.status}</span></td>
                        <td style={{ ...tableCell, color: '#888', fontSize: '0.8rem' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Admin;
