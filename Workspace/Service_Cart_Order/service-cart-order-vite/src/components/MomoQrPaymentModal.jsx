import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MomoQrPaymentModal = ({ isOpen, onClose, paymentUrl, orderId, onPaymentSuccess, onPaymentFailed }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [checkCount, setCheckCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Đang chờ thanh toán...');

  const checkPaymentStatus = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8006/api/payment/confirmTransaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: orderId }),
      });

      if (!response.ok) {
        throw new Error('Không thể kiểm tra trạng thái thanh toán');
      }

      const data = await response.json();
      
      if (data.success && data.data.resultCode === 0) {
        // Payment successful
        setStatusMessage('Thanh toán thành công! Đang chuyển hướng...');
        setIsChecking(false);
        
        // Call onPaymentSuccess after a short delay
        setTimeout(() => {
          onPaymentSuccess(data.data);
        }, 1500);
        
        return true;
      } else if (checkCount >= 60) { // 5 minutes timeout (checking every 5 seconds)
        setStatusMessage('Thời gian thanh toán đã hết. Vui lòng thử lại sau.');
        setIsChecking(false);
        onPaymentFailed('Thời gian thanh toán đã hết');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking payment status:', error);
      setStatusMessage('Đã xảy ra lỗi khi kiểm tra thanh toán');
      return false;
    }
  }, [orderId, checkCount, onPaymentSuccess, onPaymentFailed]);

  useEffect(() => {
    if (!isOpen || !isChecking) return;

    // Open payment URL in new tab when modal opens
    if (paymentUrl && checkCount === 0) {
      window.open(paymentUrl, '_blank');
    }

    const interval = setInterval(async () => {
      setCheckCount(prev => prev + 1);
      const isComplete = await checkPaymentStatus();
      
      if (isComplete) {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen, isChecking, paymentUrl, checkCount, checkPaymentStatus]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            if (!isChecking) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl"
          >
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <img 
                  src="/images/payment-momo-logo.png" 
                  alt="MoMo Logo" 
                  className="h-16 w-16"
                />
              </div>
              
              <h3 className="text-xl font-medium text-gray-800 mb-2">Thanh toán MOMO QR</h3>
              <p className="text-gray-600 mb-6">{statusMessage}</p>
              
              {isChecking ? (
                <div className="flex justify-center items-center mb-6">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500"></div>
                </div>
              ) : (
                <div className="flex justify-center mb-6">
                  {statusMessage.includes('thành công') ? (
                    <div className="bg-green-100 p-3 rounded-full">
                      <i className="fas fa-check text-xl text-green-600"></i>
                    </div>
                  ) : (
                    <div className="bg-red-100 p-3 rounded-full">
                      <i className="fas fa-times text-xl text-red-600"></i>
                    </div>
                  )}
                </div>
              )}
              
              <div className="text-sm text-gray-500 mb-4">
                {isChecking ? (
                  <p>
                    Vui lòng không đóng cửa sổ này trong khi thanh toán đang xử lý.<br />
                    Một cửa sổ mới đã được mở để bạn thanh toán qua MOMO.
                  </p>
                ) : statusMessage.includes('thành công') ? (
                  <p>Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đang được xử lý.</p>
                ) : (
                  <p>Bạn có thể thử thanh toán lại hoặc chọn phương thức thanh toán khác.</p>
                )}
              </div>
              
              {!isChecking && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                >
                  Đóng
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MomoQrPaymentModal;