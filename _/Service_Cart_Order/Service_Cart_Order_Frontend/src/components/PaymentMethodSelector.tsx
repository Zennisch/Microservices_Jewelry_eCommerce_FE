import React from "react";

interface PaymentOption {
  value: string;
  label: string;
  icon: string;
}

interface Props {
  selectedMethod: string;
  onSelect: (method: string) => void;
}

const PaymentMethodSelector: React.FC<Props> = ({ selectedMethod, onSelect }) => {
  const paymentOptions: PaymentOption[] = [
    { value: "cod", label: "Thanh toán tiền mặt khi nhận hàng (COD)", icon: "https://www.pnj.com.vn/site/assets/images/cod.svg" },
    { value: "bankTransfer", label: "Thanh toán chuyển khoản", icon: "https://www.pnj.com.vn/site/assets/images/cash.svg" },
    { value: "creditCard", label: "Thanh toán thẻ quốc tế (VISA, Master, JCB)", icon: "https://www.pnj.com.vn/site/assets/images/payoo.svg" },
    { value: "installment", label: "Trả góp thẻ tín dụng 0%", icon: "https://www.pnj.com.vn/site/assets/images/payoo.svg" },
    { value: "vnpay", label: "Thanh toán VNPAY", icon: "https://www.pnj.com.vn/site/assets/images/vnpay.svg" },
    { value: "momo", label: "Thanh toán bằng ví MoMo", icon: "https://www.pnj.com.vn/site/assets/images/momo.png" },
    { value: "qr", label: "Quét mã QR", icon: "https://www.pnj.com.vn/site/assets/images/payoo.svg" },
    { value: "zalopay", label: "Thanh toán Zalopay - QR đa năng", icon: "https://www.pnj.com.vn/site/assets/images/zalopay.png" },
  ];

  return (
    <div className="payment-method bg-[#312F30] p-6 rounded-lg shadow-md">
      <h2 className="text-white mb-4">Chọn phương thức thanh toán</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {paymentOptions.map(({ value, label, icon }) => (
          <div
            key={value}
            className={`flex items-center gap-3 bg-[#1D1917] p-4 rounded-lg shadow-md cursor-pointer 
              ${selectedMethod === value ? "bg-gray-700" : "hover:bg-gray-700"} transition`}
            onClick={() => onSelect(value)}
          >
            <img src={icon} alt={label} width="24" height="24" loading="lazy" />
            <span className="text-white">{label}</span>
          </div>
        ))}
      </div>
      {selectedMethod && (
        <p className="text-white mt-4">
          Bạn đã chọn phương thức: <strong>{paymentOptions.find((p) => p.value === selectedMethod)?.label}</strong>
        </p>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
