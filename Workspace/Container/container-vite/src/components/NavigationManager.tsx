import { NavLink } from 'react-router-dom';
import { useState } from 'react';

interface NavigationManagerProps {
  scrolled?: boolean;
}

const NavigationManager: React.FC<NavigationManagerProps> = ({ scrolled = false }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Sử dụng các route tương tự như trong Sidebar
  const navItems = [
    { name: 'Sản phẩm', path: '/manager', icon: 'fas fa-box-open' },
    { name: 'Bộ sưu tập', path: '/manager/categories', icon: 'fas fa-folder-open' },
    { name: 'Đơn hàng', path: '/manager/orders', icon: 'fas fa-shopping-cart' },
    { name: 'Thống kê', path: '/manager/dashboard', icon: 'fas fa-chart-line' },
  ];

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        className={`${
          scrolled ? 'mt-1 py-1' : 'mt-3 py-2'
        } transition-all duration-300 border-t border-gray-700 hidden lg:block`}
      >
        <ul className="flex justify-center space-x-8">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-gray-700 text-amber-400' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-amber-300'
                  }`
                }
                end={item.path === '/manager'}
              >
                <i className={`${item.icon} mr-2`}></i>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
          <li>
            <a 
              href="/" 
              className="flex items-center px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-amber-300 transition-colors"
            >
              <i className="fas fa-home mr-2"></i>
              <span>Trang chủ</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Mobile Navigation Toggle Button */}
      <div className="lg:hidden flex justify-end mt-2">
        <button
          onClick={toggleMobileMenu}
          className="text-gray-300 hover:text-amber-400 focus:outline-none"
          aria-label="Toggle menu"
        >
          <i className={`fas ${showMobileMenu ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 lg:hidden">
          <div className="h-full w-64 bg-gray-800 shadow-lg overflow-y-auto">
            <div className="p-4 flex justify-between items-center border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Menu Quản Trị</h2>
              <button
                onClick={toggleMobileMenu}
                className="text-gray-300 hover:text-amber-400 focus:outline-none"
                aria-label="Close menu"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <nav className="p-4">
              {navItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  onClick={toggleMobileMenu}
                  className={({ isActive }) => 
                    `flex items-center py-3 px-4 rounded-lg transition-colors mb-2 ${
                      isActive 
                        ? 'bg-gray-700 text-amber-400' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-amber-300'
                    }`
                  }
                  end={item.path === '/manager'}
                >
                  <i className={`${item.icon} w-5 mr-3`}></i>
                  <span>{item.name}</span>
                </NavLink>
              ))}
              <div className="border-t border-gray-700 pt-4 mt-4">
                <a 
                  href="/" 
                  className="flex items-center py-3 px-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-amber-300 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <i className="fas fa-home w-5 mr-3"></i>
                  <span>Về trang chủ</span>
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationManager;