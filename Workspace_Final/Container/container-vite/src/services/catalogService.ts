import axiosInstance from './axiosConfig';
import SERVICE_ENDPOINTS from './apiConfig';

const BASE_URL = SERVICE_ENDPOINTS.CATALOG;

// Các interfaces cho response data
interface Category {
    id: number;
    name: string;
    description: string;
    url: string;
    productIds: number[];
}

interface Collection {
    id: number;
    name: string;
    description: string;
    collectionImages: CollectionImage[];
    productIds: number[];
}

interface CollectionImage {
    id: number;
    imageUrl: string;
    isPrimary: boolean;
    sortOrder: number;
}

interface ProductImage {
    id: number;
    imageUrl: string;
    isPrimary: boolean;
    sortOrder: number;
}

interface ProductVariant {
    id: number;
    productId: number;
    size: string;
    color: string;
    material: string;
    goldKarat: number;
    quantity: number;
    price: number;
    imageUrl?: string;
}

interface ProductFeature {
    id: number;
    productId: number;
    name: string;
    value: string;
}

interface ProductReview {
    id: number;
    productId: number;
    userId: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
}

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
    createdAt: string;
    updatedAt: string;
    categoryId: number;
    categoryName: string;
    collectionId: number;
    collectionName: string;
    productImages: ProductImage[];
}

// Service methods
const catalogService = {
    /**
     * Lấy danh sách danh mục
     */
    getAllCategories: async (): Promise<Category[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/categories`);
        return response.data;
    },

    /**
     * Lấy chi tiết danh mục theo ID
     */
    getCategoryById: async (id: number): Promise<Category> => {
        const response = await axiosInstance.get(`${BASE_URL}/categories/${id}`);
        return response.data;
    },

    /**
     * Lấy danh sách bộ sưu tập
     */
    getAllCollections: async (): Promise<Collection[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/collections`);
        return response.data;
    },

    /**
     * Lấy chi tiết bộ sưu tập theo ID
     */
    getCollectionById: async (id: number): Promise<Collection> => {
        const response = await axiosInstance.get(`${BASE_URL}/collections/${id}`);
        return response.data;
    },

    /**
     * Lấy danh sách sản phẩm
     */
    getAllProducts: async (): Promise<Product[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/products`);
        return response.data;
    },

    /**
     * Lấy chi tiết sản phẩm theo ID
     */
    getProductById: async (id: number): Promise<Product> => {
        const response = await axiosInstance.get(`${BASE_URL}/products/${id}`);
        return response.data;
    },

    /**
     * Lấy danh sách sản phẩm theo danh mục
     */
    getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/products/category/${categoryId}`);
        return response.data;
    },

    /**
     * Lấy danh sách sản phẩm theo bộ sưu tập
     */
    getProductsByCollection: async (collectionId: number): Promise<Product[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/products/collection/${collectionId}`);
        return response.data;
    },

    /**
     * Lấy danh sách sản phẩm bán chạy nhất
     */
    getBestSellingProducts: async (): Promise<Product[]> => {
        // const response = await axiosInstance.get(`${BASE_URL}/products/bestselling`);
        // return response.data;
        return [];
    },

    /**
     * Lấy danh sách sản phẩm tương tự
     */
    getSimilarProducts: async (productId: number): Promise<Product[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/products/${productId}/similar`);
        return response.data;
    },

    /**
     * Lấy danh sách sản phẩm theo khoảng giá
     */
    getProductsByPriceRange: async (minPrice: number, maxPrice: number): Promise<Product[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/products/price/between/${minPrice}/${maxPrice}`);
        return response.data;
    },

    /**
     * Lấy URL hình ảnh ngẫu nhiên của sản phẩm thuộc một danh mục
     * @param categoryId ID của danh mục
     * @returns URL của hình ảnh ngẫu nhiên từ một sản phẩm trong danh mục đó
     */
    getRandomProductImageByCategoryId: async (categoryId: number): Promise<string> => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/products/category/${categoryId}/random-image`);
            if (response.data && response.data.imageUrl) {
                return response.data.imageUrl;
            } else {
                console.warn(`No image found for category ${categoryId}`);
                return '';
            }
        } catch (error) {
            // Nếu không tìm thấy hình ảnh hoặc có lỗi, trả về chuỗi rỗng
            console.error(`Failed to get random image for category ${categoryId}:`, error);
            return '';
        }
    },

    /**
     * Lấy danh sách thương hiệu theo danh mục
     */
    getBrandListByCategory: async (categoryId: number): Promise<string[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/products/category/${categoryId}/brands`);
        return response.data;
    },

    /**
     * Lấy danh sách vật liệu theo danh mục
     */
    getMaterialListByCategory: async (categoryId: number): Promise<string[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/products/category/${categoryId}/materials`);
        return response.data;
    },

    /**
     * Lấy danh sách kích thước theo danh mục
     */
    getSizeListByCategory: async (categoryId: number): Promise<string[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/products/category/${categoryId}/sizes`);
        return response.data;
    },

    /**
     * Lấy danh sách tuổi vàng theo danh mục
     */
    getGoldKaratListByCategory: async (categoryId: number): Promise<number[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/products/category/${categoryId}/goldkarats`);
        return response.data;
    },

    /**
     * Lấy danh sách màu sắc theo danh mục
     */
    getColorListByCategory: async (categoryId: number): Promise<string[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/products/category/${categoryId}/colors`);
        return response.data;
    },

    /**
     * Tìm kiếm sản phẩm theo từ khóa
     */
    searchProducts: async (keyword: string, filters?: any): Promise<Product[]> => {
        let url = `${BASE_URL}/products/search?keyword=${encodeURIComponent(keyword)}`;

        if (filters) {
            if (filters.minPrice) url += `&minPrice=${filters.minPrice}`;
            if (filters.maxPrice) url += `&maxPrice=${filters.maxPrice}`;
            if (filters.categoryId) url += `&categoryId=${filters.categoryId}`;
            if (filters.brands && filters.brands.length) url += `&brands=${filters.brands.join(',')}`;
            if (filters.materials && filters.materials.length) url += `&materials=${filters.materials.join(',')}`;
            if (filters.colors && filters.colors.length) url += `&colors=${filters.colors.join(',')}`;
            if (filters.goldKarats && filters.goldKarats.length) url += `&goldKarats=${filters.goldKarats.join(',')}`;
        }

        const response = await axiosInstance.get(url);
        return response.data;
    },

    /**
     * Lấy sản phẩm mới nhất
     */
    getNewArrivals: async (limit: number = 8): Promise<Product[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/products/new-arrivals?limit=${limit}`);
        return response.data;
    },

    /**
     * Lấy sản phẩm đặc sắc/nổi bật (có thể là sản phẩm được đánh dấu là featured)
     */
    getFeaturedProducts: async (limit: number = 8): Promise<Product[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/products/featured?limit=${limit}`);
        return response.data;
    },

    /**
     * Lọc sản phẩm theo nhiều tiêu chí
     */
    filterProducts: async (filters: {
        categoryIds?: number[];
        collectionIds?: number[];
        brands?: string[];
        materials?: string[];
        colors?: string[];
        goldKarats?: number[];
        sizes?: string[];
        minPrice?: number;
        maxPrice?: number;
        gender?: number;
        sortBy?: string;
        page?: number;
        limit?: number;
    }): Promise<{products: Product[]; totalItems: number; totalPages: number}> => {
        const params = new URLSearchParams();

        // Thêm các tham số vào URL nếu có
        if (filters.categoryIds?.length) params.append('categoryIds', filters.categoryIds.join(','));
        if (filters.collectionIds?.length) params.append('collectionIds', filters.collectionIds.join(','));
        if (filters.brands?.length) params.append('brands', filters.brands.join(','));
        if (filters.materials?.length) params.append('materials', filters.materials.join(','));
        if (filters.colors?.length) params.append('colors', filters.colors.join(','));
        if (filters.goldKarats?.length) params.append('goldKarats', filters.goldKarats.join(','));
        if (filters.sizes?.length) params.append('sizes', filters.sizes.join(','));
        if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
        if (filters.gender !== undefined) params.append('gender', filters.gender.toString());
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await axiosInstance.get(`${BASE_URL}/products/filter?${params.toString()}`);
        return response.data;
    },

    /**
     * Lấy đánh giá của sản phẩm
     */
    getProductReviews: async (
        productId: number,
        page: number = 1,
        limit: number = 10
    ): Promise<{
        reviews: ProductReview[];
        totalItems: number;
        totalPages: number;
        averageRating: number;
    }> => {
        const response = await axiosInstance.get(`${BASE_URL}/products/${productId}/reviews?page=${page}&limit=${limit}`);
        return response.data;
    },

    /**
     * Thêm đánh giá cho sản phẩm
     */
    addProductReview: async (
        productId: number,
        reviewData: {
            rating: number;
            comment: string;
        }
    ): Promise<ProductReview> => {
        const response = await axiosInstance.post(`${BASE_URL}/products/${productId}/reviews`, reviewData);
        return response.data;
    },

    /**
     * Lấy các biến thể của sản phẩm
     */
    getProductVariants: async (productId: number): Promise<ProductVariant[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/products/${productId}/variants`);
        return response.data;
    },

    /**
     * Lấy đặc điểm nổi bật của sản phẩm
     */
    getProductFeatures: async (productId: number): Promise<ProductFeature[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/products/${productId}/features`);
        return response.data;
    },

    /**
     * Lấy sản phẩm liên quan (khác với sản phẩm tương tự, có thể dựa trên doanh số hoặc tiêu chí khác)
     */
    getRelatedProducts: async (productId: number, limit: number = 4): Promise<Product[]> => {
        const response = await axiosInstance.get(`${BASE_URL}/products/${productId}/related?limit=${limit}`);
        return response.data;
    },

    /**
     * Lấy thống kê tổng quan (dùng cho dashboard)
     */
    getCatalogStatistics: async (): Promise<{
        totalProducts: number;
        totalCategories: number;
        totalCollections: number;
        topSellingProducts: Product[];
    }> => {
        const response = await axiosInstance.get(`${BASE_URL}/statistics`);
        return response.data;
    },

    /**
     * Lấy các đề xuất cho người dùng dựa trên lịch sử mua hàng hoặc xem sản phẩm
     */
    getRecommendedProducts: async (userId?: string, limit: number = 8): Promise<Product[]> => {
        let url = `${BASE_URL}/products/recommended?limit=${limit}`;
        if (userId) url += `&userId=${userId}`;

        const response = await axiosInstance.get(url);
        return response.data;
    },
};

export default catalogService;
