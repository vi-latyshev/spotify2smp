import express from 'express';
import open from 'open';

import { PROJECT_NAME, SERVER_PORT, SERVER_URI } from '_constants';
import { tokensStorage } from 'utils/tokens_storage';

import { SpotifyBase } from './spotify_base';

import type { Server } from 'net';

export class SpotifyAuth extends SpotifyBase {
    private REDIRECT_ROUTE = `${this.moduleNameLower}-auth`;

    private SCOPES = ['user-read-currently-playing'];

    private updateAcessTokenTimer: NodeJS.Timeout | null = null;

    private acessTokenExpiresTime: number = 0;

    constructor() {
        super();
        this.api.setRedirectURI(SERVER_URI + this.REDIRECT_ROUTE);
    }

    public getRefreshToken = async () => {
        const hasToken = await tokensStorage.has(this.moduleNameLower);

        if (!hasToken) {
            this.log('Refresh token not found');

            const authCode = await this.createServer();
            await this.exchangeCodeToRefreshToken(authCode);
        }

        const refreshToken = await tokensStorage.get(this.moduleNameLower) as string;
        this.api.setRefreshToken(refreshToken);
    };

    /**
     * Refreshes the token one min before expires
     */
    public setUpdateAccessTokenTimer = async () => {
        if (this.updateAcessTokenTimer !== null) {
            clearTimeout(this.updateAcessTokenTimer);
            this.updateAcessTokenTimer = null;
        }
        await this.updateAccessToken();

        this.updateAcessTokenTimer = setTimeout(
            this.setUpdateAccessTokenTimer,
            (this.acessTokenExpiresTime - 60) * 1000,
        );
    };

    private updateAccessToken = async () => {
        this.log('Getting new access token');

        const { body, headers } = await this.api.refreshAccessToken();
        await this.checkRateLimit(headers, this.updateAccessToken);

        const expiresTime = body.expires_in;

        this.api.setAccessToken(body.access_token);
        this.acessTokenExpiresTime = expiresTime;

        this.log(`Access token updated. Expires in ${expiresTime} sec`);
    };

    private exchangeCodeToRefreshToken = async (authCode: string) => {
        this.log('Getting refresh token');

        const { body, headers } = await this.api.authorizationCodeGrant(authCode);
        await this.checkRateLimit(headers, () => this.exchangeCodeToRefreshToken(authCode));

        await tokensStorage.set(this.moduleNameLower, body.refresh_token);

        this.log('Refresh token saved to storage');
    };

    private createServer = async () => new Promise<string>((resolve) => {
        this.log('Starting server for authorization');

        const app = express();
        let server: Server;

        app.get(`/${this.REDIRECT_ROUTE}`, async (req, res) => {
            const { state, code, error } = req.query;

            if (state !== PROJECT_NAME) {
                this.log('Wrong state from request');

                res.statusCode = 403;
                res.end();
                return;
            }

            if (error !== undefined) {
                res.send(`Error an authorization Spotify. Reson: ${error}`);
                return;
            }

            res.send('Done. Server closed. Now you can close this tab');
            server.close();

            resolve(code as string);
        });

        server = app.listen(SERVER_PORT, async () => {
            this.log('Server listening request from Spotify server');
            const authUrl = this.api.createAuthorizeURL(this.SCOPES, PROJECT_NAME);

            this.log('Opening browser for authorization in Spotify');
            await open(authUrl);
        });
    });
}
