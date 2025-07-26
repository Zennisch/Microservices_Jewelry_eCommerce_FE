import { Link } from 'react-router-dom';

interface NavigationProps {
    scrolled: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ scrolled }) => {
    return (
        <nav
            className={`${
                scrolled ? 'mt-1' : 'mt-3'
            } transition-all duration-300 border-t border-gray-100 pt-2 hidden md:block`}
        >
            <ul className="flex justify-center space-x-10 text-sm font-medium">
                <li>
                    <Link
                        to="/"
                        className="text-gray-800 hover:text-amber-600 transition py-1 border-b-2 border-transparent hover:border-amber-600"
                    >
                        Trang Chủ
                    </Link>
                </li>
                <li>
                    <Link
                        to="/catalog/collections"
                        className="text-gray-800 hover:text-amber-600 transition py-1 border-b-2 border-transparent hover:border-amber-600"
                    >
                        Bộ Sưu Tập
                    </Link>
                </li>
                <li>
                    <Link
                        to="/catalog/categories"
                        className="text-gray-800 hover:text-amber-600 transition py-1 border-b-2 border-transparent hover:border-amber-600"
                    >
                        Danh mục
                    </Link>
                </li>
                <li>
                    <Link
                        to="/catalog/category/639"
                        className="text-gray-800 hover:text-amber-600 transition py-1 border-b-2 border-transparent hover:border-amber-600"
                    >
                        Nhẫn
                    </Link>
                </li>
                <li>
                    <Link
                        to="/catalog/category/640"
                        className="text-gray-800 hover:text-amber-600 transition py-1 border-b-2 border-transparent hover:border-amber-600"
                    >
                        Dây Chuyền
                    </Link>
                </li>
                <li>
                    <Link
                        to="/catalog/category/646"
                        className="text-gray-800 hover:text-amber-600 transition py-1 border-b-2 border-transparent hover:border-amber-600"
                    >
                        Vòng Tay
                    </Link>
                </li>
                <li>
                    <Link
                        to="/catalog/category/643"
                        className="text-gray-800 hover:text-amber-600 transition py-1 border-b-2 border-transparent hover:border-amber-600"
                    >
                        Bông Tai
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;