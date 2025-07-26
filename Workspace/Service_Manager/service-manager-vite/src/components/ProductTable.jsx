import { useState } from 'react';
import managerService from 'container/managerService';

const ProductTable = ({ 
  products, 
  onEdit, 
  onDelete, 
  onSort, 
  sortColumn, 
  sortDirection,
  page,
  totalPages,
  onPageChange
}) => {
  const [productIdToUpdateStock, setProductIdToUpdateStock] = useState(null);
  const [newStock, setNewStock] = useState(0);

  // Format giá tiền
  const formatPrice = (price) => {
    return managerService.formatProductPrice(price);
  };

  // Format ngày
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Render sort icon
  const renderSortIcon = (column) => {
    if (sortColumn !== column) return <i className="fas fa-sort ml-1 text-gray-400"></i>;
    if (sortDirection === 'asc') return <i className="fas fa-sort-up ml-1 text-amber-500"></i>;
    return <i className="fas fa-sort-down ml-1 text-amber-500"></i>;
  };

  // Handle stock update
  const handleUpdateStock = async (productId) => {
    try {
      await managerService.updateProductStock(productId, parseInt(newStock));
      // Refresh product list would happen here in a real implementation
      alert('Cập nhật tồn kho thành công!');
      setProductIdToUpdateStock(null);
    } catch (err) {
      console.error('Error updating stock:', err);
      alert('Có lỗi xảy ra khi cập nhật tồn kho.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSort('id')}
              >
                <div className="flex items-center">
                  ID {renderSortIcon('id')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hình ảnh
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center">
                  Tên sản phẩm {renderSortIcon('name')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSort('price')}
              >
                <div className="flex items-center">
                  Giá {renderSortIcon('price')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSort('quantity')}
              >
                <div className="flex items-center">
                  Tồn kho {renderSortIcon('quantity')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSort('updatedAt')}
              >
                <div className="flex items-center">
                  Cập nhật {renderSortIcon('updatedAt')}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.productId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.productId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img 
                      className="h-10 w-10 rounded-md object-cover" 
                      src={managerService.getProductPrimaryImageUrl(product)} 
                      alt={product.name} 
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatPrice(product.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {productIdToUpdateStock === product.productId ? (
                    <div className="flex items-center space-x-2">
                      <input 
                        type="number"
                        className="w-20 border border-gray-300 rounded px-2 py-1"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        min="0"
                      />
                      <button 
                        onClick={() => handleUpdateStock(product.productId)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button 
                        onClick={() => setProductIdToUpdateStock(null)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className={product.stock <= 5 ? 'text-red-500 font-medium' : ''}>
                        {product.stock}
                      </span>
                      <button 
                        onClick={() => {
                          setProductIdToUpdateStock(product.productId);
                          setNewStock(product.stock);
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        title="Cập nhật tồn kho"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(product.updatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <i className="fas fa-edit"></i> Sửa
                  </button>
                  <button
                    onClick={() => onDelete(product.productId)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <i className="fas fa-trash"></i> Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div className="flex-1 flex justify-between items-center">
          <button
            onClick={() => onPageChange(Math.max(0, page - 1))}
            disabled={page === 0}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              page === 0 
                ? 'text-gray-300 bg-gray-100 cursor-not-allowed' 
                : 'text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-chevron-left mr-2"></i> Trước
          </button>
          
          <span className="text-sm text-gray-700">
            Trang <span className="font-medium">{page + 1}</span> / <span className="font-medium">{totalPages || 1}</span>
          </span>
          
          <button
            onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              page >= totalPages - 1 
                ? 'text-gray-300 bg-gray-100 cursor-not-allowed' 
                : 'text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            Tiếp <i className="fas fa-chevron-right ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;