import React from "react";
import { FaShoppingCart, FaHeadphones, FaRobot, FaUser } from "react-icons/fa";
import Cart from "../screens/Cart";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

const Header: React.FC = () => {
  return (
    <header className="bg-[#1D1917] text-gray-300 py-4 px-6 md:px-16 flex items-center justify-between">
      {/* Bên trái */}
      <div className="flex items-center gap-8">
      <Link to="/cart" className="flex items-center gap-2 hover:text-white transition">
        <FaShoppingCart size={20} />
        <span>Giỏ Hàng</span>
        </Link>

        <a href="#" className="flex items-center gap-2 hover:text-white transition">
          <FaHeadphones size={20} />
          <span>Liên Hệ</span>
        </a>
      </div>

      {/* <div className="text-center">
        <div className="flex items-center justify-center">
          <div className="border border-gray-500 p-2 rounded-lg">
            <span className="text-xl font-bold tracking-wider">T</span>
          </div>
        </div>
        <p className="text-sm mt-1 tracking-widest">TINH TU</p>
      </div> */}
        <img src={Logo} alt="Mô tả hình ảnh" width={100} height={100} />

      {/* Bên phải */}
      <div className="flex items-center gap-8">
        <a href="#" className="flex items-center gap-2 hover:text-white transition">
          <FaRobot size={20} />
          <span>Chat Bot</span>
        </a>
        <a href="#" className="flex items-center gap-2 hover:text-white transition">
          <FaUser size={20} />
          <span>Tài Khoản</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
