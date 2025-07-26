import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Bell, MessageCircle, User, Search } from "lucide-react";
import vectorIcon from "./assets/Diamond.png";
import logo from "./assets/logo.png";
import banner from "./assets/banner.png";
import ringImage from "./assets/ring.png";
import earringImage from "./assets/earring.png";
import necklaceImage from "./assets/necklace.png";
import braceletImage from "./assets/bracelet.png";

const HomePage = () => {
  const [searchKeyword, setSearchKeyword] = useState("");

  const products = [
    { id: 1, name: "Nhẫn Vàng", price: "3.800.000đ", image: "https://picsum.photos/id/1/200" },
    { id: 2, name: "Khuyên Tai", price: "2.500.000đ", image: "https://picsum.photos/id/1/200" },
    { id: 3, name: "Vòng Cổ", price: "5.200.000đ", image: "https://picsum.photos/id/1/200" },
    { id: 4, name: "Lắc Tay", price: "4.000.000đ", image: "https://picsum.photos/id/1/200" },
    { id: 5, name: "Nhẫn Kim Cương", price: "10.000.000đ", image: "https://picsum.photos/id/1/200" },
    { id: 6, name: "Dây Chuyền", price: "6.500.000đ", image: "https://picsum.photos/id/1/200" },
  ];

  const bestSellingProducts = products.slice(0, 5);

  const categories = [
    { name: "Nhẫn", image: ringImage, link: "/product/1" },
    { name: "Khuyên Tai", image: earringImage, link: "/product/2" },
    { name: "Vòng Cổ", image: necklaceImage, link: "/product/3" },
    { name: "Lắc Tay", image: braceletImage, link: "/product/4" },
  ];

  const fetchProducts = () => {
    console.log("Tìm kiếm với từ khóa:", searchKeyword);
  };

  return (
    <div className="min-h-screen bg-bgOuter text-white px-10 py-6">
      <header className="header">
        <div className="flex justify-between items-center p-4">
          <div className="flex gap-4">
          <a href="#" className="flex items-center gap-1">
              <ShoppingCart size={18} />
              <span>Giỏ Hàng</span>
            </a>
            <a href="#" className="flex items-center gap-1">
              <Bell size={18} />
              <span>Liên Hệ</span>
            </a>
          </div>

          <div className="w-24 md:w-32">
            <img src={logo} alt="TINH TÚ" className="w-full" />
          </div>

          <div className="flex gap-4">
            <a href="#" className="flex items-center gap-1">
              <MessageCircle size={18} />
              <span>Chat Bot</span>
            </a>
            <Link to="/account" className="flex items-center gap-1">
              <User size={18} />
              <span>Tài Khoản</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center my-4">
          <div className="w-1/4 h-px bg-gray-500"></div>
          <img src={vectorIcon} alt="Diamond Icon" className="w-8 mx-2" />
          <div className="w-1/4 h-px bg-gray-500"></div>
        </div>

        <nav className="flex flex-col md:flex-row md:justify-between items-center gap-4 p-4">
          <div className="flex flex-wrap gap-3">
            <Link to="/" className="text-sm md:text-base hover:underline">Trang Chủ</Link>
            <Link to="/product/1" className="text-sm md:text-base hover:underline">Trang Sức</Link>
            <Link to="/product/2" className="text-sm md:text-base hover:underline">Trang Sức Cưới</Link>
            <Link to="/product/3" className="text-sm md:text-base hover:underline">Đồng Hồ</Link>
            <Link to="/product/4" className="text-sm md:text-base hover:underline">Quà Tặng</Link>
            <Link to="/collection" className="text-sm md:text-base hover:underline">Bộ Sưu Tập</Link>
          </div>

          <div className="flex border rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="px-3 py-2 w-40 md:w-60 text-black"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button className="bg-blue-500 px-3 flex items-center" onClick={fetchProducts}>
              <Search size={18} />
            </button>
          </div>
        </nav>
      </header>

      <div className="relative w-full my-7">
        <img src={banner} alt="Banner" className="w-full rounded-lg object-cover" />
      </div>

      <div className="text-center mt-10">
        <h2 className="text-2xl md:text-3xl font-bold">Tìm Kiếm</h2>
        <p className="text-gray-400">Tìm Kiếm Trang Sức Theo Mong Muốn Của Bạn</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {categories.map((category, index) => (
          <Link key={index} to={category.link} className="block text-center">
            <div className="relative">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-60 rounded-lg object-cover"
              />
              <p className="absolute bottom-2 left-0 right-0 text-white font-bold bg-black/50 py-1">
                {category.name}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center">Trang Sức Bán Chạy</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {bestSellingProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/productDetail/${product.id}`}
              className="block bg-gray-800 p-4 rounded text-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 rounded object-cover"
              />
              <p className="mt-2 font-semibold">{product.name}</p>
              <p className="text-red-500 font-bold">{product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;