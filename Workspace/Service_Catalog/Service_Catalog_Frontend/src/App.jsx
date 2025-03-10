import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Product from './Product';
import Collection from './Collection';
import HomePage from './HomePage';
import ProductDetail from './ProductDetail';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:categoryId" element={<Product />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/product/productDetail/:productId" element={<ProductDetail />} />
      </Routes>
    </Router>
  )
}
