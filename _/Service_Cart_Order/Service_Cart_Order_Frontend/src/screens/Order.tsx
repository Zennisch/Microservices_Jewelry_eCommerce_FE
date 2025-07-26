import React from "react";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  status: string;
}

const orders: OrderItem[] = [
  { id: 101, name: "Sản phẩm A", price: 100000, quantity: 2, status: "Đang giao" },
  { id: 102, name: "Sản phẩm B", price: 200000, quantity: 1, status: "Hoàn thành" },
];

const Order: React.FC = () => {
  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Lịch sử đơn hàng</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="p-2 border-b">
              <p className="font-semibold">{order.name} x {order.quantity}</p>
              <p className="text-gray-500">Trạng thái: <span className="font-bold">{order.status}</span></p>
              <p className="text-gray-700 font-semibold">{order.price * order.quantity}₫</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Không có đơn hàng nào</p>
      )}
    </div>
  );
};

export default Order;
