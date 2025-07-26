export interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
}

export interface IModelPaginate<T> {
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: T[]
}



export interface IAccount {
    access_token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: {
            id: string;
            name: string;
            permissions: {
                id: string;
                name: string;
                apiPath: string;
                method: string;
                module: string;
            }[]
        }
    }
}

export interface IGetAccount extends Omit<IAccount, "access_token"> { }



export interface IUser {
    id?: string;
    name: string;
    email: string;
    password?: string;
    age: number;
    gender: string;
    address: string;
    role?: {
        id: string;
        name: string;
    }
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}




export interface IPermission {
    id?: string;
    name?: string;
    apiPath?: string;
    method?: string;
    module?: string;

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;

}

export interface IRole {
    id?: string;
    name: string;
    description: string;
    active: boolean;
    permissions: IPermission[] | string[];

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

// Thêm interface cho Occasion
export interface IOccasionReminder {
    id?: number;
    occasionName: string;
    occasionDate: string;
    reminderDaysBefore: number;
    notes?: string;
    yearlyRecurring: boolean;
    recipientName: string;
    relationship: string;
    giftPreferences?: string;
    reminderSent: boolean; // Thêm trường này để theo dõi trạng thái gửi nhắc nhở
    daysRemaining?: number;
    createdAt?: string;
    updatedAt?: string;
  }
  
export interface IReqOccasionReminderDTO {
    occasionName: string;
    occasionDate: string;
    reminderDaysBefore: number;
    notes?: string;
    yearlyRecurring: boolean;
    recipientName: string;
    relationship: string;
    giftPreferences?: string;
}
  
export interface IUpcomingOccasion extends IOccasionReminder {
    daysUntil: number;
}
