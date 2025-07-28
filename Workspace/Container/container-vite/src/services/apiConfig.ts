const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST || 'localhost';
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || '8000';

const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}/api/v1`;
const SERVICE_ENDPOINTS = {
    ACCOUNT: `${BACKEND_URL}/account`,
    MANAGER: `${BACKEND_URL}/manager`,
    CATALOG: `${BACKEND_URL}/catalog`,
    CART_ORDER: `${BACKEND_URL}/cart-order`,
};

export default SERVICE_ENDPOINTS;