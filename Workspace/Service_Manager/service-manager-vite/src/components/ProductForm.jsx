import { useState, useEffect } from 'react';
import catalogService from 'container/catalogService';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    gender: 0,
    material: '',
    goldKarat: '',
    color: '',
    brand: '',
    categoryId: '',
    collectionId: '',
    viewCount: 0,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch categories and collections on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const [categoriesData, collectionsData] = await Promise.all([
          catalogService.getAllCategories(),
          catalogService.getAllCollections()
        ]);
        setCategories(categoriesData);
        setCollections(collectionsData);
      } catch (error) {
        console.error('Error fetching categories and collections:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Nếu đang chỉnh sửa sản phẩm, điền thông tin vào form
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        quantity: product.stock || 0,
        gender: product.gender || 0,
        material: product.material || '',
        goldKarat: product.goldKarat || '',
        color: product.color || '',
        brand: product.brand || '',
        categoryId: product.categoryId || product.category?.categoryId || '',
        collectionId: product.collectionId || product.collection?.collectionId || '',
        viewCount: product.viewCount || 0,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập tên sản phẩm';
    if (formData.price <= 0) newErrors.price = 'Giá phải lớn hơn 0';
    if (formData.quantity < 0) newErrors.quantity = 'Số lượng không được âm';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Convert số sang number
      const dataToSubmit = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.quantity),
        gender: Number(formData.gender),
        categoryId: formData.categoryId ? Number(formData.categoryId) : null,
        collectionId: formData.collectionId ? Number(formData.collectionId) : null,
      };
      
      await onSubmit(dataToSubmit);
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {isLoadingData ? (
          <div className="p-6 flex justify-center items-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
            <span className="ml-2">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Tên sản phẩm */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              
              {/* Mô tả */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Giá */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
              </div>
              
              {/* Số lượng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tồn kho
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
              </div>
              
              {/* Giới tính */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="0">Unisex</option>
                  <option value="1">Nam</option>
                  <option value="2">Nữ</option>
                </select>
              </div>
              
              {/* Chất liệu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chất liệu
                </label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Tuổi vàng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tuổi vàng
                </label>
                <input
                  type="text"
                  name="goldKarat"
                  value={formData.goldKarat}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Màu sắc */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Màu sắc
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thương hiệu
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Danh mục - Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Bộ sưu tập - Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bộ sưu tập
                </label>
                <select
                  name="collectionId"
                  value={formData.collectionId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">-- Chọn bộ sưu tập --</option>
                  {collections.map(collection => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i> Lưu
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductForm;