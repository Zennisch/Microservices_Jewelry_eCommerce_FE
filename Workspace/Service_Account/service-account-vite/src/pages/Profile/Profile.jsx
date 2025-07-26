import { useState, useEffect } from 'react';
import { useAuth } from 'container/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProfileTabs from './components/ProfileTabs';
import PersonalInfo from './components/PersonalInfo';
import ChangePassword from './components/ChangePassword';
import UploadAvatar from './components/UploadAvatar';
import PageHeader from '../../components/PageHeader';
import './Profile.css';

const Profile = () => {
    const { user, loading, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    if (loading || !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <PageHeader title="Tài Khoản Cá Nhân" subtitle="Quản lý thông tin cá nhân của bạn" />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="profile-card">
                    {/* Header with user info summary */}
                    <div className="profile-header">
                        <div className="flex items-center">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                                <img 
                                    src={user.avatarUrl || '/images/account-default.jpg'} 
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {e.target.src = '/images/account-default.jpg'}}
                                />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-xl font-bold">{user.name}</h2>
                                <p className="opacity-90">{user.email}</p>
                                <span className="inline-block px-3 py-1 mt-1 text-xs bg-white/20 rounded-full">
                                    {user.role?.name || 'Khách hàng'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Profile Content */}
                    <div className="flex flex-col md:flex-row profile-layout">
                        {/* Left sidebar with tabs */}
                        <div className="md:w-64 profile-sidebar">
                            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                        </div>
                        
                        {/* Main content area */}
                        <div className="flex-1 p-6">
                            {activeTab === 'info' && (
                                <PersonalInfo 
                                    user={user} 
                                    isEditing={isEditing} 
                                    setIsEditing={setIsEditing} 
                                    updateProfile={updateProfile} 
                                />
                            )}
                            
                            {activeTab === 'password' && (
                                <ChangePassword />
                            )}
                            
                            {activeTab === 'avatar' && (
                                <UploadAvatar user={user} updateProfile={updateProfile} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;