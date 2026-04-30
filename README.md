# 📝 NoteMarket — Handwritten PDF Notes Marketplace

A full-stack e-commerce platform for buying and selling handwritten PDF educational notes.

---

## 🏗️ Project Structure

```
project/
├── frontend/          # React 18 app
│   └── src/
│       ├── components/    # Navbar, Footer, ProductCard, ProtectedRoute
│       ├── context/       # AuthContext, CartContext
│       ├── pages/         # Home, Shop, ProductDetail, Auth, Cart, Orders
│       ├── api.js         # Axios instance with JWT interceptors
│       ├── App.js
│       └── index.js
└── backend/           # Express + MySQL API
    ├── config/        # db.js, schema.sql
    ├── controllers/   # auth, product, cart, order, category
    ├── middleware/    # auth.js (JWT + admin)
    ├── routes/        # auth, products, categories, cart, orders
    └── app.js
```

---

## 🚀 Quick Start

### 1. Database Setup

```bash
mysql -u root -p < backend/config/schema.sql
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your DB credentials and JWT secret
npm install
npm run dev
# Runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint         | Access  | Description         |
|--------|-----------------|---------|---------------------|
| POST   | /api/auth/signup | Public  | Register new user   |
| POST   | /api/auth/login  | Public  | Login, get JWT token |
| GET    | /api/auth/me     | Auth    | Get current user    |

### Products
| Method | Endpoint              | Access  | Description              |
|--------|-----------------------|---------|--------------------------|
| GET    | /api/products         | Public  | List with filters/search |
| GET    | /api/products/featured| Public  | Featured products        |
| GET    | /api/products/:id     | Public  | Product + reviews        |
| POST   | /api/products         | Admin   | Create product + PDF     |
| PUT    | /api/products/:id     | Admin   | Update product           |
| DELETE | /api/products/:id     | Admin   | Delete product           |

### Categories
| Method | Endpoint          | Access | Description             |
|--------|------------------|--------|-------------------------|
| GET    | /api/categories   | Public | All categories + counts |

### Cart
| Method | Endpoint          | Access | Description          |
|--------|------------------|--------|----------------------|
| GET    | /api/cart         | Auth   | Get user's cart      |
| POST   | /api/cart         | Auth   | Add item to cart     |
| DELETE | /api/cart/:id     | Auth   | Remove item          |
| DELETE | /api/cart/clear   | Auth   | Clear entire cart    |

### Orders
| Method | Endpoint                            | Access | Description            |
|--------|-------------------------------------|--------|------------------------|
| POST   | /api/orders/checkout                | Auth   | Place order from cart  |
| GET    | /api/orders                         | Auth   | My order history       |
| GET    | /api/orders/:id/download/:productId | Auth   | Download purchased PDF |

---

## ✨ Improvements Over Original

| Feature                    | Original | Improved |
|---------------------------|----------|----------|
| React version             | 17       | 18       |
| React Router              | v5       | v6       |
| Database connection       | Single   | Pool     |
| Password hashing          | ✔ Basic  | ✔ bcrypt 12 rounds |
| Input validation          | ✗        | ✔ express-validator |
| Auth middleware           | ✗        | ✔ JWT + Admin role |
| Admin protection          | ✗        | ✔ Role-based        |
| Cart system               | ✗        | ✔ Full cart CRUD    |
| Order system              | ✗        | ✔ Transactions      |
| PDF download protection   | ✗        | ✔ Purchase-gated    |
| Categories with counts    | ✗        | ✔ With product count|
| Search & filters          | ✗        | ✔ Full filter/sort  |
| Pagination                | ✗        | ✔ Server-side       |
| Error handling            | Basic    | Global error handler|
| Global auth state         | ✗        | ✔ Context API       |
| Global cart state         | ✗        | ✔ Context API       |
| Protected routes          | ✗        | ✔ ProtectedRoute    |
| Database schema           | ✗        | ✔ Full schema.sql   |
| CORS config               | Basic    | ✔ Origin-controlled |
| File uploads              | ✗        | ✔ Multer PDF upload |

---

## 🔐 Environment Variables

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=yourpassword
DB_NAME=notes_marketplace
JWT_SECRET=change_this_in_production
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=10485760
```

---

## 📦 Tech Stack

**Frontend:** React 18, React Router v6, Axios, Context API  
**Backend:** Node.js, Express 4, MySQL2 (promise pool), JWT, bcryptjs, Multer  
**Database:** MySQL 8+
