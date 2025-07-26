import React, { useState } from "react";
import { Search } from "lucide-react";
import logo from "./assets/logo.png";
import vectorIcon from "./assets/Diamond.png";
import { ShoppingCart, Bell, MessageCircle, User, ChevronDown, ChevronUp, X } from "lucide-react";
import { Link } from "react-router-dom";

const AccountPage = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeMenu, setActiveMenu] = useState("profile");
  const [infoExpanded, setInfoExpanded] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalValue, setModalValue] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const openModal = (type, defaultValue) => {
    setModalType(type);
    setModalValue(defaultValue);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setModalValue("");
  };

  const saveModalValue = () => {
    console.log(`Đã lưu ${modalType}: ${modalValue}`);
    closeModal();
  };

  const openAddressModal = (address = null) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
  };

  const saveAddress = () => {
    console.log("Saving address:", editingAddress);
    closeAddressModal();
  };

  const setDefaultAddress = (addressId) => {
    console.log("Setting address as default:", addressId);
  };

  const EditModal = () => {
    if (!showModal) return null;

    let title = "";
    let inputType = "text";
    let placeholder = "";

    if (modalType === "email") {
      title = "Cập Nhật Email";
      inputType = "email";
      placeholder = "Nhập email mới";
    } else if (modalType === "phone") {
      title = "Cập Nhật Số Điện Thoại";
      inputType = "tel";
      placeholder = "Nhập số điện thoại mới";
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-bgInner p-6 rounded-lg w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button onClick={closeModal} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <div className="mb-4">
            <input
              type={inputType}
              value={modalValue}
              onChange={(e) => setModalValue(e.target.value)}
              placeholder={placeholder}
              className="w-full p-3 bg-gray-800 rounded border border-gray-700"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button 
              onClick={closeModal}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Hủy
            </button>
            <button 
              onClick={saveModalValue}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AddressModal = () => {
    if (!showAddressModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-bgInner p-6 rounded-lg w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{editingAddress ? "Chỉnh Sửa Địa Chỉ" : "Thêm Địa Chỉ Mới"}</h2>
            <button onClick={closeAddressModal} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Địa Chỉ</label>
              <input 
                type="text" 
                defaultValue={editingAddress?.street || ""}
                className="w-full p-3 bg-gray-800 rounded border border-gray-700" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phường/Xã</label>
              <input 
                type="text" 
                defaultValue={editingAddress?.ward || ""}
                className="w-full p-3 bg-gray-800 rounded border border-gray-700" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Quận/Huyện</label>
              <input 
                type="text" 
                defaultValue={editingAddress?.district || ""}
                className="w-full p-3 bg-gray-800 rounded border border-gray-700" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tỉnh/Thành Phố</label>
              <input 
                type="text" 
                defaultValue={editingAddress?.city || ""}
                className="w-full p-3 bg-gray-800 rounded border border-gray-700" 
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button 
              onClick={closeAddressModal}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Hủy
            </button>
            <button 
              onClick={saveAddress}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "profile":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-4">Hồ Sơ Cá Nhân</h1>
            <div className="bg-bgInner p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Họ Tên</label>
                  <input type="text" defaultValue="Nguyễn Văn A" className="w-full p-3 bg-gray-800 rounded border border-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ngày Sinh</label>
                  <input type="date" defaultValue="1990-01-01" className="w-full p-3 bg-gray-800 rounded border border-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Số Điện Thoại</label>
                  <div 
                    className="w-full p-3 bg-gray-800 rounded border border-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-700"
                    onClick={() => openModal("phone", "0123456789")}
                  >
                    <span>0123456789</span>
                    <span className="text-blue-400 text-sm">Chỉnh sửa</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div 
                    className="w-full p-3 bg-gray-800 rounded border border-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-700"
                    onClick={() => openModal("email", "example@email.com")}
                  >
                    <span>example@email.com</span>
                    <span className="text-blue-400 text-sm">Chỉnh sửa</span>
                  </div>
                </div>
              </div>
              <button className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded">Cập Nhật</button>
            </div>
          </div>
        );
        case "address":
          return (
            <div>
              <h1 className="text-3xl font-bold mb-4">Địa Chỉ</h1>
              <div className="bg-bgInner p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Danh Sách Địa Chỉ</h2>
                  <button 
                    onClick={() => openAddressModal()} 
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded flex items-center gap-2"
                  >
                    <span>Thêm Địa Chỉ Mới</span>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="border border-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-bold">123 Đường ABC, Phường DEF, Quận GHI, TP HCM</span>
                          <span className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded">Mặc định</span>
                        </div>
                        <div className="text-gray-400">Nguyễn Văn A | 0123456789</div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openAddressModal({
                            id: 1,
                            street: "123 Đường ABC",
                            ward: "Phường DEF",
                            district: "Quận GHI",
                            city: "TP HCM",
                            isDefault: true
                          })} 
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded"
                        >
                          Chỉnh sửa
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <div className="mb-1">
                          <span className="font-bold">456 Đường XYZ, Phường KLM, Quận NOP, Hà Nội</span>
                        </div>
                        <div className="text-gray-400">Nguyễn Văn A | 0123456789</div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setDefaultAddress(2)} 
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded"
                        >
                          Đặt làm mặc định
                        </button>
                        <button 
                          onClick={() => openAddressModal({
                            id: 2,
                            street: "456 Đường XYZ",
                            ward: "Phường KLM",
                            district: "Quận NOP",
                            city: "Hà Nội",
                            isDefault: false
                          })} 
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded"
                        >
                          Chỉnh sửa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
      case "password":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-4">Đổi Mật Khẩu</h1>
            <div className="bg-bgInner p-6 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mật Khẩu Hiện Tại</label>
                  <input type="password" className="w-full p-3 bg-gray-800 rounded border border-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mật Khẩu Mới</label>
                  <input type="password" className="w-full p-3 bg-gray-800 rounded border border-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Xác Nhận Mật Khẩu Mới</label>
                  <input type="password" className="w-full p-3 bg-gray-800 rounded border border-gray-700" />
                </div>
              </div>
              <button className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded">Cập Nhật Mật Khẩu</button>
            </div>
          </div>
        );
      
        case "favorites":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-4">Sản Phẩm Yêu Thích</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: 1,
                  name: "Nhẫn Kim Cương Emerald Cut",
                  price: 32500000,
                  image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlhbW9uZCUyMHJpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60"
                },
                {
                  id: 2,
                  name: "Vòng Tay Kim Cương Infinity",
                  price: 18900000,
                  image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZGlhbW9uZCUyMGJyYWNlbGV0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60"
                },
                {
                  id: 3,
                  name: "Bông Tai Ngọc Trai Akoya",
                  price: 12450000,
                  image: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGVhcmwlMjBlYXJyaW5nc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60"
                },
                {
                  id: 4,
                  name: "Dây Chuyền Bạch Kim Pendant",
                  price: 15800000,
                  image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZGlhbW9uZCUyMG5lY2tsYWNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60"
                },
                {
                  id: 5,
                  name: "Nhẫn Sapphire Xanh Royal",
                  price: 27600000,
                  image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2FwcGhpcmUlMjByaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60"
                }
              ].map((item) => (
                <div key={item.id} className="bg-bgInner p-4 rounded-lg">
                  <div className="aspect-square mb-3 rounded overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  <p className="text-gray-400">{item.price.toLocaleString()} ₫</p>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded">Thêm vào giỏ</button>
                    <button className="px-3 py-2 text-sm bg-red-600 hover:bg-red-700 rounded">Xóa</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "history":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-4">Lịch Sử Đơn Hàng</h1>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-bgInner">
                    <th className="p-3 text-left">Mã đơn hàng</th>
                    <th className="p-3 text-left">Ngày</th>
                    <th className="p-3 text-left">Sản phẩm</th>
                    <th className="p-3 text-left">Tổng tiền</th>
                    <th className="p-3 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4].map((order) => (
                    <tr key={order} className="border-b border-gray-700">
                      <td className="p-3">ORD-{1000 + order}</td>
                      <td className="p-3">20/04/2025</td>
                      <td className="p-3">Sản phẩm #{order}</td>
                      <td className="p-3">{(order * 1500000).toLocaleString()} ₫</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${order % 2 === 0 ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                          {order % 2 === 0 ? 'Hoàn thành' : 'Đang giao'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "support":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-4">Hỗ Trợ</h1>
            <div className="bg-bgInner p-6 rounded-lg">
              <p className="mb-4">Nếu bạn có bất kỳ câu hỏi hoặc vấn đề nào, vui lòng điền vào mẫu bên dưới:</p>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Tiêu đề</label>
                <input type="text" placeholder="Nhập tiêu đề" className="w-full p-3 bg-gray-800 rounded border border-gray-700" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nội dung</label>
                <textarea rows="5" placeholder="Mô tả vấn đề của bạn" className="w-full p-3 bg-gray-800 rounded border border-gray-700"></textarea>
              </div>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded">Gửi yêu cầu</button>
            </div>
          </div>
        );
      case "logout":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-4">Đăng Xuất</h1>
            <div className="bg-bgInner p-6 rounded-lg text-center">
              <p className="mb-4">Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?</p>
              <div className="flex justify-center gap-4">
                <button className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded">Đăng xuất</button>
                <button onClick={() => setActiveMenu("profile")} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded">Hủy</button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div>
            <h1 className="text-3xl font-bold mb-4">Tài Khoản</h1>
            <p className="text-gray-300">Đây là trang tài khoản của bạn. Bạn có thể quản lý thông tin cá nhân, xem lịch sử giao dịch, và nhiều hơn nữa.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-bgOuter text-white">
      <EditModal />
      <AddressModal />
      
      <header className="header bg-bgOuter shadow-md">
        <div className="flex justify-between items-center p-4">
          <div className="flex gap-4">
            <Link to="/cart" className="flex items-center gap-1 hover:text-blue-400">
              <ShoppingCart size={18} />
              <span>Giỏ Hàng</span>
            </Link>
            <Link to="/contact" className="flex items-center gap-1 hover:text-blue-400">
              <Bell size={18} />
              <span>Liên Hệ</span>
            </Link>
          </div>

          <div className="w-24 md:w-32">
            <img src={logo} alt="TINH TÚ" className="w-full" />
          </div>

          <div className="flex gap-4">
            <Link to="/chatbot" className="flex items-center gap-1 hover:text-blue-400">
              <MessageCircle size={18} />
              <span>Chat Bot</span>
            </Link>
            <Link to="/account" className="flex items-center gap-1 hover:text-blue-400">
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
      </header>

      <div className="flex">
        <div className="w-1/4 bg-bgOuter p-6 border-r border-gray-700">
          <ul className="space-y-4">
            <li>
              <div 
                className="flex items-center justify-between cursor-pointer text-lg font-semibold"
                onClick={() => setInfoExpanded(!infoExpanded)}
              >
                <span className={`${activeMenu === "profile" || activeMenu === "address" || activeMenu === "password" ? "text-blue-400" : "hover:text-blue-400"}`}>
                  Thông tin
                </span>
                {infoExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              
              {infoExpanded && (
                <ul className="pl-4 mt-2 space-y-2">
                  <li>
                    <a 
                      href="#" 
                      className={`block text-md ${activeMenu === "profile" ? "text-blue-400" : "hover:text-blue-400"}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveMenu("profile");
                      }}
                    >
                      Hồ sơ
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className={`block text-md ${activeMenu === "address" ? "text-blue-400" : "hover:text-blue-400"}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveMenu("address");
                      }}
                    >
                      Địa chỉ
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className={`block text-md ${activeMenu === "password" ? "text-blue-400" : "hover:text-blue-400"}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveMenu("password");
                      }}
                    >
                      Đổi mật khẩu
                    </a>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <a 
                href="#" 
                className={`block text-lg font-semibold ${activeMenu === "favorites" ? "text-blue-400" : "hover:text-blue-400"}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveMenu("favorites");
                }}
              >
                Yêu thích
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`block text-lg font-semibold ${activeMenu === "history" ? "text-blue-400" : "hover:text-blue-400"}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveMenu("history");
                }}
              >
                Lịch sử
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`block text-lg font-semibold ${activeMenu === "support" ? "text-blue-400" : "hover:text-blue-400"}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveMenu("support");
                }}
              >
                Hỗ trợ
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`block text-lg font-semibold ${activeMenu === "logout" ? "text-red-400" : "text-red-500 hover:text-red-400"}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveMenu("logout");
                }}
              >
                Đăng xuất
              </a>
            </li>
          </ul>
        </div>

        <div className="flex-1 p-10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;