const BACKEND_HOST = '192.168.1.93';
const BACKEND_PORT = '8000';

const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}/api/v1`;
const SERVICE_ENDPOINTS = {
    ACCOUNT: `${BACKEND_URL}/account`,
    MANAGER: `${BACKEND_URL}/manager`,
    CATALOG: `${BACKEND_URL}/catalog`,
    CART_ORDER: `${BACKEND_URL}/cart-order`,
};

export default SERVICE_ENDPOINTS;