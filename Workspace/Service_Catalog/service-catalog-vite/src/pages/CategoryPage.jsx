import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import catalogService from 'container/catalogService';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filters
    const [filters, setFilters] = useState({
        brands: [],
        materials: [],
        sizes: [],
        goldKarats: [],
        colors: [],
        priceRange: { min: 0, max: 100000000 }
    });
    
    const [selectedFilters, setSelectedFilters] = useState({
        brand: [],
        material: [],
        size: [],
        goldKarat: [],
        color: [],
    });
    
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });
    const [sortBy, setSortBy] = useState('featured');
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;
    
    // Mobile filters visibility
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    
    // Active filter section (for accordion on mobile)
    const [activeFilterSection, setActiveFilterSection] = useState(null);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setLoading(true);
                
                // Fetch category details
                const categoryData = await catalogService.getCategoryById(parseInt(categoryId));
                setCategory(categoryData);
                document.title = `${categoryData.name} - Tinh Tú Jewelry`;
                
                // Fetch products for this category
                const productsData = await catalogService.getProductsByCategory(parseInt(categoryId));
                setProducts(productsData);
                setFilteredProducts(productsData);
                
                // Set price range based on products
                if (productsData.length > 0) {
                    const minPrice = Math.min(...productsData.map(p => p.price));
                    const maxPrice = Math.max(...productsData.map(p => p.price));
                    setPriceRange({ min: minPrice, max: maxPrice });
                    setFilters(prev => ({...prev, priceRange: { min: minPrice, max: maxPrice }}));
                }
                
                // Fetch filter options
                const [brands, materials, sizes, goldKarats, colors] = await Promise.all([
                    catalogService.getBrandListByCategory(parseInt(categoryId)).catch(() => []),
                    catalogService.getMaterialListByCategory(parseInt(categoryId)).catch(() => []),
                    catalogService.getSizeListByCategory(parseInt(categoryId)).catch(() => []),
                    catalogService.getGoldKaratListByCategory(parseInt(categoryId)).catch(() => []),
                    catalogService.getColorListByCategory(parseInt(categoryId)).catch(() => [])
                ]);
                
                setFilters(prev => ({
                    ...prev,
                    brands,
                    materials,
                    sizes, 
                    goldKarats,
                    colors
                }));
            } catch (err) {
                console.error('Error fetching category data:', err);
                setError('Không thể tải dữ liệu danh mục. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchCategoryData();
    }, [categoryId]);
    
    // Apply filters when they change
    useEffect(() => {
        if (!products.length) return;
        
        let result = [...products];
        
        // Apply price range filter
        result = result.filter(product => 
            product.price >= priceRange.min && product.price <= priceRange.max
        );
        
        // Apply brand filter
        if (selectedFilters.brand.length > 0) {
            result = result.filter(product => selectedFilters.brand.includes(product.brand));
        }
        
        // Apply material filter
        if (selectedFilters.material.length > 0) {
            result = result.filter(product => selectedFilters.material.includes(product.material));
        }
        
        // Apply size filter
        if (selectedFilters.size.length > 0) {
            result = result.filter(product => selectedFilters.size.includes(product.size));
        }
        
        // Apply goldKarat filter
        if (selectedFilters.goldKarat.length > 0) {
            result = result.filter(product => 
                selectedFilters.goldKarat.includes(product.goldKarat?.toString())
            );
        }
        
        // Apply color filter
        if (selectedFilters.color.length > 0) {
            result = result.filter(product => selectedFilters.color.includes(product.color));
        }
        
        // Apply sorting
        switch(sortBy) {
            case 'price-low':
                result = result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result = result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                result = result.sort((a, b) => 
                    new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                );
                break;
            default: // 'featured'
                // Default sorting from API
                break;
        }
        
        setFilteredProducts(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [products, selectedFilters, priceRange, sortBy]);
    
    // Handle checkbox filter change
    const handleFilterChange = (type, value, checked) => {
        setSelectedFilters(prev => {
            if (checked) {
                return { ...prev, [type]: [...prev[type], value] };
            } else {
                return { ...prev, [type]: prev[type].filter(item => item !== value) };
            }
        });
    };
    
    // Price range handlers
    const handleMinPriceChange = (value) => {
        setPriceRange(prev => ({ ...prev, min: Number(value) }));
    };
    
    const handleMaxPriceChange = (value) => {
        setPriceRange(prev => ({ ...prev, max: Number(value) }));
    };
    
    // Reset all filters
    const resetFilters = () => {
        setSelectedFilters({
            brand: [],
            material: [],
            size: [],
            goldKarat: [],
            color: [],
        });
        
        if (products.length > 0) {
            const minPrice = Math.min(...products.map(p => p.price));
            const maxPrice = Math.max(...products.map(p => p.price));
            setPriceRange({ min: minPrice, max: maxPrice });
        } else {
            setPriceRange({ min: 0, max: 100000000 });
        }
        
        setSortBy('featured');
    };
    
    // Get current products for pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    // Change page
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // Formatted price display
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };
    
    // Toggle filter section in accordion
    const toggleFilterSection = (section) => {
        setActiveFilterSection(activeFilterSection === section ? null : section);
    };
    
    // Calculate active filter count
    const getActiveFilterCount = () => {
        return Object.values(selectedFilters).reduce((total, filters) => total + filters.length, 0) + 
               (priceRange.min > filters.priceRange.min || priceRange.max < filters.priceRange.max ? 1 : 0);
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-[#faf7f2]">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-amber-800 font-medium">Đang tải sản phẩm...</p>
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-serif font-medium text-gray-900 mb-3">Đã xảy ra lỗi</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
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

    return (
        <div className="bg-[#faf7f2] min-h-screen">
            <div className="container mx-auto px-4 py-12">
                {/* Category Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <h1 className="text-3xl md:text-4xl font-serif font-medium text-amber-900 mb-3">
                        {category?.name || 'Danh mục sản phẩm'}
                    </h1>
                    {category?.description && (
                        <p className="text-amber-800/70 max-w-2xl mx-auto">{category.description}</p>
                    )}
                </motion.div>

                {/* Mobile Filter Toggle Button */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="md:hidden mb-6"
                >
                    <button 
                        className="w-full flex items-center justify-between bg-white border border-amber-200 shadow-sm rounded-full py-3 px-6 text-amber-900 font-medium"
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                    >
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                            </svg>
                            <span>Lọc sản phẩm</span>
                        </span>
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
                            {getActiveFilterCount()}
                        </span>
                    </button>
                </motion.div>

                {/* Sort & Filter Results Container */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters - Desktop: always visible, Mobile: togglable */}
                    <AnimatePresence>
                        {(showMobileFilters || !window.matchMedia('(max-width: 768px)').matches) && (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="md:w-1/4 z-10"
                            >
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-amber-100">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-serif font-medium text-xl text-amber-900">Bộ lọc</h3>
                                        <button 
                                            className="text-sm text-amber-600 hover:text-amber-800 font-medium flex items-center"
                                            onClick={resetFilters}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Đặt lại
                                        </button>
                                    </div>
                                    
                                    {/* Mobile Close Button */}
                                    <div className="md:hidden mb-4 pb-4 border-b border-amber-100">
                                        <button 
                                            onClick={() => setShowMobileFilters(false)}
                                            className="w-full py-2 bg-amber-50 text-amber-700 rounded-full font-medium"
                                        >
                                            Xong
                                        </button>
                                    </div>
                                    
                                    {/* Filter Accordion */}
                                    <div className="space-y-4">
                                        {/* Price Range Filter */}
                                        <div className="border-b border-amber-100 pb-5">
                                            <button 
                                                onClick={() => toggleFilterSection('price')}
                                                className="flex w-full items-center justify-between text-left font-medium text-amber-900 mb-4"
                                            >
                                                <span>Khoảng giá</span>
                                                <svg 
                                                    xmlns="http://www.w3.org/2000/svg" 
                                                    className={`h-5 w-5 transform transition-transform ${activeFilterSection === 'price' ? 'rotate-180' : ''}`}
                                                    viewBox="0 0 20 20" 
                                                    fill="currentColor"
                                                >
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <div className={`space-y-4 transition-all ${activeFilterSection === 'price' ? 'block' : 'hidden md:block'}`}>
                                                <div className="flex items-center space-x-4 mb-2">
                                                    <div className="bg-amber-50 rounded-lg px-3 py-1.5 w-full text-center text-amber-900">
                                                        {formatPrice(priceRange.min)}
                                                    </div>
                                                    <span className="text-amber-800">-</span>
                                                    <div className="bg-amber-50 rounded-lg px-3 py-1.5 w-full text-center text-amber-900">
                                                        {formatPrice(priceRange.max)}
                                                    </div>
                                                </div>
                                                <div className="px-2">
                                                    <input 
                                                        type="range" 
                                                        min={filters.priceRange.min} 
                                                        max={filters.priceRange.max} 
                                                        value={priceRange.min}
                                                        onChange={(e) => handleMinPriceChange(e.target.value)}
                                                        className="w-full accent-amber-600"
                                                    />
                                                    <input 
                                                        type="range" 
                                                        min={filters.priceRange.min} 
                                                        max={filters.priceRange.max} 
                                                        value={priceRange.max}
                                                        onChange={(e) => handleMaxPriceChange(e.target.value)}
                                                        className="w-full accent-amber-600"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Brand Filter */}
                                        {filters.brands.length > 0 && (
                                            <div className="border-b border-amber-100 pb-5">
                                                <button 
                                                    onClick={() => toggleFilterSection('brand')}
                                                    className="flex w-full items-center justify-between text-left font-medium text-amber-900 mb-4"
                                                >
                                                    <span>Thương hiệu</span>
                                                    <svg 
                                                        xmlns="http://www.w3.org/2000/svg" 
                                                        className={`h-5 w-5 transform transition-transform ${activeFilterSection === 'brand' ? 'rotate-180' : ''}`}
                                                        viewBox="0 0 20 20" 
                                                        fill="currentColor"
                                                    >
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <div className={`space-y-1 max-h-40 overflow-y-auto pr-2 ${activeFilterSection === 'brand' ? 'block' : 'hidden md:block'}`}>
                                                    {filters.brands.map((brand, index) => (
                                                        <label 
                                                            key={index} 
                                                            className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-amber-50 ${
                                                                selectedFilters.brand.includes(brand) ? 'bg-amber-50' : ''
                                                            }`}
                                                        >
                                                            <input 
                                                                type="checkbox" 
                                                                checked={selectedFilters.brand.includes(brand)}
                                                                onChange={(e) => handleFilterChange('brand', brand, e.target.checked)}
                                                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
                                                            />
                                                            <span className="ml-2 text-amber-800">{brand}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Material Filter */}
                                        {filters.materials.length > 0 && (
                                            <div className="border-b border-amber-100 pb-5">
                                                <button 
                                                    onClick={() => toggleFilterSection('material')}
                                                    className="flex w-full items-center justify-between text-left font-medium text-amber-900 mb-4"
                                                >
                                                    <span>Chất liệu</span>
                                                    <svg 
                                                        xmlns="http://www.w3.org/2000/svg" 
                                                        className={`h-5 w-5 transform transition-transform ${activeFilterSection === 'material' ? 'rotate-180' : ''}`}
                                                        viewBox="0 0 20 20" 
                                                        fill="currentColor"
                                                    >
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <div className={`space-y-1 max-h-40 overflow-y-auto pr-2 ${activeFilterSection === 'material' ? 'block' : 'hidden md:block'}`}>
                                                    {filters.materials.map((material, index) => (
                                                        <label 
                                                            key={index} 
                                                            className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-amber-50 ${
                                                                selectedFilters.material.includes(material) ? 'bg-amber-50' : ''
                                                            }`}
                                                        >
                                                            <input 
                                                                type="checkbox" 
                                                                checked={selectedFilters.material.includes(material)}
                                                                onChange={(e) => handleFilterChange('material', material, e.target.checked)}
                                                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
                                                            />
                                                            <span className="ml-2 text-amber-800">{material}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Size Filter */}
                                        {filters.sizes.length > 0 && (
                                            <div className="border-b border-amber-100 pb-5">
                                                <button 
                                                    onClick={() => toggleFilterSection('size')}
                                                    className="flex w-full items-center justify-between text-left font-medium text-amber-900 mb-4"
                                                >
                                                    <span>Kích thước</span>
                                                    <svg 
                                                        xmlns="http://www.w3.org/2000/svg" 
                                                        className={`h-5 w-5 transform transition-transform ${activeFilterSection === 'size' ? 'rotate-180' : ''}`}
                                                        viewBox="0 0 20 20" 
                                                        fill="currentColor"
                                                    >
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <div className={`flex flex-wrap gap-2 ${activeFilterSection === 'size' ? 'block' : 'hidden md:block'}`}>
                                                    {filters.sizes.map((size, index) => (
                                                        <button
                                                            key={index}
                                                            className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                                                                selectedFilters.size.includes(size) 
                                                                    ? 'bg-amber-600 text-white' 
                                                                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                                                            }`}
                                                            onClick={() => {
                                                                const isSelected = selectedFilters.size.includes(size);
                                                                handleFilterChange('size', size, !isSelected);
                                                            }}
                                                        >
                                                            {size}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Gold Karat Filter */}
                                        {filters.goldKarats.length > 0 && (
                                            <div className="border-b border-amber-100 pb-5">
                                                <button 
                                                    onClick={() => toggleFilterSection('goldKarat')}
                                                    className="flex w-full items-center justify-between text-left font-medium text-amber-900 mb-4"
                                                >
                                                    <span>Tuổi vàng</span>
                                                    <svg 
                                                        xmlns="http://www.w3.org/2000/svg" 
                                                        className={`h-5 w-5 transform transition-transform ${activeFilterSection === 'goldKarat' ? 'rotate-180' : ''}`}
                                                        viewBox="0 0 20 20" 
                                                        fill="currentColor"
                                                    >
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <div className={`space-y-1 ${activeFilterSection === 'goldKarat' ? 'block' : 'hidden md:block'}`}>
                                                    {filters.goldKarats.map((karat, index) => (
                                                        <label 
                                                            key={index} 
                                                            className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-amber-50 ${
                                                                selectedFilters.goldKarat.includes(karat) ? 'bg-amber-50' : ''
                                                            }`}
                                                        >
                                                            <input 
                                                                type="checkbox" 
                                                                checked={selectedFilters.goldKarat.includes(karat)}
                                                                onChange={(e) => handleFilterChange('goldKarat', karat, e.target.checked)}
                                                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
                                                            />
                                                            <span className="ml-2 text-amber-800">{karat}K</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Color Filter */}
                                        {filters.colors.length > 0 && (
                                            <div>
                                                <button 
                                                    onClick={() => toggleFilterSection('color')}
                                                    className="flex w-full items-center justify-between text-left font-medium text-amber-900 mb-4"
                                                >
                                                    <span>Màu sắc</span>
                                                    <svg 
                                                        xmlns="http://www.w3.org/2000/svg" 
                                                        className={`h-5 w-5 transform transition-transform ${activeFilterSection === 'color' ? 'rotate-180' : ''}`}
                                                        viewBox="0 0 20 20" 
                                                        fill="currentColor"
                                                    >
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <div className={`flex flex-wrap gap-3 ${activeFilterSection === 'color' ? 'block' : 'hidden md:block'}`}>
                                                    {filters.colors.map((color, index) => {
                                                        const colorMap = {
                                                            "Gold": "bg-amber-400",
                                                            "White Gold": "bg-gray-300",
                                                            "Rose Gold": "bg-rose-300",
                                                            "Silver": "bg-gray-400",
                                                            "Platinum": "bg-gray-200",
                                                        };
                                                        
                                                        const bgColor = colorMap[color] || "bg-gray-500";
                                                        
                                                        return (
                                                            <button
                                                                key={index}
                                                                className={`w-10 h-10 rounded-full ${bgColor} shadow transition-transform hover:scale-110 ${
                                                                    selectedFilters.color.includes(color)
                                                                        ? 'ring-2 ring-offset-2 ring-amber-600'
                                                                        : ''
                                                                }`}
                                                                title={color}
                                                                onClick={() => {
                                                                    const isSelected = selectedFilters.color.includes(color);
                                                                    handleFilterChange('color', color, !isSelected);
                                                                }}
                                                            >
                                                                <span className="sr-only">{color}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Products Grid */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="md:w-3/4"
                    >
                        {/* Sort Controls */}
                        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-amber-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <p className="text-amber-800 font-medium mb-2 sm:mb-0">
                                {filteredProducts.length} sản phẩm
                            </p>
                            <div className="flex items-center">
                                <label htmlFor="sort" className="text-sm text-amber-700 mr-2">
                                    Sắp xếp theo:
                                </label>
                                <select
                                    id="sort"
                                    className="border-amber-200 rounded-lg bg-amber-50 text-sm focus:ring-amber-500 focus:border-amber-500 text-amber-800"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="featured">Nổi bật</option>
                                    <option value="price-low">Giá: Thấp đến cao</option>
                                    <option value="price-high">Giá: Cao đến thấp</option>
                                    <option value="newest">Mới nhất</option>
                                </select>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {currentProducts.map((product) => (
                                    <motion.div 
                                        key={product.id} 
                                        whileHover={{ y: -5 }}
                                        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100"
                                    >
                                        <Link to={`/catalog/product/${product.id}`} className="block relative">
                                            <div className="aspect-square overflow-hidden">
                                                {product.productImages && product.productImages.length > 0 ? (
                                                    <img
                                                        src={product.productImages.find(img => img.isPrimary)?.imageUrl || product.productImages[0].imageUrl}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 ease-out"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-amber-50 flex items-center justify-center">
                                                        <span className="text-amber-400">Không có hình ảnh</span>
                                                    </div>
                                                )}
                                            </div>
                                            {product.quantity < 1 && (
                                                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
                                                    Hết hàng
                                                </div>
                                            )}
                                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-full shadow-lg"
                                                    aria-label="Quick view"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </Link>
                                        <div className="p-4">
                                            <Link to={`/catalog/category/${product.categoryId}`} className="text-xs text-amber-600 font-medium hover:text-amber-800 transition-colors">
                                                {product.categoryName}
                                            </Link>
                                            <Link to={`/catalog/product/${product.id}`} className="block">
                                                <h3 className="mt-2 font-serif text-amber-900 font-medium hover:text-amber-700 transition-colors line-clamp-2 text-lg">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <div className="mt-3 flex justify-between items-center">
                                                <span className="text-amber-700 font-semibold">
                                                    {formatPrice(product.price)}
                                                </span>
                                                <button
                                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white transition-colors"
                                                    aria-label="Add to cart"
                                                    title="Thêm vào giỏ hàng"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white p-10 rounded-xl shadow-md border border-amber-100 text-center"
                            >
                                <div className="w-20 h-20 mx-auto mb-6 text-amber-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-serif font-medium text-amber-900 mb-3">Không tìm thấy sản phẩm</h3>
                                <p className="text-amber-700 max-w-md mx-auto mb-6">
                                    Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn. Vui lòng thử lại với các lựa chọn khác.
                                </p>
                                <button
                                    onClick={resetFilters}
                                    className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Đặt lại bộ lọc
                                </button>
                            </motion.div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center">
                                <nav className="flex items-center">
                                    <button
                                        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`w-10 h-10 flex items-center justify-center rounded-l-lg ${
                                            currentPage === 1 
                                                ? 'bg-amber-100 text-amber-400 cursor-not-allowed' 
                                                : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
                                        }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    
                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNumber = index + 1;
                                        
                                        // Show limited page numbers with ellipsis
                                        if (
                                            pageNumber === 1 || 
                                            pageNumber === totalPages || 
                                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => paginate(pageNumber)}
                                                    className={`w-10 h-10 flex items-center justify-center border-t border-b border-amber-200 ${
                                                        currentPage === pageNumber
                                                            ? 'bg-amber-600 text-white font-medium'
                                                            : 'bg-white text-amber-700 hover:bg-amber-50'
                                                    }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            );
                                        } else if (
                                            (pageNumber === 2 && currentPage > 3) ||
                                            (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                                        ) {
                                            return (
                                                <button key={index} className="w-10 h-10 flex items-center justify-center border-t border-b border-amber-200 bg-white text-amber-400">
                                                    ...
                                                </button>
                                            );
                                        }
                                        return null;
                                    })}
                                    
                                    <button
                                        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`w-10 h-10 flex items-center justify-center rounded-r-lg ${
                                            currentPage === totalPages 
                                                ? 'bg-amber-100 text-amber-400 cursor-not-allowed' 
                                                : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
                                        }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;