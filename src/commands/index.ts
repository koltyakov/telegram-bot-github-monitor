import TelegramBot = require('node-telegram-bot-api');

import { aboutCommand } from './about';
import { authCommand } from './auth';
import { helpCommand } from './help';
import { logoutCommand } from './logout';
import { pingCommand } from './ping';
import { startCommand } from './start';

export const BotCommands = {
    aboutCommand,
    authCommand,
    helpCommand,
    logoutCommand,
    pingCommand,
    startCommand
};
