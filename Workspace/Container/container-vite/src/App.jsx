import {Route, Routes} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import {CartOrderProvider} from './contexts/CartOrderContext';
import Header from './components/Header';
import HeaderManager from './components/HeaderManager';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ErrorBoundary from './components/ErrorBoundary';
import RemoteModuleLayout from './components/RemoteModuleLayout';
import React from 'react';

const AccountApp = React.lazy(() => import('account/App'));
const CatalogApp = React.lazy(() => import('catalog/App'));
const CartOrderApp = React.lazy(() => import('cart_order/App'));
const ManagerApp = React.lazy(() => import('manager/App'));

function App() {
    return (
        <AuthProvider>
            <CartOrderProvider>
                <div className="flex flex-col min-h-screen bg-gray-50">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <>
                                    <Header />
                                    <main className="flex-grow">
                                        <ErrorBoundary>
                                            <HomePage />
                                        </ErrorBoundary>
                                    </main>
                                    <Footer />
                                </>
                            }
                        />

                        <Route
                            path="/account/*"
                            element={
                                <>
                                    <Header />
                                    <main className="flex-grow">
                                        <ErrorBoundary>
                                            <AccountApp />
                                        </ErrorBoundary>
                                    </main>
                                    <Footer />
                                </>
                            }
                        />

                        <Route
                            path="/catalog/*"
                            element={
                                <>
                                    <Header />
                                    <main className="flex-grow">
                                        <ErrorBoundary>
                                            <CatalogApp />
                                        </ErrorBoundary>
                                    </main>
                                    <Footer />
                                </>
                            }
                        />
                        <Route
                            path="/cart/*"
                            element={
                                <>
                                    <Header />
                                    <main className="flex-grow">
                                        <ErrorBoundary>
                                            <CartOrderApp />
                                        </ErrorBoundary>
                                    </main>
                                    <Footer />
                                </>
                            }
                        />
                        <Route
                            path="/manager/*"
                            element={
                                <>
                                    <HeaderManager />
                                    <main className="flex-grow">
                                        <ErrorBoundary>
                                            <ManagerApp />
                                        </ErrorBoundary>
                                    </main>
                                    <Footer />
                                </>
                            }
                        />
                    </Routes>

                </div>
            </CartOrderProvider>
        </AuthProvider>
    );
}

export default App;
