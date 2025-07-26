import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useLocation } from "react-router-dom";
import { apiService } from "../services/api";


interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  imageURL: string;
}

interface Order {
  orderID: number;
  createAt: string;
  address: string;
  status: "PENDING" | "PROCESSING" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "CANCELED";
  items: OrderItem[];
  total: number;
}

const OrderList: React.FC = () => {
  const location = useLocation();
  const shippingCost = location.state?.shippingCost || 0; // Nếu không có, mặc định là 0

  const { pendingPayment, orderId, momoOrderId, pendingOrderId } = location.state || {};
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderID, setExpandedOrderID] = useState<number | null>(null);
  
  // Add new state for filtering and pagination
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ordersPerPage = 10;

  const fetchOrders = async () => {
    try {
      // Using apiService instead of direct fetch
      const data = await apiService.getUserOrders(1);

      const formattedOrders = data.map((order: any) => ({
        orderID: order.orderID,
        createAt: order.createAt,
        address: order.address,
        status: order.status as Order["status"],
        paymentStatus: order.paymentStatus as Order["paymentStatus"],
        items: order.orderDetails.map((detail: any) => ({
          name: detail.product.name,
          quantity: detail.quantity,
          price: detail.price,
          imageURL: detail.product.imageSet?.length
            ? detail.product.imageSet[0].imageURL
            : "https://via.placeholder.com/100",
        })),
        total: order.orderDetails.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0
        ) + shippingCost,
      }));

      setOrders(formattedOrders);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check for pending payment from Momo
  const checkPendingPayment = async () => {
    // Get any pending order ID from localStorage first to avoid variable shadowing
    const storedPendingOrderId = localStorage.getItem('pendingOrderId');
    const storedMomoOrderId = localStorage.getItem('momoOrderId');
    
    // First check if we have a pending payment from location state with momoOrderId
    if (pendingPayment && momoOrderId) {
      try {
        console.log("Checking pending payment with MOMO orderId:", momoOrderId);
        
        // Call the confirm transaction API with the MOMO orderId
        const result = await apiService.confirmPaymentTransaction(momoOrderId);
        
        if (result.success && result.data?.resultCode === 0) {
          // Payment successful
          alert("Thanh toán thành công! Đơn hàng của bạn đang được xử lý.");
          
          // Get the original order ID from localStorage if available
          if (storedPendingOrderId && !isNaN(parseInt(storedPendingOrderId))) {
            const orderIdNumber = parseInt(storedPendingOrderId);
            try {
              // Update the payment status to PAID
              console.log(`Updating payment status for order ${orderIdNumber} to PAID`);
              const updateResult = await apiService.updateOrderStatus(
                orderIdNumber, 
                { paymentStatus: "PAID" }
              );
              console.log("Payment status updated successfully:", updateResult);
              
              // Update the local state to reflect the change immediately
              setOrders(prevOrders => 
                prevOrders.map(order => 
                  order.orderID === orderIdNumber 
                    ? { ...order, paymentStatus: "PAID" }
                    : order
                )
              );
            } catch (updateError) {
              console.error("Error updating payment status:", updateError);
            }
          } else {
            console.warn("No valid order ID found in localStorage:", storedPendingOrderId);
          }
          
          // Clear localStorage
          localStorage.removeItem('pendingOrderId');
          localStorage.removeItem('momoOrderId');
        } else {
          console.log("Payment not confirmed yet:", result);
        }
        
        // Refresh orders list to show updated status
        fetchOrders();
      } catch (error: any) {
        console.error("Error confirming payment:", error);
        // Don't show alert for server errors to avoid disrupting user experience
        console.log("Server error occurred while confirming payment. This might be because the transaction is still processing.");
      }
    }
    // If no momoOrderId in location state, try with orderId
    else if (pendingPayment && orderId && !isNaN(orderId)) {
      try {
        console.log("Checking pending payment for order:", orderId);
        
        // Get momoOrderId from localStorage if available
        if (storedMomoOrderId) {
          console.log("Using stored MOMO orderId:", storedMomoOrderId);
          try {
            const result = await apiService.confirmPaymentTransaction(storedMomoOrderId);
            
            if (result.success && result.data?.resultCode === 0) {
              // Payment successful
              alert("Thanh toán thành công! Đơn hàng của bạn đang được xử lý.");
              
              try {
                // Update the payment status to PAID
                console.log(`Updating payment status for order ${orderId} to PAID`);
                const updateResult = await apiService.updateOrderStatus(
                  orderId, 
                  { paymentStatus: "PAID" }
                );
                console.log("Payment status updated successfully:", updateResult);
                
                // Update the local state to reflect the change immediately
                setOrders(prevOrders => 
                  prevOrders.map(order => 
                    order.orderID === orderId 
                      ? { ...order, paymentStatus: "PAID" }
                      : order
                  )
                );
              } catch (updateError) {
                console.error("Error updating payment status:", updateError);
              }
              
              // Clear localStorage
              localStorage.removeItem('pendingOrderId');
              localStorage.removeItem('momoOrderId');
            }
          } catch (confirmError: any) {
            console.error("Error confirming payment with stored MOMO orderId:", confirmError);
          }
        }
        
        // Refresh orders list to show updated status
        fetchOrders();
      } catch (error: any) {
        console.error("Error in payment check process:", error);
      }
    }
    // Check for pendingOrderId from COD orders
    else if (pendingOrderId && !isNaN(pendingOrderId)) {
      console.log("Found pending order ID from COD payment:", pendingOrderId);
      // For COD orders, we don't need to update payment status, but we can highlight the order
      // or perform any other necessary actions
      
      // Update localStorage for consistency
      localStorage.setItem('pendingOrderId', pendingOrderId.toString());
      
      // Refresh orders to make sure the new order is displayed
      fetchOrders();
    }
    
    // Also check for any pending order in localStorage
    if (storedMomoOrderId && storedPendingOrderId && !pendingPayment) {
      try {
        console.log("Checking pending payment from localStorage with MOMO orderId:", storedMomoOrderId);
        
        // Call the confirm transaction API with the MOMO orderId
        try {
          const result = await apiService.confirmPaymentTransaction(storedMomoOrderId);
          
          if (result.success && result.data?.resultCode === 0) {
            // Payment successful
            alert("Thanh toán thành công! Đơn hàng của bạn đang được xử lý.");
            
            // Validate order ID before using it
            if (!isNaN(parseInt(storedPendingOrderId))) {
              const orderIdNumber = parseInt(storedPendingOrderId);
              try {
                // Update the payment status to PAID
                console.log(`Updating payment status for order ${orderIdNumber} to PAID`);
                const updateResult = await apiService.updateOrderStatus(
                  orderIdNumber, 
                  { paymentStatus: "PAID" }
                );
                console.log("Payment status updated successfully:", updateResult);
                
                // Update the local state to reflect the change immediately
                setOrders(prevOrders => 
                  prevOrders.map(order => 
                    order.orderID === orderIdNumber 
                      ? { ...order, paymentStatus: "PAID" }
                      : order
                  )
                );
              } catch (updateError) {
                console.error("Error updating payment status:", updateError);
              }
            } else {
              console.warn("Invalid order ID in localStorage:", storedPendingOrderId);
            }
            
            // Clear the pending order from localStorage
            localStorage.removeItem('pendingOrderId');
            localStorage.removeItem('momoOrderId');
          }
        } catch (confirmError: any) {
          console.error("Error confirming payment from localStorage:", confirmError);
          // If we get a 500 error, it might be that the transaction is not yet processed by MOMO
          // We'll keep the localStorage items for now to try again later
        }
        
        // Refresh orders list to show updated status
        fetchOrders();
      } catch (error: any) {
        console.error("Error in localStorage payment check:", error);
      }
    }
  };

  useEffect(() => {
    // Fetch orders and check pending payments
    fetchOrders();
    checkPendingPayment();
  }, [location]);

  const statusColors: Record<Order["status"], string> = {
    PENDING: "bg-yellow-600",
    PROCESSING: "bg-blue-600",
    DELIVERED: "bg-green-600",
    CANCELLED: "bg-red-600",
  };

  const statusText: Record<Order["status"], string> = {
    PENDING: "Chờ Xử Lý",
    PROCESSING: "Đang Xử Lý",
    DELIVERED: "Đã Giao",
    CANCELLED: "Đã Hủy",
  };

  const paymentStatusColors: Record<Order["paymentStatus"], string> = {
    PENDING: "bg-yellow-500",
    PAID: "bg-green-500",
    CANCELED: "bg-red-500",
  };
  
  const paymentStatusText: Record<Order["paymentStatus"], string> = {
    PENDING: "Chưa Thanh Toán",
    PAID: "Đã Thanh Toán",
    CANCELED: "Đã Hủy",
  };
  
  // Filter orders based on status filter
  const filteredOrders = statusFilter 
    ? orders.filter(order => order.status === statusFilter)
    : orders;
    
  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  if (loading) return <p className="text-gray-300 text-center text-lg">Đang tải...</p>;
  if (error) return <p className="text-red-500 text-center text-lg">Lỗi: {error}</p>;

  return (
    <div className="min-h-screen bg-[#1D1917] text-gray-100 p-6 md:p-10 font-['Mulish']">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Danh Sách Đơn Hàng</h1>

        {/* Add filter dropdown */}
        <div className="mb-6 flex justify-end">
          <select
            className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); // Reset to first page when filter changes
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ Xử Lý</option>
            <option value="PROCESSING">Đang Xử Lý</option>
            <option value="DELIVERED">Đã Giao</option>
            <option value="CANCELLED">Đã Hủy</option>
          </select>
        </div>

        <div className="bg-[#312F30] p-6 rounded-lg shadow-lg">
          <table className="w-full text-lg">
            <thead>
              <tr className="border-b border-gray-600 text-gray-300">
                <th className="px-6 py-4 text-left">Mã Đơn Hàng</th>
                <th className="px-6 py-4 text-left">Ngày Đặt</th>
                <th className="px-6 py-4 text-left">Tổng Giá</th>
                <th className="px-6 py-4 text-left">Trạng Thái</th>
                <th className="px-6 py-4 text-left">Thanh Toán</th>
                <th className="px-6 py-4 text-left">Chi Tiết</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <React.Fragment key={order.orderID}>
                  <tr className="border-b border-gray-600 hover:bg-gray-700 transition">
                    <td className="px-6 py-4">{order.orderID}</td>
                    <td className="px-6 py-4">
                      {format(new Date(order.createAt), "dd/MM/yyyy", { locale: vi })}
                    </td>
                    <td className="px-6 py-4">{order.total.toLocaleString()}₫</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`${statusColors[order.status]} px-4 py-2 rounded-full text-white`}>
                        {statusText[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"> 
                      <span className={`${paymentStatusColors[order.paymentStatus]} px-4 py-2 rounded-full text-white`}>
                        {paymentStatusText[order.paymentStatus]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                        onClick={() =>
                          setExpandedOrderID(expandedOrderID === order.orderID ? null : order.orderID)
                        }
                      >
                        {expandedOrderID === order.orderID ? "Ẩn" : "Xem Chi Tiết"}
                      </button>
                    </td>
                  </tr>

                  {expandedOrderID === order.orderID && (
                    <tr className="bg-gray-700">
                      <td colSpan={6} className="px-6 py-4">
                        <p className="font-semibold text-xl mb-3">Chi Tiết Đơn Hàng</p>

                        <table className="w-full border border-gray-600">
                          <thead>
                            <tr className="border-b border-gray-600 text-gray-300">
                              <th className="px-4 py-3 text-left">Ảnh</th>
                              <th className="px-4 py-3 text-left">Tên Sản Phẩm</th>
                              <th className="px-4 py-3 text-left">Số Lượng</th>
                              <th className="px-4 py-3 text-left">Giá</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, index) => (
                              <tr key={index} className="border-b border-gray-600">
                                <td className="px-4 py-3">
                                  <img
                                    src={item.imageURL}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg border border-gray-500"
                                  />
                                </td>
                                <td className="px-4 py-3">{item.name}</td>
                                <td className="px-4 py-3">{item.quantity}</td>
                                <td className="px-4 py-3">{item.price.toLocaleString()}₫</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          {/* Add pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button 
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white`}
              >
                Trước
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 rounded ${currentPage === number ? 'bg-red-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
                >
                  {number}
                </button>
              ))}
              
              <button 
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white`}
              >
                Tiếp
              </button>
            </div>
          )}
          
          {/* Show order count */}
          <div className="mt-4 text-center text-gray-400">
            Hiển thị {currentOrders.length} / {filteredOrders.length} đơn hàng
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
