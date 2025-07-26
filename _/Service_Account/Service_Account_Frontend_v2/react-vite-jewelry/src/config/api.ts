import { IBackendRes, IAccount, IUser, IModelPaginate, IGetAccount, IPermission, IRole, IReqOccasionReminderDTO} from '@/types/backend';
import axios from 'config/axios-customize';

/**
 * 
Module Auth
 */
export const callRegister = (name: string, email: string, password: string, age: number, gender: string, address: string) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/auth/register', { name, email, password, age, gender, address })
}

export const callLogin = (username: string, password: string) => {
    return axios.post<IBackendRes<IAccount>>('/api/v1/auth/login', { username, password })
}

export const callFetchAccount = () => {
    return axios.get<IBackendRes<IGetAccount>>('/api/v1/auth/account')
}

export const callRefreshToken = () => {
    return axios.get<IBackendRes<IAccount>>('/api/v1/auth/refresh')
}

export const callLogout = () => {
    return axios.post<IBackendRes<string>>('/api/v1/auth/logout')
}

/**
 * Upload single file
 */
export const callUploadSingleFile = (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder', folderType);

    return axios<IBackendRes<{ fileName: string }>>({
        method: 'post',
        url: '/api/v1/files',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

/**
 * 
Module User
 */
export const callCreateUser = (user: IUser) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/users', { ...user })
}

export const callUpdateUser = (user: IUser) => {
    return axios.put<IBackendRes<IUser>>(`/api/v1/users`, { ...user })
}

export const callDeleteUser = (id: string) => {
    return axios.delete<IBackendRes<IUser>>(`/api/v1/users/${id}`);
}

export const callFetchUser = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${query}`);
}


/**
 * 
Module Permission
 */
export const callCreatePermission = (permission: IPermission) => {
    return axios.post<IBackendRes<IPermission>>('/api/v1/permissions', { ...permission })
}

export const callUpdatePermission = (permission: IPermission, id: string) => {
    return axios.put<IBackendRes<IPermission>>(`/api/v1/permissions`, { id, ...permission })
}

export const callDeletePermission = (id: string) => {
    return axios.delete<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

export const callFetchPermission = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IPermission>>>(`/api/v1/permissions?${query}`);
}

export const callFetchPermissionById = (id: string) => {
    return axios.get<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

/**
 * 
Module Role
 */
export const callCreateRole = (role: IRole) => {
    return axios.post<IBackendRes<IRole>>('/api/v1/roles', { ...role })
}

export const callUpdateRole = (role: IRole, id: string) => {
    return axios.put<IBackendRes<IRole>>(`/api/v1/roles`, { id, ...role })
}

export const callDeleteRole = (id: string) => {
    return axios.delete<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

export const callFetchRole = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(`/api/v1/roles?${query}`);
}

export const callFetchRoleById = (id: string) => {
    return axios.get<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

//Module forgor-password
export const forgotPassword = (email: string) => {
    return axios.post("/api/v1/auth/forgot-password", { email });
};

export const resetPassword = (token: string, newPassword: string) => {
    return axios.post("/api/v1/auth/reset-password", { token, newPassword });
};


//Module Manage Account
export const getUserProfile = async () => {
    return axios.get("/api/v1/profile");
  };
  
  export const updateUserProfile = async (data: any) => {
    return axios.put("/api/v1/profile", data);
  };
  
  export const changeUserPassword = async (data: { oldPassword: string; newPassword: string }) => {
    return axios.put("/api/v1/profile/change-password", data);
  };




//Module auth login with google
export const getGoogleLoginUrl = () => {
    return axios.get<IBackendRes<{login_url: string}>>('/api/v1/auth/google-login-link');
}

export const handleGoogleLoginCallback = () => {
    return axios.get<IBackendRes<IAccount>>('/api/v1/auth/google');
}

// Module Occasion Reminders
export const getUserOccasionReminders = async (query = '') => {
    return axios.get(`/api/v1/profile/occasions${query ? '?' + query : ''}`);
};
  
export const getUpcomingOccasions = async () => {
    return axios.get('/api/v1/profile/occasions/upcoming');
};
  
export const createOccasionReminder = async (data: IReqOccasionReminderDTO) => {
    return axios.post('/api/v1/profile/occasions', data);
};
  
export const updateOccasionReminder = async (id: number, data: IReqOccasionReminderDTO) => {
    return axios.put(`/api/v1/profile/occasions/${id}`, data);
};

export const deleteOccasionReminder = async (id: number) => {
    return axios.delete(`/api/v1/profile/occasions/${id}`);
};