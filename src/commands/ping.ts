import TelegramBot = require('node-telegram-bot-api');

export const pingCommand = (bot: TelegramBot) => {
    bot.onText(/\/ping/, (message) => {
        const fromId = message.from.id;
        const response = `What's up`;
        bot.sendMessage(fromId, response);
    });
};
