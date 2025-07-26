import axiosInstance from './axiosConfig';
import SERVICE_ENDPOINTS from './apiConfig';

const BASE_URL = SERVICE_ENDPOINTS.MANAGER;

// Types and Interfaces
export interface Product {
    id: number;
    name: string;
    code: string;
    description: string;
    quantity: number;
    price: number;
    status: string;
    gender: number;
    material: string;
    goldKarat: number;
    color: string;
    brand: string;
    size: string;
    viewCount: number;
    category?: Category;
    collection?: Collection;
    imageSet?: ProductImage[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductImage {
    id: number;
    imageUrl: string;
    isPrimary: boolean;
    sortOrder: number;
}

export interface Category {
    categoryId: number;
    name: string;
    description?: string;
}

export interface Collection {
    collectionId: number;
    name: string;
    description?: string;
}

export interface ProductCreationRequest {
    name: string;
    code?: string;
    description?: string;
    quantity: number;
    price: number;
    status?: string;
    gender?: number;
    material?: string;
    goldKarat?: number;
    color?: string;
    brand?: string;
    size?: string;
    categoryId?: number;
    collectionId?: number;
    images?: ImageRequest[];
}

export interface ProductUpdateRequest {
    name?: string;
    code?: string;
    description?: string;
    quantity?: number;
    price?: number;
    status?: string;
    gender?: number;
    material?: string;
    goldKarat?: number;
    color?: string;
    brand?: string;
    size?: string;
    categoryId?: number;
    collectionId?: number;
}

export interface ImageRequest {
    imageUrl: string;
    isPrimary?: boolean;
    sortOrder?: number;
}

export interface PaginatedResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
    totalElements: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

const managerService = {
    /**
     * Get all products with pagination, filtering and sorting
     */
    getAllProducts: async (
        keyword?: string,
        column?: string,
        direction?: string,
        page: number = 0,
        size: number = 12
    ): Promise<PaginatedResponse<Product>> => {
        const params = new URLSearchParams();

        if (keyword) params.append('keyword', keyword);
        if (column) params.append('column', column);
        if (direction) params.append('direction', direction);
        params.append('page', page.toString());
        params.append('size', size.toString());

        const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Product>>>(
            `${BASE_URL}/products?${params.toString()}`
        );
        return response.data.data;
    },

    /**
     * Get product by ID
     */
    getProductById: async (id: number): Promise<Product> => {
        const response = await axiosInstance.get<ApiResponse<Product>>(`${BASE_URL}/products/${id}`);
        return response.data.data;
    },

    /**
     * Create a new product
     */
    createProduct: async (product: ProductCreationRequest): Promise<Product> => {
        const response = await axiosInstance.post<ApiResponse<Product>>(`${BASE_URL}/products/add`, product);
        return response.data.data;
    },

    /**
     * Update existing product
     */
    updateProduct: async (id: number, product: ProductUpdateRequest): Promise<Product> => {
        const response = await axiosInstance.put<ApiResponse<Product>>(`${BASE_URL}/products/${id}/update`, product);
        return response.data.data;
    },

    /**
     * Delete a product
     */
    deleteProduct: async (id: number): Promise<void> => {
        await axiosInstance.delete<ApiResponse<null>>(`${BASE_URL}/products/${id}/delete`);
    },

    /**
     * Get out of stock products
     */
    getOutOfStockProducts: async (page: number = 0, size: number = 20): Promise<PaginatedResponse<Product>> => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('size', size.toString());

        const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Product>>>(
            `${BASE_URL}/products/out-of-stock?${params.toString()}`
        );
        return response.data.data;
    },

    /**
     * Get products with stock below threshold
     */
    getLowStockProducts: async (
        threshold: number,
        page: number = 0,
        size: number = 20
    ): Promise<PaginatedResponse<Product>> => {
        const params = new URLSearchParams();
        params.append('threshold', threshold.toString());
        params.append('page', page.toString());
        params.append('size', size.toString());

        const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Product>>>(
            `${BASE_URL}/products/low-stock?${params.toString()}`
        );
        return response.data.data;
    },

    /**
     * Update product stock
     */
    updateProductStock: async (productId: number, newStock: number): Promise<Product> => {
        const params = new URLSearchParams();
        params.append('newStock', newStock.toString());

        const response = await axiosInstance.patch<ApiResponse<Product>>(
            `${BASE_URL}/products/${productId}/update-stock?${params.toString()}`
        );
        return response.data.data;
    },

    /**
     * Import products from CSV file
     */
    importProductsFromCSV: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post<string>(`${BASE_URL}/products/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Add images to a product
     */
    addImagesToProduct: async (productId: number, images: ImageRequest[]): Promise<Product> => {
        const response = await axiosInstance.post<ApiResponse<Product>>(
            `${BASE_URL}/products/${productId}/images/add-images`,
            images
        );
        return response.data.data;
    },

    /**
     * Delete an image from a product
     */
    deleteImageFromProduct: async (productId: number, imageId: number): Promise<void> => {
        await axiosInstance.delete<ApiResponse<null>>(`${BASE_URL}/products/${productId}/images/${imageId}/delete`);
    },

    /**
     * Helper function to get the primary image URL of a product
     */
    getProductPrimaryImageUrl: (product: Product): string => {
        if (!product.imageSet || product.imageSet.length === 0) {
            return 'https://via.placeholder.com/300x300?text=No+Image';
        }

        const primaryImage = product.imageSet.find((img) => img.isPrimary);
        return primaryImage ? primaryImage.imageUrl : product.imageSet[0].imageUrl;
    },

    /**
     * Helper function to format product price
     */
    formatProductPrice: (price: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(price);
    },
};

export default managerService;
