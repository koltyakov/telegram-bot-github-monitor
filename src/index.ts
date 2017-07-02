import * as express from 'express';
import * as bodyParser from 'body-parser';
import TelegramBot = require('node-telegram-bot-api');
import { GitHubNotifications } from './services/GitHubNotifications';
import { Users } from './models/users';
import { MESSAGES } from './common/messages';
import { BotCommands } from './commands';
import { settings } from './common/settings';

const app = express();

if (!settings.botToken) {
    throw new Error('You must provide TELEGRAM_BOT_TOKEN');
}
if (!settings.port) {
    throw new Error('You must provide PORT');
}

const bot = new TelegramBot(settings.botToken, {
    polling: settings.nodeEnv !== 'production'
});

if (process.env.NODE_ENV === 'production' && settings.hostname) {
    bot.setWebHook(`https://${settings.hostname}/${settings.botToken}`);
} else {
    bot.setWebHook('');
}

Object.keys(BotCommands).forEach(command => BotCommands[command](bot));

app.use(bodyParser.json());
app.get(`/`, (req, res) => res.redirect('http://t.me/GitHubMonitorBot'));
app.post(`/${settings.botToken}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});
app.listen(settings.port);

const users = new Users();
users.find({}, (error, results) => {
    if (error) {
        throw new Error(error);
    }
    results.forEach(user => {
        const gitHubNotifications = new GitHubNotifications(user.username, user.token);
        gitHubNotifications.subscribe(user.username, user.token)
            .on('notification', notification => bot.sendMessage(user.telegramId, `${notification}`))
            .once('unauthorized', () => bot.sendMessage(user.telegramId, MESSAGES.UNAUTHORIZED));
    });
});
