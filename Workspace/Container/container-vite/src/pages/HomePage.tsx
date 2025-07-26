import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import catalogService, { Product } from '../services/catalogService';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const HomePage = () => {
    const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [categoryImages, setCategoryImages] = useState<{[key: number]: string}>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsRes, categoriesRes, collectionsRes] = await Promise.all([
                    catalogService.getBestSellingProducts(),
                    catalogService.getAllCategories(),
                    catalogService.getAllCollections()
                ]);

                setBestSellingProducts(productsRes);
                setCategories(categoriesRes);
                setCollections(collectionsRes);
                
                const imagePromises = categoriesRes.map(async (category) => {
                    try {
                        const imageUrl = await catalogService.getRandomProductImageByCategoryId(category.id);
                        return { categoryId: category.id, imageUrl };
                    } catch (err) {
                        console.error(`Error fetching image for category ${category.id}:`, err);
                        return { categoryId: category.id, imageUrl: '' };
                    }
                });
                
                const imageResults = await Promise.all(imagePromises);
                const imagesMap = imageResults.reduce((acc, curr) => {
                    acc[curr.categoryId] = curr.imageUrl;
                    return acc;
                }, {});
                
                setCategoryImages(imagesMap);
            } catch (err) {
                console.error('Error fetching homepage data:', err);
                setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-600">
                <p>{error}</p>
                <button 
                    className="mt-4 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                    onClick={() => window.location.reload()}
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section with Carousel */}
            <section className="relative">
                <Carousel 
                    autoPlay 
                    infiniteLoop 
                    showStatus={false} 
                    showThumbs={false}
                    interval={5000}
                    className="h-[70vh]"
                >
                    <div className="h-[70vh] relative">
                        <img 
                            src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?ixlib=rb-4.0.3"
                            alt="Trang sức cao cấp" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black opacity-40"></div>
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-6">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 text-center">
                                Vẻ Đẹp Tinh Tế của Kim Cương
                            </h2>
                            <p className="text-xl max-w-2xl text-center mb-8">
                                Khám phá bộ sưu tập kim cương cao cấp, được chọn lọc kỹ lưỡng cho những khoảnh khắc đặc biệt nhất.
                            </p>
                            <Link 
                                to="/catalog?collection=diamond"
                                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
                            >
                                Khám Phá Ngay
                            </Link>
                        </div>
                    </div>
                    <div className="h-[70vh] relative">
                        <img 
                            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3" 
                            alt="Nhẫn cưới cao cấp" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black opacity-40"></div>
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-6">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 text-center">
                                Vĩnh Cửu Như Tình Yêu
                            </h2>
                            <p className="text-xl max-w-2xl text-center mb-8">
                                Nhẫn cưới và nhẫn đính hôn - Biểu tượng vĩnh cửu cho tình yêu trọn vẹn.
                            </p>
                            <Link 
                                to="/catalog?category=wedding-rings"
                                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
                            >
                                Bộ Sưu Tập Nhẫn
                            </Link>
                        </div>
                    </div>
                    <div className="h-[70vh] relative">
                        <img 
                            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3" 
                            alt="Bộ sưu tập mới" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black opacity-40"></div>
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-6">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 text-center">
                                Bộ Sưu Tập Thu - Đông 2025
                            </h2>
                            <p className="text-xl max-w-2xl text-center mb-8">
                                Lấy cảm hứng từ vẻ đẹp của thiên nhiên, mang đến nét thanh lịch và sang trọng cho người phụ nữ hiện đại.
                            </p>
                            <Link 
                                to="/catalog/new-collection"
                                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
                            >
                                Xem Bộ Sưu Tập
                            </Link>
                        </div>
                    </div>
                </Carousel>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-serif font-medium text-gray-800 mb-2">Danh Mục Sản Phẩm</h2>
                        <div className="h-1 w-24 bg-amber-500 mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.slice(0, 6).map((category) => (
                            <Link 
                                key={category.id}
                                to={`/catalog/category/${category.id}`} 
                                className="group"
                            >
                                <div className="relative h-64 overflow-hidden rounded-lg shadow-lg">
                                    <img 
                                        src={categoryImages[category.id] || category.url || `https://source.unsplash.com/500x400/?jewelry,${category.name}`}
                                        alt={category.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            // Fallback nếu hình ảnh không tải được
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = `https://source.unsplash.com/500x400/?jewelry,${category.name}`;
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                                        <h3 className="text-xl text-white font-medium">{category.name}</h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link 
                            to="/catalog"
                            className="inline-block border-2 border-amber-600 text-amber-700 px-6 py-2 rounded-md hover:bg-amber-600 hover:text-white transition-colors font-medium"
                        >
                            Xem Tất Cả Danh Mục
                        </Link>
                    </div>
                </div>
            </section>

            {/* Collections Showcase */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-serif font-medium text-gray-800 mb-2">Bộ Sưu Tập Độc Quyền</h2>
                        <div className="h-1 w-24 bg-amber-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                            Khám phá các bộ sưu tập độc quyền được thiết kế bởi những nghệ nhân hàng đầu, mang đến vẻ đẹp tinh tế và đẳng cấp.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {collections.slice(0, 2).map((collection) => (
                            <Link 
                                key={collection.id}
                                to={`/catalog/collection/${collection.id}`} 
                                className="group block relative overflow-hidden rounded-lg shadow-xl"
                            >
                                <div className="h-96">
                                    {collection.collectionImages && collection.collectionImages[0] ? (
                                        <img 
                                            src={collection.collectionImages[0].imageUrl}
                                            alt={collection.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <img 
                                            src={`https://source.unsplash.com/800x600/?jewelry,collection,${collection.name}`}
                                            alt={collection.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-8">
                                    <h3 className="text-2xl text-white font-serif">{collection.name}</h3>
                                    <p className="text-gray-300 mt-2 line-clamp-2">{collection.description}</p>
                                    <div className="mt-4 inline-block">
                                        <span className="text-amber-400 group-hover:text-amber-300 transition-colors flex items-center">
                                            Khám phá
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link 
                            to="/catalog/collections"
                            className="inline-block border-2 border-amber-600 text-amber-700 px-6 py-2 rounded-md hover:bg-amber-600 hover:text-white transition-colors font-medium"
                        >
                            Xem Tất Cả Bộ Sưu Tập
                        </Link>
                    </div>
                </div>
            </section>

            {/* Best Sellers */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-serif font-medium text-gray-800 mb-2">Sản Phẩm Bán Chạy</h2>
                        <div className="h-1 w-24 bg-amber-500 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {bestSellingProducts.slice(0, 8).map((product) => (
                            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                <Link to={`/catalog/product/${product.id}`}>
                                    <div className="h-48 sm:h-64 overflow-hidden">
                                        {product.productImages && product.productImages.length > 0 ? (
                                            <img 
                                                src={product.productImages.find(img => img.isPrimary)?.imageUrl || product.productImages[0].imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-500">Không có ảnh</span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                                <div className="p-4">
                                    <p className="text-gray-500 text-sm">{product.categoryName}</p>
                                    <Link to={`/catalog/product/${product.id}`}>
                                        <h3 className="text-gray-800 font-medium mb-2 hover:text-amber-600 transition-colors">{product.name}</h3>
                                    </Link>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-amber-700 font-semibold">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                        </span>
                                        <button 
                                            className="text-amber-600 hover:text-amber-800"
                                            title="Thêm vào giỏ hàng"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link 
                            to="/catalog/bestselling"
                            className="inline-block bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors font-medium"
                        >
                            Xem Thêm Sản Phẩm Bán Chạy
                        </Link>
                    </div>
                </div>
            </section>

            {/* Brand Values */}
            <section className="py-16 bg-amber-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-serif font-medium text-gray-800 mb-2">Giá Trị Thương Hiệu</h2>
                        <div className="h-1 w-24 bg-amber-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                            Tại Tinh Tú Jewelry, chúng tôi cam kết mang đến những sản phẩm trang sức chất lượng cao cùng trải nghiệm mua sắm hoàn hảo.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-md text-center">
                            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium mb-2">Chứng Nhận Chất Lượng</h3>
                            <p className="text-gray-600">
                                Mọi sản phẩm đều được cấp giấy chứng nhận chất lượng từ các tổ chức uy tín trong ngành kim hoàn.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-md text-center">
                            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium mb-2">Thiết Kế Độc Quyền</h3>
                            <p className="text-gray-600">
                                Các thiết kế của chúng tôi là sự kết hợp giữa vẻ đẹp truyền thống và hiện đại, tạo nên những tác phẩm nghệ thuật độc đáo.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-md text-center">
                            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium mb-2">Quà Tặng Hoàn Hảo</h3>
                            <p className="text-gray-600">
                                Mỗi món trang sức đều được đóng gói tinh tế, sẵn sàng trở thành món quà ý nghĩa cho người thân yêu của bạn.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call To Action */}
            <section className="py-20 bg-gradient-to-r from-amber-700 to-amber-900 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Tìm Kiếm Món Trang Sức Hoàn Hảo</h2>
                    <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
                        Đặt lịch tư vấn với chuyên viên của chúng tôi để được hỗ trợ chọn lựa sản phẩm phù hợp nhất.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link 
                            to="/consultation"
                            className="px-8 py-3 bg-white text-amber-800 rounded-md hover:bg-gray-100 transition-colors font-medium"
                        >
                            Đặt Lịch Tư Vấn
                        </Link>
                        <Link 
                            to="/catalog"
                            className="px-8 py-3 border border-white text-white rounded-md hover:bg-white hover:text-amber-800 transition-colors font-medium"
                        >
                            Khám Phá Bộ Sưu Tập
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;