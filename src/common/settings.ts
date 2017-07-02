import * as path from 'path';
import { ISettings } from '../interfaces/ISettings';

const getSettings = (): ISettings => {
    let settings: ISettings = require(path.join(__dirname, '../../config/private.json'));

    settings = {
        botToken: process.env.TELEGRAM_BOT_TOKEN || settings.botToken,
        nodeEnv: <any>process.env.NODE_ENV || settings.nodeEnv || 'development',
        hostname: process.env.HOSTNAME || settings.hostname || 'localhost',
        // tslint:disable-next-line:radix
        port: (process.env.PORT && parseInt(process.env.PORT)) || settings.port || 9090
    };

    return settings;
};

export const settings = getSettings();
