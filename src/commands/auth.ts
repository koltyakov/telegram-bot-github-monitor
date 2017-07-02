import { Users } from '../models/users';

import TelegramBot = require('node-telegram-bot-api');
import { GitHubNotifications } from '../services/GitHubNotifications';
import { MESSAGES } from '../common/messages';

import { IUser } from '../interfaces/IUser';

const users = new Users();

export const authCommand = (bot: TelegramBot) => {
    bot.onText(/\/auth (.*):(.*)|\/auth/, (message: any, match: any[]) => {
        const username = match[1] && match[1].split('@')[0];
        const token = match[2];
        const telegramId = message.from.id;

        if (!username && !token) {
            return bot.sendMessage(telegramId, MESSAGES.USERNAME_AND_GITHUB_TOKEN_NOT_SPECIFIED);
        }
        if (!username) {
            return bot.sendMessage(telegramId, MESSAGES.USERNAME_NOT_SPECIFIED);
        }
        if (!token) {
            return bot.sendMessage(telegramId, MESSAGES.GITHUB_TOKEN_NOT_SPECIFIED);
        }

        users.findOne({ username, telegramId }, (error, user) => {
            if (error) {
                return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);
            }

            if (!user) {
                // tslint:disable-next-line:no-shadowed-variable
                users.create({ username, token, telegramId }, (error) => {
                    // if (error && error.code === '11000') {
                    //     return bot.sendMessage(telegramId, MESSAGES.USERNAME_ALREADY_REGISTERED);
                    // }

                    if (error) {
                        return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);
                    }

                    bot.sendMessage(telegramId, MESSAGES.REGISTER_SUCCESSFUL);

                    const gitHubNotifications = new GitHubNotifications(username, token);
                    gitHubNotifications.subscribe(username, token)
                        .on('notification', notification => bot.sendMessage(telegramId, notification))
                        .once('unauthorized', () => bot.sendMessage(telegramId, MESSAGES.UNAUTHORIZED));
                });
            } else {
                // tslint:disable-next-line:no-shadowed-variable
                users.update({ username, telegramId }, { username, telegramId, token }, (error) => {
                    if (error) {
                        return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);
                    }

                    bot.sendMessage(telegramId, MESSAGES.PERSONAL_TOKEN_UPDATED);

                    const gitHubNotifications = new GitHubNotifications(username, token);
                    gitHubNotifications.subscribe(username, token)
                        .on('notification', notification => bot.sendMessage(telegramId, notification))
                        .once('unauthorized', () => bot.sendMessage(telegramId, MESSAGES.UNAUTHORIZED));
                });
            }
        });
    });
};
