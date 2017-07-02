import { Users } from '../models/users';

import TelegramBot = require('node-telegram-bot-api');
import { GitHubNotifications } from '../services/GitHubNotifications';
import { MESSAGES } from '../common/messages';

import { IUser } from '../interfaces/IUser';

const users = new Users();

export const logoutCommand = (bot: TelegramBot) => {
    bot.onText(/\/logout/, (message: any) => {
        const telegramId = message.from.id;

        users.findOne({ telegramId }, (error, user) => {
            if (error) {
                return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);
            }
            if (!user) {
                return bot.sendMessage(telegramId, MESSAGES.USER_NOT_EXISTS);
            }

            const gitHubNotifications = new GitHubNotifications(user.username, user.token);
            gitHubNotifications.unsubscribe(user.username);

            // tslint:disable-next-line:no-shadowed-variable
            users.remove({ telegramId }, (error) => {
                if (error) {
                    return bot.sendMessage(telegramId, MESSAGES.SOMETHING_WENT_WRONG);
                }
                bot.sendMessage(telegramId, MESSAGES.ACCOUNT_UNLINKED);
            });
        });
    });
};
