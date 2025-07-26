import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import Cart from "./screens/Cart";
import Order from "./screens/Order";
import Checkout from "./screens/Checkout";
import OrderList from "./screens/OrderList";
import AdminOrders from "./screens/AdminOrders";
import Header from "./components/Header";

// Admin layout component
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="admin-layout bg-gray-100 min-h-screen">
      <div className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="mt-2">
          <Link to="/admin/orders" className="text-white hover:text-gray-300 mr-4">Quản lý đơn hàng</Link>
          <Link to="/" className="text-white hover:text-gray-300">Về trang chủ</Link>
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

// User layout component
const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="p-4">
      <Header/>
      <nav className="mb-4">
        <Link to="/cart" className="mr-4 text-blue-500">Giỏ hàng</Link>
        <Link to="/order-list" className="text-blue-500 mr-4">Danh sách đơn hàng</Link>

      </nav>
      {children}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin" element={<Navigate to="/admin/orders" replace />} />
        <Route 
          path="/admin/orders" 
          element={
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          } 
        />
        
        {/* User routes */}
        <Route 
          path="/cart" 
          element={
            <UserLayout>
              <Cart />
            </UserLayout>
          } 
        />
        <Route 
          path="/order" 
          element={
            <UserLayout>
              <Order />
            </UserLayout>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <UserLayout>
              <Checkout />
            </UserLayout>
          } 
        />
        <Route 
          path="/order-list" 
          element={
            <UserLayout>
              <OrderList />
            </UserLayout>
          } 
        />
        <Route path="/" element={<Navigate to="/cart" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
