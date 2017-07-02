import * as fs from 'fs';
import * as path from 'path';
import * as sqlite3 from 'sqlite3';

const db = new sqlite3.Database(path.join(__dirname, '../../data/users.sqlite'));

import { IUser, IUserSearch, IUsersSearchCallback,
         IUserSearchCallback, IUserSimpleCallback } from '../interfaces/IUser';

export class Users {

    constructor() {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS Users (username TEXT, token TEXT, telegramId INTEGER);`);
        });
    }

    public findOne(userSearch: IUserSearch, callback: IUserSearchCallback): void {
        console.log(userSearch);
        db.serialize(() => {
            db.all(
                `SELECT username, token, telegramId FROM Users ` +
                `WHERE telegramId = ${userSearch.telegramId} OR username = '${userSearch.username}';`,
                (error, users) => {
                    callback(error, users && users.length > 0 ? users[0] : null);
                }
            );
        });
    }

    public findAll(callback: IUsersSearchCallback) {
        db.serialize(() => {
            db.all(
                `SELECT username, token, telegramId FROM Users`, callback
            );
        });
    }


    public find(userSearch: IUserSearch, callback: IUsersSearchCallback) {
        db.serialize(() => {
            db.all(
                `SELECT username, token, telegramId FROM Users ` +
                `WHERE telegramId = ${userSearch.telegramId} OR username = '${userSearch.username}';`,
                callback
            );
        });
    }

    public create(user: IUser, callback: IUserSimpleCallback): void {
        db.serialize(() => {
            db.run(
                `INSERT INTO Users (username, token, telegramId) ` +
                `VALUES ('${user.username}', '${user.token}', ${user.telegramId});`,
                callback
            );
        });
    }

    public update(userSearch: IUserSearch, data: IUser, callback: IUserSimpleCallback): void {
        db.serialize(() => {
            db.run(
                `UPDATE Users SET username = '${data.username}', token = '${data.token}', telegramId = ${data.telegramId} ` +
                `WHERE telegramId = ${userSearch.telegramId} OR username = '${userSearch.username}';`,
                callback
            );
        });
    }

    public remove(userSearch: IUserSearch, callback: IUserSimpleCallback): void {
        db.serialize(() => {
            db.run(
                `SELECT FROM Users WHERE telegramId = ${userSearch.telegramId} OR username = '${userSearch.username}';`,
                callback
            );
        });
    }

}
