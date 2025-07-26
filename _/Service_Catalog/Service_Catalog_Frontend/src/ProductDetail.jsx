import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart, Bell, MessageCircle, User } from "lucide-react";
import { Search } from "lucide-react";
import logo from "./assets/logo.png";
import vectorIcon from "./assets/Diamond.png";

const ProductDetail = () => {
  const { productId } = useParams();
  const [currentProduct, setCurrentProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/product/detailProduct/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const product = await response.json();
        setCurrentProduct(product);
        setSelectedImage(product.image || product.productImages?.[0]?.imageUrl);

        const similarResponse = await fetch(`http://localhost:8080/api/product/listSimilarProducts/${productId}`);
        if (!similarResponse.ok) {
          throw new Error("Failed to fetch similar products");
        }
        const similar = await similarResponse.json();
        setSimilarProducts(similar.slice(0, 5));
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [productId]);

  if (!currentProduct) {
    return <div className="text-white text-center">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="bg-bgOuter text-white min-h-screen">
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
            <a href="#" className="flex items-center gap-1">
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
            />
            <button className="bg-blue-500 px-3 flex items-center">
              <Search size={18} />
            </button>
          </div>
        </nav>
      </header>

      <div className="p-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-10">
          <div className="flex">
            <div className="flex flex-col gap-2 mr-4">
              {currentProduct.productImages?.map((img, index) => (
                <button
                  key={index}
                  className="w-16 h-16 bg-gray-700 rounded overflow-hidden"
                  onClick={() => setSelectedImage(img.imageUrl)}
                >
                  <img
                    src={img.imageUrl}
                    alt="thumbnail"
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>
            <div className="flex-1 flex items-center justify-center">
              <img
                src={selectedImage}
                alt={currentProduct.name}
                className="max-w-full max-h-[500px] object-contain rounded-lg"
              />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-200">{currentProduct.name}</h1>
            <p className="italic text-gray-400 mb-2">Mã sản phẩm: {currentProduct.id || "Không có mã"}</p>
            <p className="text-2xl font-semibold text-white mb-4">{currentProduct.price}</p>
            <p className="text-gray-400 mb-4">{currentProduct.description || "Không có mô tả"}</p>
            
            <div className="flex items-center gap-2 mb-6">
              <span>Số lượng trong kho:</span>
              <span className="text-white">{currentProduct.stock || "Không có thông tin"}</span>
            </div>
            
            <div className="flex gap-4">
              <button className="bg-red-500 w-full py-3 rounded text-white font-bold text-lg">Mua ngay</button>
            </div>
            <div className="flex gap-4 mt-2">
              <button className="bg-blue-500 w-1/2 py-3 rounded text-white font-bold text-lg">Thêm vào giỏ hàng</button>
              <button className="bg-blue-500 w-1/2 py-3 rounded text-white font-bold text-lg">Gọi tư vấn</button>
            </div>
          </div>
        </div>

        <div className="mt-10 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Thông Tin Sản Phẩm</h2>
          <div className="text-gray-300">
            <p>
              Giới tính:{" "}
              {currentProduct.gender === 1
                ? "Nam"
                : currentProduct.gender === 2
                ? "Nữ"
                : "Không xác định"}
            </p>
            <p>Chất liệu: {currentProduct.material || "Không có thông tin"}</p>
            <p>Màu sắc: {currentProduct.color || "Không có thông tin"}</p>
            <p>Thương hiệu: {currentProduct.brand || "Không có thông tin"}</p>
            <p>Bộ sưu tập: {currentProduct.collectionid || "Không có thông tin"}</p>
            <p>Kích thước: {currentProduct.size || "Không có thông tin"}</p>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-6">Sản phẩm tương tự</h2>
          <div className="grid grid-cols-5 gap-6 justify-center">
            {similarProducts.map((item) => (
              <Link
                key={item.id}
                to={`/product/productDetail/${item.id}`}
                className="block bg-gray-800 p-4 rounded text-center"
              >
                <img src={item.image || item.productImages?.[0]?.imageUrl} alt={item.name} className="w-full rounded" />
                <p className="mt-2 font-semibold">{item.name}</p>
                <p className="text-red-500 font-bold">{item.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;