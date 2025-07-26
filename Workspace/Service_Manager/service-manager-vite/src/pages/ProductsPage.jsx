import { useState, useEffect } from 'react';
import managerService from 'container/managerService';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortColumn, setSortColumn] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const pageSize = 10;

  useEffect(() => {
    fetchProducts();
  }, [page, searchKeyword, sortColumn, sortDirection]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await managerService.getAllProducts(
        searchKeyword,
        sortColumn,
        sortDirection,
        page,
        pageSize
      );
      setProducts(response.products);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0); // Reset về trang đầu tiên khi tìm kiếm
    fetchProducts();
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setPage(0);
  };

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    
    try {
      await managerService.deleteProduct(productId);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại sau.');
    }
  };

  const handleFormSubmit = async (productData) => {
    try {
      if (currentProduct) {
        await managerService.updateProduct(currentProduct.productId, productData);
      } else {
        await managerService.createProduct(productData);
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Có lỗi xảy ra khi lưu sản phẩm. Vui lòng thử lại sau.');
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý sản phẩm</h1>
        <button
          onClick={handleAddProduct}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <i className="fas fa-plus mr-2"></i> Thêm sản phẩm
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md"
          >
            <i className="fas fa-search mr-2"></i> Tìm kiếm
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          <i className="fas fa-exclamation-circle mr-2"></i> {error}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <ProductTable
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          page={page}
          totalPages={totalPages}
          onPageChange={handleChangePage}
        />
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={currentProduct}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default ProductsPage;