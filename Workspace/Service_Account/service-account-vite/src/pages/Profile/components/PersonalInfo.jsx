import React, { useState } from 'react';
import { toast } from 'react-toastify';

const PersonalInfo = ({ user, isEditing, setIsEditing, updateProfile }) => {
    const initialFormData = {
        name: user?.name || '',
        age: user?.age || '',
        gender: user?.gender || 'MALE',
        address: user?.address || '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            
            await updateProfile({
                ...formData,
                // Ensure age is a number if provided
                age: formData.age ? parseInt(formData.age) : null
            });
            
            setIsEditing(false);
            toast.success('Thông tin đã cập nhật thành công!');
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
            toast.error('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialFormData);
        setIsEditing(false);
    };

    const renderViewMode = () => (
        <div>
            <h2 className="text-xl font-bold mb-4">Thông Tin Cá Nhân</h2>
            
            <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Họ và Tên</p>
                            <p className="font-medium">{user?.name || 'Chưa cập nhật'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Tuổi</p>
                            <p className="font-medium">{user?.age || 'Chưa cập nhật'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Giới tính</p>
                            <p className="font-medium">
                                {user?.gender === 'MALE' ? 'Nam' : 
                                 user?.gender === 'FEMALE' ? 'Nữ' : 
                                 user?.gender === 'OTHER' ? 'Khác' : 'Chưa cập nhật'}
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm text-gray-500">Địa chỉ</p>
                            <p className="font-medium">{user?.address || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end">
                <button 
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                >
                    <i className="fas fa-edit mr-2"></i>
                    Chỉnh Sửa Thông Tin
                </button>
            </div>
        </div>
    );

    const renderEditMode = () => (
        <div>
            <h2 className="text-xl font-bold mb-4">Chỉnh Sửa Thông Tin</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Họ và Tên</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={user?.email}
                        className="form-input bg-gray-100"
                        disabled
                    />
                    <small className="text-gray-500">Email không thể thay đổi</small>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label htmlFor="age">Tuổi</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className="form-input"
                            min="1"
                            max="120"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="gender">Giới tính</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="form-input"
                        >
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                            <option value="OTHER">Khác</option>
                        </select>
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="address">Địa chỉ</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="form-input"
                        rows="3"
                    />
                </div>
                
                <div className="flex justify-end space-x-4 mt-6">
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="inline-block animate-spin mr-2">
                                    <i className="fas fa-spinner"></i>
                                </span>
                                Đang Lưu...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save mr-2"></i>
                                Lưu Thay Đổi
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );

    return isEditing ? renderEditMode() : renderViewMode();
};

export default PersonalInfo;