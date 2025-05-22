import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import SERVICE_ENDPOINTS from 'container/apiConfig';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (name === 'newPassword') {
            validatePassword(value);
        }
    };
    
    const validatePassword = (password) => {
        setPasswordRequirements({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        });
    };
    
    const isPasswordValid = () => {
        return Object.values(passwordRequirements).every(req => req === true);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }
        
        // Check password strength
        if (!isPasswordValid()) {
            toast.error('Mật khẩu mới không đáp ứng yêu cầu!');
            return;
        }
        
        try {
            setLoading(true);
            
            // API call to change password
            await axios.put(
                `${SERVICE_ENDPOINTS.ACCOUNT}/profile/change-password`, 
                {
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword
                },
                {
                    withCredentials: true
                }
            );
            
            toast.success('Đổi mật khẩu thành công!');
            
            // Reset form
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Lỗi khi đổi mật khẩu:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Đổi Mật Khẩu</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="oldPassword">Mật khẩu hiện tại</label>
                    <input
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="newPassword">Mật khẩu mới</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
                
                {/* Password requirements */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-gray-700 mb-2">Yêu cầu mật khẩu:</h3>
                    <ul className="space-y-1">
                        <li className={`text-sm flex items-center ${passwordRequirements.length ? 'text-green-600' : 'text-gray-500'}`}>
                            <i className={`fas ${passwordRequirements.length ? 'fa-check-circle' : 'fa-circle'} mr-2`}></i>
                            Ít nhất 8 ký tự
                        </li>
                        <li className={`text-sm flex items-center ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                            <i className={`fas ${passwordRequirements.uppercase ? 'fa-check-circle' : 'fa-circle'} mr-2`}></i>
                            Ít nhất 1 ký tự hoa
                        </li>
                        <li className={`text-sm flex items-center ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                            <i className={`fas ${passwordRequirements.lowercase ? 'fa-check-circle' : 'fa-circle'} mr-2`}></i>
                            Ít nhất 1 ký tự thường
                        </li>
                        <li className={`text-sm flex items-center ${passwordRequirements.number ? 'text-green-600' : 'text-gray-500'}`}>
                            <i className={`fas ${passwordRequirements.number ? 'fa-check-circle' : 'fa-circle'} mr-2`}></i>
                            Ít nhất 1 ký tự số
                        </li>
                        <li className={`text-sm flex items-center ${passwordRequirements.special ? 'text-green-600' : 'text-gray-500'}`}>
                            <i className={`fas ${passwordRequirements.special ? 'fa-check-circle' : 'fa-circle'} mr-2`}></i>
                            Ít nhất 1 ký tự đặc biệt
                        </li>
                    </ul>
                </div>
                
                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading || !isPasswordValid() || formData.newPassword !== formData.confirmPassword}
                    >
                        {loading ? (
                            <>
                                <span className="inline-block animate-spin mr-2">
                                    <i className="fas fa-spinner"></i>
                                </span>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-lock mr-2"></i>
                                Đổi Mật Khẩu
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;