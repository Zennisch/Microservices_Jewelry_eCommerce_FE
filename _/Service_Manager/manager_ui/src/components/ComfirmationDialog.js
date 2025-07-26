import '../assets/css/ComfirmDialog.css'
import React from "react";


const ConfirmationDialog = ({ onConfirm, onCancel }) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <p className="dialog-text"><span>Bạn có chắc chắn muốn xóa sản phẩm này không?</span></p>
        <div className="dialog-actions">
          <button className="dialog-confirm-button" onClick={onConfirm}>
            Có
          </button>
          <button className="dialog-cancel-button" onClick={onCancel}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;

  

