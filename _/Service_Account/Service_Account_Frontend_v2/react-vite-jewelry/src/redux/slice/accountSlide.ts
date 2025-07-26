import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { callFetchAccount, updateUserProfile } from '@/config/api';
import { callLogin } from '../../config/api';
// Fetch account data
export const fetchAccount = createAsyncThunk(
    'account/fetchAccount',
    async () => {
        const response = await callFetchAccount();
        return response.data;
    }
);

// Update account information
export const updateAccount = createAsyncThunk(
    'account/updateAccount',
    async (updatedData: { name: string; email: string; password?: string }) => {
        const response = await updateUserProfile(updatedData);
        return response.data;
    }
);

interface IState {
    isAuthenticated: boolean;
    isLoading: boolean;
    isRefreshToken: boolean;
    errorRefreshToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: {
            id?: string;
            name?: string;
            permissions?: {
                id: string;
                name: string;
                apiPath: string;
                method: string;
                module: string;
            }[];
        };
    };
    activeMenu: string;
    updateStatus: "idle" | "loading" | "success" | "failed";
    updateError: string;
}

const initialState: IState = {
    isAuthenticated: false,
    isLoading: true,
    isRefreshToken: false,
    errorRefreshToken: "",
    user: {
        id: "",
        email: "",
        name: "",
        role: {
            id: "",
            name: "",
            permissions: [],
        },
    },
    activeMenu: 'home',
    updateStatus: "idle",
    updateError: "",
};

export const accountSlide = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setActiveMenu: (state, action) => {
            state.activeMenu = action.payload;
        },
        setUserLoginInfo: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user.id = action?.payload?.id || '';
            state.user.email = action?.payload?.email || '';
            state.user.name = action?.payload?.name || '';
            state.user.role = action?.payload?.role || { name: 'NORMAL_USER', permissions: [] };
            state.user.role.permissions = action?.payload?.role?.permissions || [];
        },
        setLogoutAction: (state) => {
            localStorage.removeItem('access_token');
            state.isAuthenticated = false;
            state.user = {
                id: "",
                email: "",
                name: "",
                role: {
                    id: "",
                    name: "",
                    permissions: [],
                },
            };
        },
        setRefreshTokenAction: (state, action) => {
            state.isRefreshToken = action.payload?.status ?? false;
            state.errorRefreshToken = action.payload?.message ?? "";
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAccount.pending, (state) => {
            state.isAuthenticated = false;
            state.isLoading = true;
        });

        builder.addCase(fetchAccount.fulfilled, (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user.id = action?.payload?.user?.id ?? "";
            state.user.email = action.payload?.user?.email ?? "";
            state.user.name = action.payload?.user?.name ?? "";

            state.user.role = action?.payload?.user?.role ?? { id: "", name: "", permissions: [] };

            if (!action?.payload?.user?.role) state.user.role = {};
            state.user.role.permissions = action?.payload?.user?.role?.permissions ?? [];
        });

        builder.addCase(fetchAccount.rejected, (state) => {
            state.isAuthenticated = false;
            state.isLoading = false;
        });

        builder.addCase(updateAccount.pending, (state) => {
            state.updateStatus = "loading";
            state.updateError = "";
        });

        builder.addCase(updateAccount.fulfilled, (state, action) => {
            state.updateStatus = "success";
            state.user.name = action.payload.name;
            state.user.email = action.payload.email;
        });

        builder.addCase(updateAccount.rejected, (state, action) => {
            state.updateStatus = "failed";
            state.updateError = action.error.message ?? "Cập nhật thất bại";
        });
    },
});

export const {
    setActiveMenu, setUserLoginInfo, setLogoutAction, setRefreshTokenAction
} = accountSlide.actions;

export default accountSlide.reducer;
