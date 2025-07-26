import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { apiService } from "../services/api";
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  cartItemID: number;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [subtotal, setSubtotal] = useState<number>(0);
  const taxRate: number = 0.1;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");

  const shippingCost: number = 150000;

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    calculateSubtotal();
  }, [cartItems, selectedItems]);

  const fetchCart = async () => {
    try {
      // Using apiService instead of direct fetch
      const data = await apiService.getUserCart(1);
      console.log(data);

      const formattedItems: CartItem[] = data.items.map((item: any) => ({
        id: item.productID,
        name: item.productName,
        price: item.price,
        quantity: item.quantity,
        image: item.imageURL,
        cartItemID: item.cartItemID,
      }));

      setCartItems(formattedItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const calculateSubtotal = (): void => {
    const total = cartItems 
      .filter(item => selectedItems.includes(item.id))
      .reduce((acc, item) => acc + item.price * item.quantity, 0);
    setSubtotal(total);
  };

  const updateQuantity = async (id: number, newQuantity: number): Promise<void> => {
    if (newQuantity < 0) return;
  
    // Update UI immediately for better user experience
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartItemID === id ? { ...item, quantity: newQuantity } : item
      )
    );
    
    try {
      // Using apiService to update the backend
      await apiService.updateCartItemQuantity(id, newQuantity);
  
      if (newQuantity === 0) {
        // If quantity is 0, remove the item from cart
        setCartItems(prevItems => prevItems.filter((item) => item.cartItemID !== id));
        setSelectedItems(prevSelectedItems => prevSelectedItems.filter(itemId => 
          !cartItems.find(item => item.cartItemID === id && item.id === itemId)
        ));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      // Revert to original state if API call fails
      fetchCart(); // Refresh the cart to get the correct state
    }
  };
  
  const removeItem = async (id: number): Promise<void> => {
    try {
      // Find the cart item to get its cartItemID
      const cartItem = cartItems.find(item => item.id === id);
      if (!cartItem) return;
      
      // Use cartItemID for the API call
      await apiService.removeCartItem(cartItem.cartItemID);
      
      // Update the UI
      setCartItems(cartItems.filter((item) => item.id !== id));
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  

  const toggleSelectItem = (id: number): void => {
    setSelectedItems(selectedItems.includes(id)
      ? selectedItems.filter(itemId => itemId !== id)
      : [...selectedItems, id]);
  };

  const toggleSelectAll = (): void => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }
    navigate("/checkout", { state: { selectedItems: [...selectedItems], cartItems } });
  };

  const filteredItems = cartItems
  .filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    switch (sortOption) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      default:
        return 0;
    }
  });


  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#312F30' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 font-mulish">Giỏ hàng</h1>

        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 w-full sm:w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sắp xếp theo</option>
            <option value="name_asc">Tên A-Z</option>
            <option value="name_desc">Tên Z-A</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
          </select>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg shadow">
            <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-lg font-medium text-white font-mulish">Giỏ hàng của bạn đang trống</h2>
            <button className="mt-6 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md">Tiếp tục mua sắm</button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-[#1D1917] shadow rounded-lg overflow-hidden p-4">
              <label className="flex items-center text-white font-mulish">
                <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className="mr-6 w-5 h-5" /> Chọn tất cả
              </label>
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center p-6 border-b border-gray-700 last:border-0 bg-[#1D1917]">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                    className="mr-6 w-5 h-5"
                  />
                  <div className="flex-shrink-0 w-24 h-24">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" loading="lazy" />
                  </div>
                  <div className="ml-6 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-white font-mulish">{item.name}</h3>
                      <p className="text-lg font-medium text-white font-mulish">{item.price.toLocaleString()} VND</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-gray-600 rounded-md">
                      <button onClick={() => updateQuantity(item.cartItemID, item.quantity - 1)} className="p-2 hover:bg-gray-700">
                        <FiMinus className="h-4 w-4 text-white font-mulish" />
                      </button>
                      <input type="number" min="1" value={item.quantity} className="w-16 text-center border-x border-gray-600 bg-gray-800 text-white p-2" readOnly />
                      <button onClick={() => updateQuantity(item.cartItemID, item.quantity + 1)} className="p-2 hover:bg-gray-700">
                        <FiPlus className="h-4 w-4 text-white font-mulish" />
                      </button>

                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-600 flex items-center">
                        <FiTrash2 className="h-5 w-5 mr-1" /> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#1D1917] shadow rounded-lg p-6">
              <div className="space-y-4 text-white font-mulish">
                <div className="flex justify-between"><span>Tổng phụ</span><span>{subtotal.toLocaleString()} VND</span></div>
                <div className="flex justify-between"><span>Phí vận chuyển</span><span>{shippingCost.toLocaleString()} VND</span></div>
                <div className="border-t border-gray-600 pt-4 text-lg font-medium flex justify-between">
                  <span>Tổng cộng</span>
                  <span className="font-bold font-mulish">{(subtotal  + shippingCost).toLocaleString()} VND</span>
                </div>
              </div>
              <button onClick={handleCheckout} className="mt-6 w-full bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 font-mulish">
                Thanh toán
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
