import React from 'react';

const ProfileTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'info', label: 'Thông Tin Cá Nhân', icon: 'user' },
        { id: 'password', label: 'Đổi Mật Khẩu', icon: 'lock' },
        { id: 'avatar', label: 'Ảnh Đại Diện', icon: 'camera' }
    ];

    return (
        <nav className="profile-tab-list flex flex-col">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    <i className={`fas fa-${tab.icon} mr-3 ${activeTab === tab.id ? 'text-amber-700' : 'text-gray-400'}`}></i>
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};

export default ProfileTabs;