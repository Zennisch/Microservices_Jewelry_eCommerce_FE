import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import SERVICE_ENDPOINTS from 'container/apiConfig';

const UploadAvatar = ({ user }) => {
    const [loading, setLoading] = useState(false);
    const [previewSrc, setPreviewSrc] = useState(user?.avatarUrl || null);
    const fileInputRef = useRef(null);
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.match('image.*')) {
            toast.error('Vui lòng chọn tệp hình ảnh.');
            return;
        }
        
        // Validate file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Kích thước tệp không được vượt quá 5MB.');
            return;
        }
        
        // Preview the image
        const reader = new FileReader();
        reader.onload = (e) => setPreviewSrc(e.target.result);
        reader.readAsDataURL(file);
    };
    
    const handleSelectFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    
    const handleUpload = async () => {
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            toast.error('Vui lòng chọn hình ảnh trước khi tải lên.');
            return;
        }
        
        const file = fileInput.files[0];
        
        try {
            setLoading(true);
            
            const formData = new FormData();
            formData.append('file', file);
            
            // Upload avatar
            const response = await axios.post(
                `${SERVICE_ENDPOINTS.ACCOUNT}/profile/avatar`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                }
            );
            
            toast.success('Đã cập nhật ảnh đại diện thành công!');
            
            // Update preview with the new URL from server
            if (response.data && response.data.avatarUrl) {
                setPreviewSrc(response.data.avatarUrl);
            }
        } catch (error) {
            console.error('Lỗi khi tải lên ảnh đại diện:', error);
            toast.error('Không thể tải lên ảnh đại diện. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleRemoveAvatar = async () => {
        try {
            setLoading(true);
            
            // API call to remove avatar
            await axios.delete(`${SERVICE_ENDPOINTS.ACCOUNT}/profile/avatar`, {
                withCredentials: true
            });
            
            setPreviewSrc(null);
            toast.success('Đã xóa ảnh đại diện.');
            
            // Clear file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Lỗi khi xóa ảnh đại diện:', error);
            toast.error('Không thể xóa ảnh đại diện. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Ảnh Đại Diện</h2>
            
            <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg mb-6">
                <div className="mb-4 text-center">
                    <div className="w-40 h-40 rounded-full overflow-hidden border border-gray-200 mx-auto mb-4">
                        {previewSrc ? (
                            <img 
                                src={previewSrc} 
                                alt="Ảnh đại diện" 
                                className="w-full h-full object-cover"
                                onError={(e) => {e.target.src = '/images/account-default.jpg'}}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                <i className="fas fa-user text-4xl"></i>
                            </div>
                        )}
                    </div>
                    
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    
                    <div className="mt-2">
                        <button
                            type="button"
                            onClick={handleSelectFile}
                            className="btn btn-secondary mr-2"
                        >
                            <i className="fas fa-camera mr-2"></i>
                            Chọn hình ảnh
                        </button>
                        
                        {previewSrc && (
                            <button
                                type="button"
                                onClick={handleRemoveAvatar}
                                className="btn btn-secondary text-red-600 hover:bg-red-50 hover:border-red-200"
                                disabled={loading}
                            >
                                <i className="fas fa-trash-alt mr-2"></i>
                                Xóa
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="text-center">
                    <p className="text-sm text-gray-500 mb-4">
                        Định dạng hỗ trợ: JPG, PNG, GIF. Kích thước tối đa: 5MB.
                    </p>
                    
                    {previewSrc && previewSrc !== user?.avatarUrl && (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleUpload}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="inline-block animate-spin mr-2">
                                        <i className="fas fa-spinner"></i>
                                    </span>
                                    Đang tải lên...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-cloud-upload-alt mr-2"></i>
                                    Tải lên ảnh đại diện
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
            
            <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                <h3 className="font-medium text-amber-800 mb-1">
                    <i className="fas fa-info-circle mr-2"></i>
                    Lưu ý
                </h3>
                <p className="text-sm text-amber-700">
                    Ảnh đại diện của bạn sẽ hiển thị trong tất cả các dịch vụ của Tinh Tú Jewelry, 
                    bao gồm đơn hàng, bình luận và đánh giá sản phẩm.
                </p>
            </div>
        </div>
    );
};

export default UploadAvatar;