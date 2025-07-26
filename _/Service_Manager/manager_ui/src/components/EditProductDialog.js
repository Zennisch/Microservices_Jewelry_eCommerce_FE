import React, { useState } from "react";
import '../assets/css/EditProductDialog.css'

const EditProductDialog = ({ product, onSave, onCancel }) => {

  const fields = [
    "name",
    "description",
    "price",
    "gender",
    "material",
    "goldKarat",
    "color",
    "brand",
    "categoryId",
    "collectionId",
  ];
  const initialData = fields.reduce((acc, field) => {
    acc[field] = product[field] || ""; 
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedProduct = { ...product, ...formData };
    onSave(updatedProduct);
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3 className="dialog-title">Chỉnh sửa sản phẩm</h3>
        <div className="dialog-body">
          {fields.map((key) => (
            <div key={key} className="form-group">
              <label htmlFor={key} className="form-label">
                {key}
              </label>
              <input
                id={key}
                name={key}
                type="text"
                value={formData[key]}
                placeholder={`Nhập ${key}`}
                className="form-input"
                onChange={handleInputChange}
              />
            </div>
          ))}
        </div>
        <div className="dialog-actions">
          <button className="dialog-cancel-button" onClick={onCancel}>
            Hủy
          </button>
          <button className="dialog-save-button" onClick={handleSave}>
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductDialog;
