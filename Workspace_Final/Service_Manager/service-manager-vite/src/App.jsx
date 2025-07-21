import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AdminLayout from './pages/AdminLayout';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import './App.css';

// Lazy load các trang phụ
// const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<ProductsPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="order/:id" element={<OrderDetailPage />} />
        <Route 
          path="dashboard" 
          element={
            <Suspense fallback={<div className="p-8 text-center">Đang tải...</div>}>
              {/* <Dashboard /> */}
            </Suspense>
          } 
        />
        <Route path="*" element={<ProductsPage />} />
      </Route>
    </Routes>
  );
}

export default App;