import {lazy, Suspense} from 'react';
import {Routes, Route} from 'react-router-dom';
import './App.css';

// Lazy load pages for better performance
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));

const App = () => {
    return (
        <Suspense
            fallback={
                <div className="w-full h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-600"></div>
                </div>
            }
        >
            <Routes>
                <Route path="/" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/confirmation/:orderId" element={<OrderConfirmation />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:orderId" element={<OrderDetail />} />
            </Routes>
        </Suspense>
    );
};

export default App;
