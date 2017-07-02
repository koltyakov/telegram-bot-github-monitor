import * as fs from 'fs';
import * as path from 'path';

import { IUser, IUserSearch, IUsersSearchCallback,
         IUserSearchCallback, IUserSimpleCallback } from '../interfaces/IUser';

export class Users {

    private users: IUser[] = [];

    constructor() {
        //
    }

    public findOne(userSearch: IUserSearch, callback: IUserSearchCallback): void {
        let user: IUser = this.users.find(u => {
            return u.telegramId === userSearch.telegramId || u.username === userSearch.username;
        });
        if (callback && typeof callback === 'function') {
            if (typeof user === 'undefined') {
                callback('No user found', null);
            } else {
                callback(null, user);
            }
        }
    }

    public find(userSearch: IUserSearch, callback: IUsersSearchCallback) {
        let users: IUser[] = this.users.filter(u => {
            return u.telegramId === userSearch.telegramId || u.username === userSearch.username;
        });
        if (callback && typeof callback === 'function') {
            callback(null, users);
        }
    }

    public create(user: IUser, callback: IUserSimpleCallback): void {
        this.users.push(user);
        if (callback && typeof callback === 'function') {
            callback(null);
        }
    }

    public update(userSearch: IUserSearch, data: any, callback: IUserSimpleCallback): void {
        this.findOne(userSearch, (error, user) => {
            if (!error) {
                user = {
                    ...user,
                    ...data
                };
            }
            if (callback && typeof callback === 'function') {
                callback(error);
            }
        });
    }

    public remove(userSearch: IUserSearch, callback: IUserSimpleCallback): void {
        let index: number = -1;
        let error: any = null;
        this.users.find((u, i) => {
            let found: boolean = u.telegramId === userSearch.telegramId || u.username === userSearch.username;
            if (found) {
                index = i;
            }
            return found;
        });
        if (index !== -1) {
            this.users.splice(index, 1);
        } else {
            error = 'No user found';
        }
        if (callback && typeof callback === 'function') {
            callback(error);
        }
    }

}
