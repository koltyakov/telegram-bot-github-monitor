import * as path from 'path';

import { trimMultistring } from '../common/utilities';
import TelegramBot = require('node-telegram-bot-api');

const metadata: any = require(path.join(__dirname, '../../package.json'));

export const aboutCommand = (bot: TelegramBot) => {
    bot.onText(/\/about/, (message) => {
        const fromId = message.from.id;
        const response = trimMultistring(`
            ${metadata.description} (ver. ${metadata.version}) by ${metadata.author}
            Follow me on GitHub - https://github.com/koltyakov
        `);
        bot.sendMessage(fromId, response);
    });
};
