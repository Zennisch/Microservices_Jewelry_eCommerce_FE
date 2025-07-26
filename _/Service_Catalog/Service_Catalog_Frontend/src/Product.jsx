import React from 'react';
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Slider from "react-slick";
import { ShoppingCart, Bell, MessageCircle, User, Search } from "lucide-react";
import vectorIcon from "./assets/Diamond.png";
import logo from "./assets/logo.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const fillerCateImage = [
    { categoryId: 1, imageUrl: "https://cdn.pnj.io/images/promo/235/1200x450-nhan-t01-25.jpg" },
    { categoryId: 2, imageUrl: "https://cdn.pnj.io/images/promo/231/daychuyen-t12-24-1200x450.jpg" },
    { categoryId: 3, imageUrl: "https://cdn.pnj.io/images/promo/144/CAT-VongTay-1200x450.jpg" },
    { categoryId: 4, imageUrl: "https://cdn.pnj.io/images/promo/235/1200x450-bong-tai-t1-25.jpg" },
    { categoryId: 5, imageUrl: "https://cdn.pnj.io/images/promo/235/1200x450-nhan-t01-25.jpg" },
    { categoryId: 6, imageUrl: "https://cdn.pnj.io/images/promo/153/CHARM_1200_X_450.jpg" },
    { categoryId: 7, imageUrl: "https://cdn.pnj.io/images/promo/144/CAT-VongTay-1200x450.jpg" },
    { categoryId: 8, imageUrl: "https://cdn.pnj.io/images/promo/197/t1-24-matday-1200x450.jpg" },
    { categoryId: 9, imageUrl: "https://cdn.pnj.io/images/promo/146/Banner_Dayco_1200x450.jpg" },
    { categoryId: 10, imageUrl: "https://cdn.pnj.io/images/promo/132/banner-kieng-1200x450.jpg" },
];


const Product = () => {
    const [searchKeyword, setSearchKeyword] = useState("");

    const fetchSearchingProducts = () => {
        console.log("Tìm kiếm với từ khóa:", searchKeyword);
      };

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [gender, setGender] = useState("");
    const [price, setPrice] = useState("");
    const [material, setMaterial] = useState("");
    const [brand, setBrand] = useState("");
    const [onSale, setOnSale] = useState(false);
    const [size, setSize] = useState("");
    const [goldKarat, setGoldKarat] = useState("");
    const [color, setColor] = useState("");

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        draggable: false,
        swipe: false,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
        ]
    };

    const { categoryId } = useParams();
    const [categoryDetail, setCategoryDetail] = useState({});
    useEffect(() => {
        const fetchCategoryDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/category/detailCategory/${categoryId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCategoryDetail(data);
            } catch (error) {
                console.error('Failed to fetch category details:', error);
            }
        };

        fetchCategoryDetail();
    }, [categoryId]);

    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/product/listProductByCategory/${categoryId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data);
                setFilteredProducts(data);

            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };

        if (categoryId) {
            fetchProducts();
            console.log(filteredProducts)
        }
    }, [categoryId]);

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/category/listCategory');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const [brands, setBrands] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [goldKarats, setGoldKarats] = useState([]);
    const [colors, setColors] = useState([]);
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/product/listBrandByCategory/${categoryId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBrands(data);
            } catch (error) {
                console.error('Failed to fetch brands:', error);
            }
        };

        const fetchMaterials = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/product/listMaterialByCategory/${categoryId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMaterials(data);
            } catch (error) {
                console.error('Failed to fetch materials:', error);
            }
        }

        const fetchSizes = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/product/listSizeByCategory/${categoryId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSizes(data);
            } catch (error) {
                console.error('Failed to fetch sizes:', error);
            }
        }

        const fetchGoldKarats = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/product/listGoldKaratByCategory/${categoryId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGoldKarats(data);
            } catch (error) {
                console.error('Failed to fetch gold karat:', error);
            }
        };

        const fetchColors = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/product/listColorByCategory/${categoryId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setColors(data);
            } catch (error) {
                console.error('Failed to fetch colors:', error);
            }
        };

        if (categoryId) {
            fetchBrands();
            fetchMaterials();
            fetchSizes();
            fetchGoldKarats();
            fetchColors();
        }
    }, [categoryId]);

    const getFilterDisplayName = (type, value) => {
        switch (type) {
            case 'gender':
                const genderMap = {
                    '0': 'Nam',
                    '1': 'Nữ',
                    '2': 'Unisex'
                };
                return genderMap[value] || value;
            case 'price':
                const priceRanges = {
                    '0-1000000': 'Dưới 1 triệu',
                    '1000000-5000000': '1 - 5 triệu',
                    '5000000-10000000': '5 - 10 triệu',
                    '10000000': 'Trên 10 triệu'
                };
                return priceRanges[value];
            case 'material':
                return value.toUpperCase();
            case 'brand':
                return value.toUpperCase();
            case 'size':
                return `Size ${value}`;
            case 'goldKarat':
                return `${value}K`;
            case 'color':
                return `Color ${value}`;
            default:
                return value;
        }
    };

    const removeFilter = (filterType) => {
        switch (filterType) {
            case 'gender':
                setGender('');
                break;
            case 'price':
                setPrice('');
                break;
            case 'material':
                setMaterial('');
                break;
            case 'brand':
                setBrand('');
                break;
            case 'onSale':
                setOnSale(false);
                break;
            case 'size':
                setSize('');
                break;
            case 'goldKarat':
                setGoldKarat('');
                break;
            case 'color':
                setColor('');
                break;
        }
    };

    const applyFilters = () => {
        let filtered = [...products];

        if (searchTerm.trim()) {
            const normalizeText = (text) => {
                return text
                    .toLowerCase()
                    .normalize("NFD") // Chuẩn hóa chuỗi thành dạng Unicode tổ hợp
                    .replace(/[\u0300-\u036f]/g, ""); // Loại bỏ dấu
            };

            filtered = filtered.filter(product =>
                normalizeText(product.name).includes(normalizeText(searchTerm.trim()))
            );
        }

        if (gender) {
            filtered = filtered.filter(product =>
                product.gender.toString() === gender
            );
        }

        if (price) {
            filtered = filtered.filter(product => {
                if (!product.price) return false;

                const productPrice = typeof product.price === 'string'
                    ? parseFloat(product.price.replace(/[^\d]/g, ''))
                    : product.price;

                if (price === '10000000') {
                    return productPrice >= 10000000;
                }

                const [min, max] = price.split('-').map(Number);
                return productPrice >= min && productPrice <= max;
            });
        }

        if (material) {
            filtered = filtered.filter(product => product.material === material);
        }

        if (brand) {
            filtered = filtered.filter(product => product.brand === brand);
        }

        if (onSale) {
            filtered = filtered.filter(product => product.oldPrice);
        }

        if (size) {
            filtered = filtered.filter(product =>
                product.size && product.size.toString() === size
            );
        }

        if (goldKarat) {
            filtered = filtered.filter(product =>
                product.goldKarat && product.goldKarat.toString() === goldKarat
            );
        }

        if (color) {
            filtered = filtered.filter(product =>
                product.color && product.color.toLowerCase() === color.toLowerCase()
            );
        }


        setFilteredProducts(filtered);
    };

    const handleFilterChange = (filterType, value) => {
        switch (filterType) {
            case 'gender':
                setGender(value);
                break;
            case 'price':
                setPrice(value);
                break;
            case 'material':
                setMaterial(value);
                break;
            case 'brand':
                setBrand(value);
                break;
            case 'onSale':
                setOnSale(value);
                break;
            case 'size':
                setSize(value);
                break;
            case 'goldKarat':
                setGoldKarat(value);
                break;
            case 'color':
                setColor(value);
                break;
        }
    };

    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);

        const handler = setTimeout(() => {
            applyFilters();
            setIsLoading(false);
        }, 500);

        return () => {
            clearTimeout(handler); // Xóa timeout nếu dependencies thay đổi trước khi hết 1 giây
            setIsLoading(false);
        };
    }, [gender, price, material, brand, onSale, searchTerm, products, size, goldKarat, color]);

    return (
        <div className="min-h-screen bg-bgOuter px-10 py-6">
            <header className="header">
                <div className="flex justify-between items-center p-4">
                    <div className="flex gap-4">
                        <a href="#" className="flex items-center gap-1 text-white">
                            <ShoppingCart size={18} />
                            <span>Giỏ Hàng</span>
                        </a>
                        <a href="#" className="flex items-center gap-1 text-white">
                            <Bell size={18} />
                            <span>Liên Hệ</span>
                        </a>
                    </div>

                    <div className="w-24 md:w-32">
                        <img src={logo} alt="TINH TÚ" className="w-full" />
                    </div>

                    <div className="flex gap-4">
                        <a href="#" className="flex items-center gap-1 text-white">
                            <MessageCircle size={18} />
                            <span>Chat Bot</span>
                        </a>
                        <a href="#" className="flex items-center gap-1 text-white">
                            <User size={18} />
                            <span>Tài Khoản</span>
                        </a>
                    </div>
                </div>

                <div className="flex items-center justify-center my-4">
                    <div className="w-1/4 h-px bg-gray-500"></div>
                    <img src={vectorIcon} alt="Diamond Icon" className="w-8 mx-2" />
                    <div className="w-1/4 h-px bg-gray-500"></div>
                </div>

                <nav className="flex flex-col md:flex-row md:justify-between items-center gap-4 p-4">
                    <div className="flex flex-wrap gap-3">
                        <Link to="/" className="text-sm md:text-base hover:underline text-white">Trang Chủ</Link>
                        <Link to="/product/1" className="text-sm md:text-base hover:underline text-white">Trang Sức</Link>
                        <Link to="/product/2" className="text-sm md:text-base hover:underline text-white">Trang Sức Cưới</Link>
                        <Link to="/product/3" className="text-sm md:text-base hover:underline text-white">Đồng Hồ</Link>
                        <Link to="/product/4" className="text-sm md:text-base hover:underline text-white">Quà Tặng</Link>
                        <Link to="/collection" className="text-sm md:text-base hover:underline text-white">Bộ Sưu Tập</Link>
                    </div>

                    <div className="flex border rounded-lg overflow-hidden">
                        <input
                            type="text"
                            placeholder="Tìm kiếm"
                            className="px-3 py-2 w-40 md:w-60 text-black"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <button className="bg-blue-500 px-3 flex items-center text-white">
                            <Search size={18} />
                        </button>
                    </div>
                </nav>
            </header>
            <div className="text-white mb-4 flex justify-center py-4">
                <Link to="/" className="text-gray-400">Trang chủ </Link> / {categoryDetail.name}
            </div>
            {/*Banner thieu field sua sau*/}
            {/* <div className="mb-4 flex items-center justify-center px-4">
                <img src="https://cdn.pnj.io/images/promo/235/1200x450-nhan-t01-25.jpg" alt="Banner" className="w-full max-w-4xl rounded-md" />
            </div> */}
            <div className="mb-4 flex items-center justify-center px-4">
                {fillerCateImage.find((item) => item.categoryId === parseInt(categoryId)) ? (
                    <img
                        src={fillerCateImage.find((item) => item.categoryId === parseInt(categoryId)).imageUrl}
                        alt="Banner"
                        className="w-full max-w-4xl rounded-md"
                    />
                ) : (
                    <div className="w-full max-w-4xl h-40 bg-gray-300 rounded-md flex items-center justify-center">
                        <span className="text-gray-500">No Banner Available</span>
                    </div>
                )}
            </div>
            {/*Category*/}
            <div className="relative py-4 px-10" >
                <Slider {...settings} className="flex px-10 justify-between align-center">
                    {categories.map((category) => (
                        <Link to={`/product/${category.id}`} key={category.id} className="flex justify-between align-center">
                            <button className="px-2 py-2 border border-white text-white rounded-lg w-[155px] h-[70px]">
                                {category.name}
                            </button>
                        </Link>
                    ))}
                </Slider>
            </div>
            {/*Search*/}
            <div className="mb-4 flex items-center justify-center px-4 py-4 mb-2">
                <div className="relative w-full max-w-lg">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm tại đây"
                        className="pl-4 pr-12 py-2 w-full border border-white rounded-md bg-gray-400 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {isLoading ? (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                        </div>
                    ) : (
                        <div
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-md bg"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="white"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
            {/* Dropdown bộ lọc */}
            <div className="flex flex-wrap gap-2 px-10 mb-4">
                {/* Lọc theo giới tính */}
                <select
                    className="px-4 py-2 border border-white bg-gray-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                >
                    <option value="">Giới tính</option>
                    <option value="0">Nam</option>
                    <option value="1">Nữ</option>
                    <option value="2">Unisex</option>
                </select>

                {/* Lọc theo giá */}
                <select
                    className="px-4 py-2 border border-white bg-gray-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={price}
                    onChange={(e) => handleFilterChange('price', e.target.value)}
                >
                    <option value="">Khoảng giá</option>
                    <option value="0-1000000">Dưới 1 triệu</option>
                    <option value="1000000-5000000">1 - 5 triệu</option>
                    <option value="5000000-10000000">5 - 10 triệu</option>
                    <option value="10000000">Trên 10 triệu</option>
                </select>

                {/* Lọc theo chất liệu */}
                <select
                    className="px-4 py-2 border border-white bg-gray-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={material}
                    onChange={(e) => handleFilterChange('material', e.target.value)}
                >
                    <option value="">Chất liệu</option>
                    {materials.map((materialName) => (
                        <option key={materialName} value={materialName}>
                            {materialName}
                        </option>
                    ))}
                </select>

                {/* Lọc theo thương hiệu */}
                <select
                    className="px-4 py-2 border border-white bg-gray-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                >
                    <option value="">Thương hiệu</option>
                    {brands.map((brandName) => (
                        <option key={brandName} value={brandName}>
                            {brandName}
                        </option>
                    ))}
                </select>

                {/* Lọc theo size */}
                <select
                    className="px-4 py-2 border border-white bg-gray-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={size}
                    onChange={(e) => handleFilterChange('size', e.target.value)}
                >
                    <option value="">Size</option>
                    {sizes.map((sizeName) => (
                        <option key={sizeName} value={sizeName}>
                            {sizeName}
                        </option>
                    ))}
                </select>

                {/* Lọc theo độ tuổi vàng */}
                <select
                    className="px-4 py-2 border border-white bg-gray-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={goldKarat}
                    onChange={(e) => handleFilterChange('goldKarat', e.target.value)}
                >
                    <option value="">Độ tuổi vàng</option>
                    {goldKarats.map((goldKaratName) => (
                        <option key={goldKaratName} value={goldKaratName}>
                            {goldKaratName}K
                        </option>
                    ))}
                </select>

                {/* Lọc theo màu sắc */}
                <select
                    className="px-4 py-2 border border-white bg-gray-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={color}
                    onChange={(e) => handleFilterChange('color', e.target.value)}
                >
                    <option value="">Màu sắc</option>
                    {colors.map((colorName) => (
                        <option key={colorName} value={colorName}>
                            {colorName}
                        </option>
                    ))}
                </select>

                {/* Lọc theo khuyến mãi */}
                <label className="flex items-center text-white">
                    <input
                        type="checkbox"
                        className="mr-1 size-4"
                        checked={onSale}
                        onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                    />
                    Đang khuyến mãi
                </label>
            </div>
            {/* Danh sách các thuộc tính lọc đã chọn */}
            <div className="flex flex-wrap gap-2 px-10 my-4">
                {gender && (
                    <div className="flex items-center bg-gray-600 text-white px-3 py-1 rounded-full">
                        <span>{getFilterDisplayName('gender', gender)}</span>
                        <button onClick={() => removeFilter('gender')} className="ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                {price && (
                    <div className="flex items-center bg-gray-600 text-white px-3 py-1 rounded-full">
                        <span>{getFilterDisplayName('price', price)}</span>
                        <button onClick={() => removeFilter('price')} className="ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                {material && (
                    <div className="flex items-center bg-gray-600 text-white px-3 py-1 rounded-full">
                        <span>{getFilterDisplayName('material', material)}</span>
                        <button onClick={() => removeFilter('material')} className="ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                {brand && (
                    <div className="flex items-center bg-gray-600 text-white px-3 py-1 rounded-full">
                        <span>{getFilterDisplayName('brand', brand)}</span>
                        <button onClick={() => removeFilter('brand')} className="ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                {size && (
                    <div className="flex items-center bg-gray-600 text-white px-3 py-1 rounded-full">
                        <span>{getFilterDisplayName('size', size)}</span>
                        <button onClick={() => removeFilter('size')} className="ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                {goldKarat && (
                    <div className="flex items-center bg-gray-600 text-white px-3 py-1 rounded-full">
                        <span>{getFilterDisplayName('goldKarat', goldKarat)}</span>
                        <button onClick={() => removeFilter('goldKarat')} className="ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                {color && (
                    <div className="flex items-center bg-gray-600 text-white px-3 py-1 rounded-full">
                        <span>{getFilterDisplayName('color', color)}</span>
                        <button onClick={() => removeFilter('color')} className="ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                {onSale && (
                    <div className="flex items-center bg-gray-600 text-white px-3 py-1 rounded-full">
                        <span>Đang khuyến mãi</span>
                        <button onClick={() => removeFilter('onSale')} className="ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
            {/* List product */}
            <div className="grid grid-cols-4 gap-8 px-10">
                {filteredProducts.map((product) => {
                    const thumbnail = product.productImages.find(image => image.isThumbnail);
                    const imageUrl = thumbnail ? thumbnail.imageUrl : ' ';
                    return (
                        <a key={product.id} href={`/product/productDetail/${product.id}`} className="block">
                            <div className="bg-bgProduct rounded-lg shadow-md">
                                <img src={imageUrl} alt={product.name} className="w-full h-40 object-cover" />
                                {/* {imageUrl && (
                                    <img src={imageUrl} alt={product.name} className="w-full h-40 object-cover" />
                                )} */}
                                <div className="bg-black/80 p-2">
                                    <h3 className="text-white font-bold text-lg">{product.name}</h3>
                                    <div className="flex items-center mt-1">
                                        <span className="text-price text-base font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</span>
                                        <span className="text-gray-400 text-sm line-through ml-2">{product.oldPrice}</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
};


export default Product;