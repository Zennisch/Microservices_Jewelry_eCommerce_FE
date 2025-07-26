import React, { useState, useEffect } from "react";
import '../assets/css/UpdateStock.css'

const UpdateStockModal = ({ product, onSave, onClose }) => {
  const [newStock, setNewStock] = useState();
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setNewStock(product.stock || 0);
    }
  }, [product]);

  const handleSubmit = () => {
    if (isNaN(newStock) || newStock < 0) {
      setError("Số lượng mới phải là số hợp lệ và không được nhỏ hơn 0.");
      return;
    }
    setError(""); // Xóa lỗi nếu hợp lệ
    onSave(newStock); // Gọi callback `onSave` để xử lý lưu
    onClose(); // Đóng modal
  };

  return (
    product && (
      <div className="modal">
        <div className="modal-content">
          <h2>Cập nhật số lượng tồn kho</h2>
          <p><strong>Sản phẩm:</strong> {product.name}</p>
          <p><strong>Số lượng hiện tại:</strong> {product.stock}</p>
          <label>
            <strong>Nhập thêm:</strong>
            <input
              type="number"
              
              onChange={(e) => {
                const increment = parseInt(e.target.value, 10);
                if (!isNaN(increment)) {
                  setNewStock(product.stock + increment);
                }
              }}
            />
          </label>
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button onClick={handleSubmit} className="confirm-button">
              Xác nhận
            </button>
            <button onClick={onClose} className="cancel-button">
              Hủy
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default UpdateStockModal;
