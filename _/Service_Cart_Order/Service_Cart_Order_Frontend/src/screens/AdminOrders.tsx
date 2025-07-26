import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
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
  userID: number;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderID, setExpandedOrderID] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllOrders();
      console.log("Raw API response:", data); // Debug log
  
      if (data && Array.isArray(data)) {
        const formattedOrders = data.map((order: any) => {
          console.log(`Processing order ${order.orderID}:`, order); // Debug log
          
          // Check if orderDetails exists and is an array
          if (!order.orderDetails || !Array.isArray(order.orderDetails)) {
            console.error(`Order ${order.orderID} has invalid orderDetails:`, order.orderDetails);
          }
          
          // Map order items with careful property access
          const items = Array.isArray(order.orderDetails) 
            ? order.orderDetails.map((detail: any) => {
                console.log(`Detail for order ${order.orderID}:`, detail); // Debug log
                
                // Check if product exists
                if (!detail.product) {
                  console.error(`Detail in order ${order.orderID} has no product:`, detail);
                }
                
                return {
                  name: detail.product?.name || 'Unknown Product',
                  quantity: detail.quantity || 0,
                  price: detail.price || 0,
                  imageURL: detail.product?.imageSet?.length
                    ? detail.product.imageSet[0].imageURL
                    : "https://via.placeholder.com/100",
                };
              })
            : [];
          
          // Calculate total with careful property access
          const total = Array.isArray(order.orderDetails)
            ? order.orderDetails.reduce(
                (sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 0),
                0
              )
            : 0;
          
          return {
            orderID: order.orderID,
            createAt: order.createAt,
            address: order.address || 'No address provided',
            status: order.status || 'PENDING',
            paymentStatus: order.paymentStatus || 'PENDING',
            userID: order.userID,
            items: items,
            total: total,
          };
        });
  
        console.log("Formatted orders:", formattedOrders); // Debug log
        setOrders(formattedOrders);
      } else {
        console.error("Unexpected data format:", data);
        setOrders([]);
        setError("Data received in unexpected format");
      }
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderID: number, newStatus: Order["status"]) => {
    try {
      setUpdateLoading(true);
      console.log(`Attempting to update order ${orderID} status to ${newStatus}`);
      
      // Kiểm tra giá trị status trước khi gửi
      if (!newStatus || !["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"].includes(newStatus)) {
        console.error(`Invalid status value: ${newStatus}`);
        throw new Error(`Giá trị trạng thái không hợp lệ: ${newStatus}`);
      }
      
      // Only send the status field
      const result = await apiService.updateOrderStatus(orderID, { status: newStatus });
      console.log(`Update result for order ${orderID}:`, result);
      
      // Kiểm tra kết quả trả về từ API
      if (result && result.order) {
        console.log(`Server returned order with status: ${result.order.status}`);
        
        // Cập nhật state với giá trị trả về từ server thay vì giá trị từ tham số
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.orderID === orderID 
              ? { 
                  ...order, 
                  status: result.order.status || newStatus // Sử dụng giá trị từ server nếu có
                }
              : order
          )
        );
      } else {
        // Nếu không có kết quả trả về từ server, sử dụng giá trị từ tham số
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.orderID === orderID 
              ? { ...order, status: newStatus }
              : order
          )
        );
      }
      
      alert(`Đơn hàng #${orderID} đã được cập nhật thành ${statusText[newStatus]}`);
    } catch (error: any) {
      console.error("Error updating order status:", error);
      alert(`Không thể cập nhật trạng thái đơn hàng: ${error.message || "Vui lòng thử lại sau."}`);
    } finally {
      setUpdateLoading(false);
    }
  };

  const updatePaymentStatus = async (orderID: number, newPaymentStatus: Order["paymentStatus"]) => {
    try {
      setUpdateLoading(true);
      console.log(`Attempting to update order ${orderID} payment status to ${newPaymentStatus}`);
      
      // Only send the paymentStatus field
      const result = await apiService.updateOrderStatus(orderID, { paymentStatus: newPaymentStatus });
      console.log(`Update result for order ${orderID}:`, result);
      
      // Update the local state directly with the new payment status
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderID === orderID 
            ? { ...order, paymentStatus: newPaymentStatus }
            : order
        )
      );
      
      alert(`Trạng thái thanh toán đơn hàng #${orderID} đã được cập nhật thành ${paymentStatusText[newPaymentStatus]}`);
    } catch (error: any) {
      console.error("Error updating payment status:", error);
      alert(`Không thể cập nhật trạng thái thanh toán: ${error.message || "Vui lòng thử lại sau."}`);
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteOrder = async (orderID: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      return;
    }
    
    try {
      setUpdateLoading(true);
      await apiService.deleteOrder(orderID);
      
      setOrders(prevOrders => prevOrders.filter(order => order.orderID !== orderID));
      alert(`Đơn hàng #${orderID} đã được xóa thành công`);
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Không thể xóa đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setUpdateLoading(false);
    }
  };

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
  
  // Filter orders based on status and payment status filters
  const filteredOrders = orders.filter(order => {
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesPaymentStatus = !paymentStatusFilter || order.paymentStatus === paymentStatusFilter;
    return matchesStatus && matchesPaymentStatus;
  });
    
  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  if (loading) return <p className="text-gray-300 text-center text-lg">Đang tải...</p>;
  if (error) return (
    <div className="text-center py-8">
      <p className="text-red-500 mb-4">{error}</p>
      <button 
        onClick={fetchAllOrders}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
      >
        Thử lại
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6 md:p-10 font-['Mulish']">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Quản Lý Đơn Hàng</h1>

        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <button 
            onClick={fetchAllOrders}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            Làm mới
          </button>
          
          <div className="flex flex-col md:flex-row gap-4">
            <select
              className="px-4 py-2 rounded-md bg-white text-gray-800 border border-gray-300"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Tất cả trạng thái đơn hàng</option>
              <option value="PENDING">Chờ Xử Lý</option>
              <option value="PROCESSING">Đang Xử Lý</option>
              <option value="DELIVERED">Đã Giao</option>
              <option value="CANCELLED">Đã Hủy</option>
            </select>
            
            <select
              className="px-4 py-2 rounded-md bg-white text-gray-800 border border-gray-300"
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Tất cả trạng thái thanh toán</option>
              <option value="PENDING">Chưa Thanh Toán</option>
              <option value="PAID">Đã Thanh Toán</option>
              <option value="CANCELED">Đã Hủy</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-lg overflow-x-auto border border-gray-200">
          {currentOrders.length === 0 ? (
            <p className="text-center py-8 text-gray-600">Không có đơn hàng nào phù hợp với bộ lọc</p>
          ) : (
            <table className="w-full text-lg">
              <thead>
                <tr className="border-b border-gray-300 text-gray-700">
                  <th className="px-6 py-4 text-left">Mã Đơn</th>
                  <th className="px-6 py-4 text-left">Ngày Đặt</th>
                  <th className="px-6 py-4 text-left">Khách Hàng</th>
                  <th className="px-6 py-4 text-left">Tổng Giá</th>
                  <th className="px-6 py-4 text-left">Trạng Thái</th>
                  <th className="px-6 py-4 text-left">Thanh Toán</th>
                  <th className="px-6 py-4 text-left">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <React.Fragment key={order.orderID}>
                    <tr className="border-b border-gray-200 hover:bg-gray-100 transition">
                      <td className="px-6 py-4">{order.orderID}</td>
                      <td className="px-6 py-4">
                        {format(new Date(order.createAt), "dd/MM/yyyy", { locale: vi })}
                      </td>
                      <td className="px-6 py-4">
                        ID: {order.userID}
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
                        <div className="flex flex-col space-y-2">
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            onClick={() =>
                              setExpandedOrderID(expandedOrderID === order.orderID ? null : order.orderID)
                            }
                          >
                            {expandedOrderID === order.orderID ? "Ẩn" : "Xem Chi Tiết"}
                          </button>
                          
                          <button
                            onClick={() => deleteOrder(order.orderID)}
                            disabled={updateLoading}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedOrderID === order.orderID && (
                      <tr className="bg-gray-100">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="space-y-4">
                            <p className="font-semibold text-xl mb-3 text-gray-800">Chi Tiết Đơn Hàng</p>
                            <p className="text-gray-700"><span className="font-semibold">Địa chỉ:</span> {order.address}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h3 className="font-semibold mb-2 text-gray-800">Cập nhật trạng thái đơn hàng</h3>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(statusText).map(([status, text]) => (
                                    <button
                                      key={status}
                                      onClick={() => updateOrderStatus(order.orderID, status as Order["status"])}
                                      disabled={updateLoading || order.status === status}
                                      className={`px-4 py-2 rounded text-white ${
                                        order.status === status 
                                          ? 'bg-gray-400 cursor-not-allowed' 
                                          : `${statusColors[status as Order["status"]]} hover:opacity-80`
                                      }`}
                                    >
                                      {text}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-semibold mb-2 text-gray-800">Cập nhật trạng thái thanh toán</h3>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(paymentStatusText).map(([status, text]) => (
                                    <button
                                      key={status}
                                      onClick={() => updatePaymentStatus(order.orderID, status as Order["paymentStatus"])}
                                      disabled={updateLoading || order.paymentStatus === status}
                                      className={`px-4 py-2 rounded text-white ${
                                        order.paymentStatus === status 
                                          ? 'bg-gray-400 cursor-not-allowed' 
                                          : `${paymentStatusColors[status as Order["paymentStatus"]]} hover:opacity-80`
                                      }`}
                                    >
                                      {text}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <table className="w-full border border-gray-300">
                              <thead>
                                <tr className="border-b border-gray-300 bg-gray-200 text-gray-700">
                                  <th className="px-4 py-3 text-left">Ảnh</th>
                                  <th className="px-4 py-3 text-left">Tên Sản Phẩm</th>
                                  <th className="px-4 py-3 text-left">Số Lượng</th>
                                  <th className="px-4 py-3 text-left">Giá</th>
                                  <th className="px-4 py-3 text-left">Thành Tiền</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item, index) => (
                                  <tr key={index} className="border-b border-gray-200">
                                    <td className="px-4 py-3">
                                      <img
                                        src={item.imageURL}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                                      />
                                    </td>
                                    <td className="px-4 py-3">{item.name}</td>
                                    <td className="px-4 py-3">{item.quantity}</td>
                                    <td className="px-4 py-3">{item.price.toLocaleString()}₫</td>
                                    <td className="px-4 py-3">{(item.price * item.quantity).toLocaleString()}₫</td>
                                  </tr>
                                ))}
                                <tr className="bg-gray-200">
                                  <td colSpan={4} className="px-4 py-3 text-right font-bold text-gray-800">Tổng cộng:</td>
                                  <td className="px-4 py-3 font-bold text-gray-800">{order.total.toLocaleString()}₫</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button 
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                Trước
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 rounded ${currentPage === number ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                >
                  {number}
                </button>
              ))}
              
              <button 
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                Tiếp
              </button>
            </div>
          )}
          
          {/* Order count */}
          <div className="mt-4 text-center text-gray-600">
            Hiển thị {currentOrders.length} / {filteredOrders.length} đơn hàng
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;