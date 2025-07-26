import {motion} from 'framer-motion';

const PaymentMethodSelector = ({selectedMethod, onSelect}) => {
    const paymentMethods = [
        {
            id: 'COD',
            name: 'Thanh toán khi nhận hàng (COD)',
            description: 'Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng.',
            icon: 'fa-money-bill-wave',
        },
        {
            id: 'MOMO_QR',
            name: 'Thanh toán qua MOMO (QR Code)',
            description: 'Quét mã QR bằng ứng dụng MOMO để thanh toán.',
            icon: 'fa-qrcode',
        },
    ];

    return (
        <div className="mb-8">
            <div className="space-y-4">
                {paymentMethods.map((method) => (
                    <div
                        key={method.id}
                        onClick={() => onSelect(method.id)}
                        className={`border rounded-md p-4 cursor-pointer transition-all ${
                            selectedMethod === method.id
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                        <div className="flex items-center">
                            <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                    selectedMethod === method.id ? 'border-amber-600' : 'border-gray-400'
                                }`}
                            >
                                {selectedMethod === method.id && (
                                    <motion.div
                                        initial={{scale: 0}}
                                        animate={{scale: 1}}
                                        className="w-3 h-3 rounded-full bg-amber-600"
                                    />
                                )}
                            </div>
                            <div className="ml-3 flex items-center">
                                <i className={`fas ${method.icon} text-amber-600 mr-2`}></i>
                                <span className="font-medium">{method.name}</span>
                            </div>
                        </div>

                        {selectedMethod === method.id && (
                            <motion.div
                                initial={{opacity: 0, height: 0}}
                                animate={{opacity: 1, height: 'auto'}}
                                exit={{opacity: 0, height: 0}}
                                className="mt-2 ml-8"
                            >
                                <p className="text-sm text-gray-600">{method.description}</p>

                                {method.id === 'BANK' && (
                                    <div className="mt-2 p-3 bg-gray-100 rounded-md text-sm">
                                        <p className="font-medium">Thông tin chuyển khoản:</p>
                                        <ul className="space-y-1 mt-1">
                                            <li>
                                                Ngân hàng: <span className="font-medium">Vietcombank</span>
                                            </li>
                                            <li>
                                                Số tài khoản: <span className="font-medium">1234567890</span>
                                            </li>
                                            <li>
                                                Chủ tài khoản: <span className="font-medium">CÔNG TY TRANG SỨC TINH TÚ</span>
                                            </li>
                                            <li>
                                                Nội dung: <span className="font-medium">[Mã đơn hàng] - [Tên của bạn]</span>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentMethodSelector;
