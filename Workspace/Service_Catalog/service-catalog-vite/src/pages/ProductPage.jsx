import {useState, useEffect} from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import catalogService from 'container/catalogService';
import {useCartOrder} from 'container/CartOrderContext';
import {useAuth} from 'container/AuthContext';

const ProductPage = () => {
    const {productId} = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [productVariants, setProductVariants] = useState([]);
    const [productFeatures, setProductFeatures] = useState([]);
    const [productReviews, setProductReviews] = useState([]);
    const [reviewStats, setReviewStats] = useState({
        averageRating: 0,
        totalReviews: 0,
    });
    const [activeTab, setActiveTab] = useState('description');
    const [cartMessage, setCartMessage] = useState(null);

    const {addToCart} = useCartOrder();
    const {isAuthenticated} = useAuth();

    // Fetch product data when productId changes
    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchProductData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch product details
                const productData = await catalogService.getProductById(parseInt(productId));
                setProduct(productData);
                document.title = `${productData.name} - Tinh Tú Jewelry`;

                // Set default selected image
                if (productData.productImages && productData.productImages.length > 0) {
                    const primaryImage = productData.productImages.find((img) => img.isPrimary);
                    setSelectedImage(primaryImage?.imageUrl || productData.productImages[0].imageUrl);
                }

                // Fetch product variants if available
                try {
                    const variantsData = await catalogService.getProductVariants(parseInt(productId));
                    setProductVariants(variantsData);

                    // Set initial variant, size, color selections
                    if (variantsData.length > 0) {
                        setSelectedVariant(variantsData[0]);

                        // Extract unique sizes and colors
                        const uniqueSizes = [...new Set(variantsData.map((v) => v.size))];
                        const uniqueColors = [...new Set(variantsData.map((v) => v.color))];

                        if (uniqueSizes.length > 0) {
                            setSelectedSize(uniqueSizes[0]);
                        }

                        if (uniqueColors.length > 0) {
                            setSelectedColor(uniqueColors[0]);
                        }
                    }
                } catch (err) {
                    console.warn('Could not fetch product variants:', err);
                }

                // Fetch product features
                try {
                    const featuresData = await catalogService.getProductFeatures(parseInt(productId));
                    setProductFeatures(featuresData);
                } catch (err) {
                    console.warn('Could not fetch product features:', err);
                }

                // Fetch product reviews
                try {
                    const reviewsData = await catalogService.getProductReviews(parseInt(productId));
                    setProductReviews(reviewsData.reviews || []);
                    setReviewStats({
                        averageRating: reviewsData.averageRating || 0,
                        totalReviews: reviewsData.totalItems || 0,
                    });
                } catch (err) {
                    console.warn('Could not fetch product reviews:', err);
                }

                // Fetch similar products
                try {
                    const similarProductsData = await catalogService.getSimilarProducts(parseInt(productId));
                    setSimilarProducts(similarProductsData || []);
                } catch (err) {
                    console.warn('Could not fetch similar products:', err);
                }

                // Fetch related products
                try {
                    const relatedProductsData = await catalogService.getRelatedProducts(parseInt(productId));
                    setRelatedProducts(relatedProductsData || []);
                } catch (err) {
                    console.warn('Could not fetch related products:', err);
                }
            } catch (err) {
                console.error('Error fetching product data:', err);
                setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [productId]);

    // Handle variant selection
    useEffect(() => {
        if (selectedSize && selectedColor && productVariants.length > 0) {
            // Find variant matching selected size and color
            const matchingVariant = productVariants.find((v) => v.size === selectedSize && v.color === selectedColor);

            if (matchingVariant) {
                setSelectedVariant(matchingVariant);

                // Update selected image if variant has an image
                if (matchingVariant.imageUrl) {
                    setSelectedImage(matchingVariant.imageUrl);
                }
            }
        }
    }, [selectedSize, selectedColor, productVariants]);

    // Handle quantity changes
    const increaseQuantity = () => {
        const maxQty = selectedVariant?.quantity || product?.quantity || 10;
        if (quantity < maxQty) {
            setQuantity((prev) => prev + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    // Add to cart functionality
    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            // Điều hướng người dùng đến trang đăng nhập nếu chưa đăng nhập
            navigate('/account/login');
            return;
        }

        try {
            // Thêm sản phẩm vào giỏ hàng sử dụng context
            await addToCart(parseInt(productId), quantity);

            // Hiển thị thông báo thành công
            setCartMessage('Sản phẩm đã được thêm vào giỏ hàng!');

            // Ẩn thông báo sau 3 giây
            setTimeout(() => {
                setCartMessage(null);
            }, 3000);
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
            setCartMessage('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');

            setTimeout(() => {
                setCartMessage(null);
            }, 3000);
        }
    };

    // Format price with VND currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatHTMLDescription = (htmlContent) => {
        if (!htmlContent) return [];

        const isHTML = htmlContent.includes('<div') || htmlContent.includes('<p>');
        if (!isHTML) return [htmlContent];

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        const paragraphs = [];

        // Case 1: .mp-block-description structure
        const descBlocks = doc.querySelectorAll('.mp-block-description');
        if (descBlocks.length > 0) {
            descBlocks.forEach((block) => {
                const pElement = block.querySelector('p');
                if (pElement) paragraphs.push(pElement.textContent);
            });
            return paragraphs;
        }

        // Case 2: Multiple <p> inside a single container
        const pElements = doc.querySelectorAll('p');
        if (pElements.length > 0) {
            pElements.forEach((p) => paragraphs.push(p.textContent));
            return paragraphs;
        }

        // Case 3: Just extract text from HTML
        const text = doc.body.textContent;
        if (text) {
            // Split by periods, semicolons and other sentence terminators
            const sentences = text.split(/[.;!?]\s+/);
            return sentences.filter((s) => s.trim().length > 0).map((s) => s.trim() + '.');
        }

        return [htmlContent]; // Fallback to original text
    };

    // Render star rating
    const renderStarRating = (rating) => {
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                // Full star
                stars.push(
                    <svg key={i} className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            } else if (i - 0.5 <= rating) {
                // Half star
                stars.push(
                    <svg key={i} className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <defs>
                            <linearGradient id="halfStarGradient">
                                <stop offset="50%" stopColor="currentColor" />
                                <stop offset="50%" stopColor="#D1D5DB" />
                            </linearGradient>
                        </defs>
                        <path
                            fill="url(#halfStarGradient)"
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                    </svg>
                );
            } else {
                // Empty star
                stars.push(
                    <svg key={i} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            }
        }

        return <div className="flex">{stars}</div>;
    };

    // Generate color map for displaying color options
    const colorMap = {
        Gold: 'bg-amber-400',
        'White Gold': 'bg-gray-300',
        'Rose Gold': 'bg-rose-300',
        Silver: 'bg-gray-400',
        Platinum: 'bg-gray-200',
        Yellow: 'bg-yellow-400',
        White: 'bg-white',
        Black: 'bg-black',
        Red: 'bg-red-600',
        Blue: 'bg-blue-600',
        Green: 'bg-green-600',
    };

    // Get unique colors and sizes from variants
    const uniqueColors = [...new Set(productVariants.map((v) => v.color))];
    const uniqueSizes = [...new Set(productVariants.map((v) => v.size))];

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-[#faf7f2]">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-amber-800 font-medium">Đang tải thông tin sản phẩm...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#faf7f2] p-6">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="w-20 h-20 mx-auto mb-6 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-serif font-medium text-amber-900 mb-3">Đã xảy ra lỗi</h3>
                    <p className="text-amber-700 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-amber-600 text-white font-medium px-6 py-2.5 rounded-full hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#faf7f2] p-6">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="w-20 h-20 mx-auto mb-6 text-amber-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-serif font-medium text-amber-900 mb-3">Không tìm thấy sản phẩm</h3>
                    <p className="text-amber-700 mb-6">Sản phẩm này không tồn tại hoặc đã bị xóa.</p>
                    <button
                        onClick={() => navigate('/catalog')}
                        className="bg-amber-600 text-white font-medium px-6 py-2.5 rounded-full hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform"
                    >
                        Quay lại danh mục
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#faf7f2] min-h-screen">
            {/* Cart Message */}
            {cartMessage && (
                <motion.div
                    initial={{opacity: 0, y: -50}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -50}}
                    className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-full shadow-lg"
                >
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {cartMessage}
                    </div>
                </motion.div>
            )}

            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-4">
                <nav className="flex text-sm">
                    <Link to="/" className="text-amber-600 hover:text-amber-800">
                        Trang chủ
                    </Link>
                    <span className="mx-2 text-amber-600">/</span>
                    {product.categoryName && (
                        <>
                            <Link
                                to={`/catalog/category/${product.categoryId}`}
                                className="text-amber-600 hover:text-amber-800"
                            >
                                {product.categoryName}
                            </Link>
                            <span className="mx-2 text-amber-600">/</span>
                        </>
                    )}
                    <span className="text-amber-900 font-medium truncate">{product.name}</span>
                </nav>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
                    <div className="flex flex-col-reverse lg:flex-row gap-10">
                        {/* Product Images - Left side on desktop */}
                        <div className="lg:w-1/2">
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                className="mb-4 aspect-square bg-[#faf7f2] rounded-xl overflow-hidden"
                            >
                                {/* Carousel for main product image */}
                                {product.productImages && product.productImages.length > 0 ? (
                                    <div className="relative h-full">
                                        <img
                                            src={selectedImage || product.productImages[0].imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-contain"
                                        />

                                        {product.productImages.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        const currentIndex = product.productImages.findIndex(
                                                            (img) => img.imageUrl === selectedImage
                                                        );
                                                        const prevIndex =
                                                            currentIndex <= 0
                                                                ? product.productImages.length - 1
                                                                : currentIndex - 1;
                                                        setSelectedImage(product.productImages[prevIndex].imageUrl);
                                                    }}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/70 rounded-full flex items-center justify-center hover:bg-white hover:shadow-md transition-all"
                                                >
                                                    <svg
                                                        className="w-5 h-5 text-amber-800"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 19l-7-7 7-7"
                                                        />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const currentIndex = product.productImages.findIndex(
                                                            (img) => img.imageUrl === selectedImage
                                                        );
                                                        const nextIndex = (currentIndex + 1) % product.productImages.length;
                                                        setSelectedImage(product.productImages[nextIndex].imageUrl);
                                                    }}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/70 rounded-full flex items-center justify-center hover:bg-white hover:shadow-md transition-all"
                                                >
                                                    <svg
                                                        className="w-5 h-5 text-amber-800"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 5l7 7-7 7"
                                                        />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-gray-400">Không có hình ảnh</span>
                                    </div>
                                )}
                            </motion.div>

                            {/* Thumbnail Gallery */}
                            {product.productImages && product.productImages.length > 1 && (
                                <div className="grid grid-cols-5 gap-2">
                                    {product.productImages.map((image, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{scale: 1.05}}
                                            className={`aspect-square bg-[#faf7f2] rounded-lg overflow-hidden ${
                                                selectedImage === image.imageUrl
                                                    ? 'ring-2 ring-amber-600'
                                                    : 'hover:ring-1 hover:ring-amber-400'
                                            }`}
                                            onClick={() => setSelectedImage(image.imageUrl)}
                                        >
                                            <img
                                                src={image.imageUrl}
                                                alt={`${product.name} - ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="lg:w-1/2">
                            {/* Product Title & Rating */}
                            <div>
                                <h1 className="text-3xl font-serif font-medium text-amber-900 mb-2">{product.name}</h1>
                                <div className="flex items-center mb-4">
                                    <div className="flex items-center mr-2">{renderStarRating(reviewStats.averageRating)}</div>
                                    <span className="text-amber-800 text-sm">{reviewStats.totalReviews} đánh giá</span>
                                    {product.brand && (
                                        <div className="ml-4 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                                            {product.brand}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="text-2xl font-serif text-amber-800 font-medium">
                                    {formatPrice(selectedVariant ? selectedVariant.price : product.price)}
                                </div>
                                {product.code && (
                                    <div className="text-sm text-amber-700 mt-1">
                                        Mã sản phẩm: <span className="font-medium">{product.code}</span>
                                    </div>
                                )}
                            </div>

                            {/* Short Description */}
                            <div className="text-amber-800 mb-6 prose prose-amber">
                                <div>
                                    <h3 className="text-lg font-medium text-amber-900 mb-4">Đặc điểm nổi bật</h3>
                                    <ul className="list-disc pl-5 space-y-3">
                                        {formatHTMLDescription(product.description).map((paragraph, index) => (
                                            <li key={index} className="text-amber-800">
                                                {paragraph}
                                            </li>
                                        ))}
                                    </ul>

                                    <h3 className="text-lg font-medium text-amber-900 mt-8 mb-4">Thông tin thêm</h3>
                                    <ul className="list-disc pl-5 space-y-3">
                                        <li>Phù hợp cho nhiều dịp sử dụng: đi làm, dự tiệc, hay các sự kiện quan trọng.</li>
                                        <li>
                                            Thiết kế hiện đại kết hợp với chất liệu cao cấp mang lại vẻ sang trọng, quý phái.
                                        </li>
                                        <li>Món quà ý nghĩa cho người thân, bạn bè hoặc đối tác trong các dịp đặc biệt.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-amber-200 my-6"></div>

                            {/* Variants - Size */}
                            {uniqueSizes.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-amber-900 mb-2">Kích thước:</label>
                                    <div className="flex flex-wrap gap-2">
                                        {uniqueSizes.map((size, index) => (
                                            <button
                                                key={index}
                                                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                                                    selectedSize === size
                                                        ? 'bg-amber-600 text-white'
                                                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                                                }`}
                                                onClick={() => setSelectedSize(size)}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Variants - Color */}
                            {uniqueColors.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-amber-900 mb-2">Màu sắc:</label>
                                    <div className="flex flex-wrap gap-3">
                                        {uniqueColors.map((color, index) => {
                                            const bgColorClass = colorMap[color] || 'bg-gray-500';

                                            return (
                                                <button
                                                    key={index}
                                                    className={`w-10 h-10 rounded-full shadow-sm transition-transform hover:scale-110 ${bgColorClass} ${
                                                        selectedColor === color ? 'ring-2 ring-offset-2 ring-amber-600' : ''
                                                    }`}
                                                    title={color}
                                                    onClick={() => setSelectedColor(color)}
                                                >
                                                    <span className="sr-only">{color}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-amber-900 mb-2">Số lượng:</label>
                                <div className="flex items-center max-w-[140px]">
                                    <button
                                        onClick={decreaseQuantity}
                                        className="w-10 h-10 bg-amber-100 text-amber-800 flex items-center justify-center rounded-l-lg hover:bg-amber-200"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <input
                                        type="text"
                                        value={quantity}
                                        readOnly
                                        className="w-12 h-10 text-center border-0 bg-amber-50"
                                    />
                                    <button
                                        onClick={increaseQuantity}
                                        className="w-10 h-10 bg-amber-100 text-amber-800 flex items-center justify-center rounded-r-lg hover:bg-amber-200"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6v12m6-6H6"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart */}
                            <div className="flex flex-col space-y-3 mb-6 w-full">
                                <motion.button
                                    whileHover={{scale: 1.02}}
                                    whileTap={{scale: 0.98}}
                                    onClick={handleAddToCart}
                                    className="w-full px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-md hover:shadow-lg transition-all"
                                >
                                    <span className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                        Thêm vào giỏ hàng
                                    </span>
                                </motion.button>

                                <motion.button
                                    whileHover={{scale: 1.02}}
                                    whileTap={{scale: 0.98}}
                                    className="w-full px-6 py-3 border border-amber-600 text-amber-600 font-medium rounded-lg hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all"
                                >
                                    <span className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                        </svg>
                                        Yêu thích
                                    </span>
                                </motion.button>
                            </div>

                            {/* Product Info & Categories */}
                            <div className="space-y-3 text-sm text-amber-800">
                                {product.material && (
                                    <div className="flex">
                                        <span className="font-medium w-32">Chất liệu:</span>
                                        <span>{product.material}</span>
                                    </div>
                                )}
                                {product.goldKarat && (
                                    <div className="flex">
                                        <span className="font-medium w-32">Tuổi vàng:</span>
                                        <span>{product.goldKarat}K</span>
                                    </div>
                                )}
                                {product.size && !uniqueSizes.length && (
                                    <div className="flex">
                                        <span className="font-medium w-32">Kích thước:</span>
                                        <span>{product.size}</span>
                                    </div>
                                )}
                                {product.color && !uniqueColors.length && (
                                    <div className="flex">
                                        <span className="font-medium w-32">Màu sắc:</span>
                                        <span>{product.color}</span>
                                    </div>
                                )}
                                {product.categoryName && (
                                    <div className="flex">
                                        <span className="font-medium w-32">Danh mục:</span>
                                        <Link
                                            to={`/catalog/category/${product.categoryId}`}
                                            className="text-amber-600 hover:text-amber-800"
                                        >
                                            {product.categoryName}
                                        </Link>
                                    </div>
                                )}
                                {product.collectionName && (
                                    <div className="flex">
                                        <span className="font-medium w-32">Bộ sưu tập:</span>
                                        <Link
                                            to={`/catalog/collection/${product.collectionId}`}
                                            className="text-amber-600 hover:text-amber-800"
                                        >
                                            {product.collectionName}
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Social Sharing */}
                            <div className="flex items-center mt-6">
                                <span className="text-amber-800 text-sm mr-3">Chia sẻ:</span>
                                <div className="flex space-x-2">
                                    <button className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </button>
                                    <button className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                        </svg>
                                    </button>
                                    <button className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm4.95 4.05a7.068 7.068 0 0 1 4.5 4.5H16.5a9 9 0 0 0-4.5-4.5V4.05zm-9.9 0v4.5a9 9 0 0 0-4.5 4.5H2.55a7.068 7.068 0 0 1 4.5-4.5V4.05zM12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zm-9.45 9.45H7.5a9 9 0 0 0 4.5 4.5v4.5a7.068 7.068 0 0 1-4.5-4.5V15.45zm13.95 4.5a7.068 7.068 0 0 1-4.5 4.5v-4.5a9 9 0 0 0 4.5-4.5h4.95a7.068 7.068 0 0 1-4.5 4.5V19.95z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="bg-white rounded-2xl shadow-lg mb-10 overflow-hidden">
                    <div className="border-b border-amber-100">
                        <div className="flex overflow-x-auto">
                            <button
                                className={`px-6 py-4 font-medium text-sm whitespace-nowrap focus:outline-none ${
                                    activeTab === 'description'
                                        ? 'text-amber-700 border-b-2 border-amber-600'
                                        : 'text-amber-600 hover:text-amber-800'
                                }`}
                                onClick={() => setActiveTab('description')}
                            >
                                Mô tả sản phẩm
                            </button>

                            <button
                                className={`px-6 py-4 font-medium text-sm whitespace-nowrap focus:outline-none ${
                                    activeTab === 'features'
                                        ? 'text-amber-700 border-b-2 border-amber-600'
                                        : 'text-amber-600 hover:text-amber-800'
                                }`}
                                onClick={() => setActiveTab('features')}
                            >
                                Thông số chi tiết
                            </button>

                            <button
                                className={`px-6 py-4 font-medium text-sm whitespace-nowrap focus:outline-none ${
                                    activeTab === 'reviews'
                                        ? 'text-amber-700 border-b-2 border-amber-600'
                                        : 'text-amber-600 hover:text-amber-800'
                                }`}
                                onClick={() => setActiveTab('reviews')}
                            >
                                Đánh giá ({reviewStats.totalReviews})
                            </button>

                            <button
                                className={`px-6 py-4 font-medium text-sm whitespace-nowrap focus:outline-none ${
                                    activeTab === 'shipping'
                                        ? 'text-amber-700 border-b-2 border-amber-600'
                                        : 'text-amber-600 hover:text-amber-800'
                                }`}
                                onClick={() => setActiveTab('shipping')}
                            >
                                Vận chuyển & Đổi trả
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Description Tab */}
                        {activeTab === 'description' && (
                            <div className="prose prose-amber max-w-none text-amber-800">
                                {/* Check if description might be HTML */}
                                {product.description && product.description.includes('<') ? (
                                    <div>
                                        <h3 className="text-lg font-medium text-amber-900 mb-4">Đặc điểm nổi bật</h3>
                                        <ul className="list-disc pl-5 space-y-3">
                                            {formatHTMLDescription(product.description).map((paragraph, index) => (
                                                <li key={index} className="text-amber-800">
                                                    {paragraph}
                                                </li>
                                            ))}
                                        </ul>

                                        <h3 className="text-lg font-medium text-amber-900 mt-8 mb-4">Thông tin thêm</h3>
                                        <ul className="list-disc pl-5 space-y-3">
                                            <li>Phù hợp cho nhiều dịp sử dụng: đi làm, dự tiệc, hay các sự kiện quan trọng.</li>
                                            <li>
                                                Thiết kế hiện đại kết hợp với chất liệu cao cấp mang lại vẻ sang trọng, quý
                                                phái.
                                            </li>
                                            <li>Món quà ý nghĩa cho người thân, bạn bè hoặc đối tác trong các dịp đặc biệt.</li>
                                        </ul>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="text-lg font-medium text-amber-900 mb-4">Đặc điểm nổi bật</h3>
                                        <ul className="list-disc pl-5 space-y-3">
                                            <li>
                                                Sở hữu thiết kế trẻ trung cộng hưởng cùng ánh kim quý phái của vàng{' '}
                                                {product.goldKarat}K.
                                            </li>
                                            <li>Tôn lên vẻ đẹp hiện đại và thời thượng của các quý cô.</li>
                                            <li>Giúp nàng trông thật xinh đẹp rạng rỡ khi trưng diện.</li>
                                            <li>Thiết kế mềm mại nhưng đầy quyền năng, phá cách tạo nên sự khác biệt.</li>
                                            <li>Sự kết hợp hài hòa giữa vàng và đá, tạo nên vẻ đẹp tinh tế.</li>
                                        </ul>

                                        <h3 className="text-lg font-medium text-amber-900 mt-8 mb-4">Ý nghĩa sản phẩm</h3>
                                        <ul className="list-disc pl-5 space-y-3">
                                            <li>Là biểu tượng của sự sang trọng và đẳng cấp.</li>
                                            <li>Thể hiện cá tính và phong cách riêng của người phụ nữ hiện đại.</li>
                                            <li>Món quà ý nghĩa trong các dịp đặc biệt như sinh nhật, kỷ niệm.</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Features Tab */}
                        {activeTab === 'features' && (
                            <div>
                                <table className="w-full text-left">
                                    <tbody>
                                        {productFeatures.length > 0 ? (
                                            productFeatures.map((feature, index) => (
                                                <tr key={index} className="border-b border-amber-100">
                                                    <th className="py-3 text-amber-900 font-medium w-1/3">{feature.name}</th>
                                                    <td className="py-3 text-amber-800">{feature.value}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <>
                                                <tr className="border-b border-amber-100">
                                                    <th className="py-3 text-amber-900 font-medium w-1/3">Mã sản phẩm</th>
                                                    <td className="py-3 text-amber-800">{product.code || 'N/A'}</td>
                                                </tr>
                                                <tr className="border-b border-amber-100">
                                                    <th className="py-3 text-amber-900 font-medium">Chất liệu</th>
                                                    <td className="py-3 text-amber-800">{product.material || 'N/A'}</td>
                                                </tr>
                                                <tr className="border-b border-amber-100">
                                                    <th className="py-3 text-amber-900 font-medium">Tuổi vàng</th>
                                                    <td className="py-3 text-amber-800">
                                                        {product.goldKarat ? `${product.goldKarat}K` : 'N/A'}
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-amber-100">
                                                    <th className="py-3 text-amber-900 font-medium">Màu sắc</th>
                                                    <td className="py-3 text-amber-800">{product.color || 'N/A'}</td>
                                                </tr>
                                                <tr className="border-b border-amber-100">
                                                    <th className="py-3 text-amber-900 font-medium">Kích thước</th>
                                                    <td className="py-3 text-amber-800">{product.size || 'N/A'}</td>
                                                </tr>
                                                <tr className="border-b border-amber-100">
                                                    <th className="py-3 text-amber-900 font-medium">Thương hiệu</th>
                                                    <td className="py-3 text-amber-800">
                                                        {product.brand || 'Tinh Tú Jewelry'}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="py-3 text-amber-900 font-medium">Xuất xứ</th>
                                                    <td className="py-3 text-amber-800">Việt Nam</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div>
                                <div className="mb-6">
                                    <div className="flex items-center">
                                        <div className="flex items-center">{renderStarRating(reviewStats.averageRating)}</div>
                                        <span className="ml-2 text-amber-800 font-medium">
                                            {reviewStats.averageRating.toFixed(1)} / 5
                                        </span>
                                    </div>
                                    <p className="text-amber-700 text-sm mt-1">Dựa trên {reviewStats.totalReviews} đánh giá</p>
                                </div>

                                {productReviews.length > 0 ? (
                                    <div className="space-y-6">
                                        {productReviews.map((review, index) => (
                                            <div key={index} className="border-b border-amber-100 pb-6">
                                                <div className="flex items-center mb-2">
                                                    <div className="flex items-center">{renderStarRating(review.rating)}</div>
                                                    <span className="ml-2 font-medium text-amber-900">
                                                        {review.userName || 'Khách hàng ẩn danh'}
                                                    </span>
                                                </div>
                                                <p className="text-amber-800 mb-2">{review.comment}</p>
                                                <span className="text-sm text-amber-600">
                                                    {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-amber-700 mb-4">
                                            Sản phẩm này chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
                                        </p>
                                        <button className="inline-flex items-center px-6 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                                            Viết đánh giá
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Shipping Tab */}
                        {activeTab === 'shipping' && (
                            <div className="text-amber-800 space-y-4">
                                <div>
                                    <h3 className="font-medium text-amber-900 mb-2">Chính sách vận chuyển</h3>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Miễn phí vận chuyển cho đơn hàng từ 2 triệu đồng</li>
                                        <li>Thời gian giao hàng: 2-5 ngày làm việc tùy khu vực</li>
                                        <li>Đối với sản phẩm có sẵn: Giao hàng trong 24h cho khu vực nội thành</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium text-amber-900 mb-2">Chính sách đổi trả và hoàn tiền</h3>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Đổi trả miễn phí trong vòng 7 ngày nếu sản phẩm lỗi do nhà sản xuất</li>
                                        <li>Bảo hành sản phẩm 12 tháng theo tiêu chuẩn nhà sản xuất</li>
                                        <li>Sản phẩm đổi trả phải còn nguyên tem, nhãn và hóa đơn mua hàng</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium text-amber-900 mb-2">Bảo hành và chăm sóc sản phẩm</h3>
                                    <p>
                                        Tất cả sản phẩm tại Tinh Tú Jewelry đều được bảo hành làm sạch và đánh bóng miễn phí
                                        trọn đời. Quý khách vui lòng mang sản phẩm đến cửa hàng gần nhất hoặc liên hệ với chúng
                                        tôi để được hướng dẫn chi tiết.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-2xl font-serif font-medium text-amber-900 mb-6">Sản phẩm tương tự</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {similarProducts.slice(0, 4).map((similarProduct) => (
                                <motion.div
                                    key={similarProduct.id}
                                    whileHover={{y: -5}}
                                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100"
                                >
                                    <Link to={`/catalog/product/${similarProduct.id}`} className="block relative">
                                        <div className="aspect-square overflow-hidden">
                                            {similarProduct.productImages && similarProduct.productImages.length > 0 ? (
                                                <img
                                                    src={
                                                        similarProduct.productImages.find((img) => img.isPrimary)?.imageUrl ||
                                                        similarProduct.productImages[0].imageUrl
                                                    }
                                                    alt={similarProduct.name}
                                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 ease-out"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-amber-50 flex items-center justify-center">
                                                    <span className="text-amber-400">Không có hình ảnh</span>
                                                </div>
                                            )}
                                        </div>
                                        {similarProduct.quantity < 1 && (
                                            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
                                                Hết hàng
                                            </div>
                                        )}
                                    </Link>
                                    <div className="p-4">
                                        <Link
                                            to={`/catalog/category/${similarProduct.categoryId}`}
                                            className="text-xs text-amber-600 font-medium hover:text-amber-800 transition-colors"
                                        >
                                            {similarProduct.categoryName}
                                        </Link>
                                        <Link to={`/catalog/product/${similarProduct.id}`} className="block">
                                            <h3 className="mt-2 font-serif text-amber-900 font-medium hover:text-amber-700 transition-colors line-clamp-2 text-lg">
                                                {similarProduct.name}
                                            </h3>
                                        </Link>
                                        <div className="mt-3 flex justify-between items-center">
                                            <span className="text-amber-700 font-semibold">
                                                {formatPrice(similarProduct.price)}
                                            </span>
                                            <button
                                                className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white transition-colors"
                                                aria-label="Add to cart"
                                                title="Thêm vào giỏ hàng"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recently Viewed */}
                <div>
                    <h2 className="text-2xl font-serif font-medium text-amber-900 mb-6">Xem gần đây</h2>
                    <div className="bg-white rounded-xl p-10 shadow-md border border-amber-100 text-center">
                        <p className="text-amber-700">Tính năng đang được phát triển. Sẽ sớm được cập nhật!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
