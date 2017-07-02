export interface IUser {
    username: string;
    token: string;
    telegramId: string;
}

export interface IUserSearch {
    username?: string;
    telegramId?: string;
}

export interface IUsersSearchCallback {
    (error: any, user: IUser[]): void;
}

export interface IUserSearchCallback {
    (error: any, user: IUser): void;
}

export interface IUserSimpleCallback {
    (error: any): void;
}
