import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Product from './Product';
import Collection from './Collection';
import HomePage from './HomePage';
import ProductDetail from './ProductDetail';
import CollectionDetail from './CollectionDetail.jsx';
import AccountPage from './AccountPage.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:categoryId" element={<Product />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/product/productDetail/:productId" element={<ProductDetail />} />
        <Route path="/collection/:collectionId" element={<CollectionDetail />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </Router>
  )
}
