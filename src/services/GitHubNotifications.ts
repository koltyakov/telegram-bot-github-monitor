import { EventEmitter } from 'events';
import * as request from 'request';

const subscribedUsers = {};

export class GitHubNotifications extends EventEmitter {

    private _username: string;
    private _token: string;
    private _latestReadTimestamp: any;
    private _headers: request.Headers;
    private _timeout: number;

    constructor(username: string, token: string) {
        super();

        this._username = username;
        this._token = token;
        this._latestReadTimestamp = new Date();
        this._headers = {
            'User-Agent': 'telegram-bot-github-monitor'
        };
        this._timeout = null;

        this._process();

        subscribedUsers[username] = this;
    }

    public subscribe(username: string, token: string) {
        this.unsubscribe(username);
        console.log(`Subscribe user: ${username}`);
        return new GitHubNotifications(username, token);
    }

    public unsubscribe(username: string) {
        console.log(`Un-subscribe user: ${username}`);
        clearTimeout(subscribedUsers[username] && subscribedUsers[username]._timeout);
        delete subscribedUsers[username];
    }

    private _buildAuthUrl(username: string, token: string, url: string) {
        if (!url) {
            return '';
        }
        return `https://${username}:${token}@${url.replace('https://', '')}`;
    }

    private _onNotificationsResponse(error: any, response: request.RequestResponse, body: any) {
        if (error) {
            return console.error(error);
        }

        if (response.statusCode === 401) {
            this.emit('unauthorized');
            return this.unsubscribe(this._username);
        }

        const interval = (Number(response.headers['X-Poll-Interval']) || 60) * 1000;

        if (response.statusCode === 304 || response.statusCode === 200) {
            this._headers['If-Modified-Since'] = this._latestReadTimestamp || response.headers.date;
            this._latestReadTimestamp = response.headers.date;
        }

        if (response.statusCode === 200) {
            body.forEach(notification => {
                const subjectUrl = this._buildAuthUrl(this._username, this._token, notification.subject.latest_comment_url);
                const headers = {
                    'User-Agent': 'telegram-bot-github-monitor'
                };

                if (!subjectUrl) {
                    return;
                }

                request(subjectUrl, { headers, json: true }, this._onSubjectResponse.bind(this));
            });
        }

        this._timeout = setTimeout(this._process.bind(this), interval);
    }

    private _onSubjectResponse(error: any, response: request.RequestResponse, body: any) {
        if (error) {
            return console.error(error);
        }

        if (response.statusCode === 200) {
            this.emit('notification', body.html_url);
        }
    }

    private _process() {
        const url = this._buildAuthUrl(this._username, this._token, 'api.github.com/notifications');
        request(url, { headers: this._headers, json: true }, this._onNotificationsResponse.bind(this));
    }
}
