import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import { Login, Signup } from './pages/Auth';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Admin from './pages/Admin';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />
              <Route path="*" element={
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                  <h1 style={{ fontSize: '4rem', color: '#1a1a2e' }}>404</h1>
                  <p style={{ color: '#888' }}>Page not found.</p>
                  <a href="/" style={{ color: '#1a1a2e', fontWeight: 600 }}>Go Home</a>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
