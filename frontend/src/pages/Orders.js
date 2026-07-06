import React, { useEffect, useState } from 'react';
import api from '../api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading orders...</div>;

  if (orders.length === 0) return (
    <div style={{ maxWidth: '500px', margin: '5rem auto', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
      <h2>No orders yet</h2>
      <p style={{ color: '#888' }}>Your purchases will appear here after checkout.</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '2.5rem auto', padding: '0 1.5rem' }}>
      <h1 style={{ color: '#1a1a2e', marginBottom: '2rem', fontWeight: 800 }}>My Orders</h1>

      {orders.map(order => {
        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        return (
          <div key={order.id} style={{
            background: '#fff', borderRadius: '12px', padding: '1.5rem',
            marginBottom: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #eee',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1a1a2e', fontSize: '1rem' }}>Order #{order.id}</h3>
                <p style={{ margin: '4px 0 0', color: '#888', fontSize: '0.85rem' }}>
                  {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  background: order.status === 'completed' ? '#dcfce7' : '#fee2e2',
                  color: order.status === 'completed' ? '#16a34a' : '#dc2626',
                  padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
                }}>{order.status}</span>
                <p style={{ margin: '6px 0 0', fontWeight: 700, fontSize: '1.1rem', color: '#1a1a2e' }}>
                  Rs {parseFloat(order.total).toFixed(2)}
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
              {items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#444', fontSize: '0.9rem' }}>📄 {item.title}</span>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ color: '#666', fontSize: '0.85rem' }}>Rs {parseFloat(item.price).toFixed(2)}</span>
                    {order.status === 'completed' && (
                      <a
                        href={`/api/orders/${order.id}/download/${item.product_id}`}
                        style={{
                          background: '#1a1a2e', color: '#fff', textDecoration: 'none',
                          padding: '0.3rem 0.75rem', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 600,
                        }}>
                        ⬇️ Download
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Orders;
