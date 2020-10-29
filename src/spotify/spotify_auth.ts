import SpotifyWebApi from 'spotify-web-api-node';
import express from 'express';
import open from 'open';

import { tokensStorage } from 'utils/tokens_storage';

import { log } from './utils/log';
import { checkRateLimit } from './utils/checkRateLimit';

import type { Server } from 'net';

const { HOST, PORT } = process.env;

const SERVER_PORT = PORT ?? 3005;
const REDIRECT_HOST = HOST ?? 'localhost';
const REDIRECT_URI = `http://${REDIRECT_HOST}:${SERVER_PORT}/`;

const SPOTIFY_TOKEN_NAME = 'spotify';

const SCOPES = ['user-read-currently-playing'];
const REDIRECT_STATE = 'spoty2smp';

export class SpotifyAuth {
    private updateAcessTokenTimer: NodeJS.Timeout | null = null;

    private acessTokenExpiresTime: number = 0;

    constructor(private api: SpotifyWebApi) {
        api.setRedirectURI(REDIRECT_URI);
    }

    public getRefreshToken = async () => {
        const hasToken = await tokensStorage.has(SPOTIFY_TOKEN_NAME);

        if (!hasToken) {
            log('Refresh token not found');

            const authCode = await this.createServer();
            await this.exchangeCodeToRefreshToken(authCode);
        }

        const refreshToken = await tokensStorage.get(SPOTIFY_TOKEN_NAME) as string;
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
        log('Getting new acess token');

        const { body, headers } = await this.api.refreshAccessToken();
        await checkRateLimit(headers, this.updateAccessToken);

        const expiresTime = body.expires_in;

        this.api.setAccessToken(body.access_token);
        this.acessTokenExpiresTime = expiresTime;

        log(`Access token updated. Expires in ${expiresTime} sec`);
    };

    private exchangeCodeToRefreshToken = async (authCode: string) => {
        log('Getting refresh token');

        const { body, headers } = await this.api.authorizationCodeGrant(authCode);
        await checkRateLimit(headers, () => this.exchangeCodeToRefreshToken(authCode));

        await tokensStorage.set(SPOTIFY_TOKEN_NAME, body.refresh_token);

        log('Refresh token saved to storage');
    };

    private createServer = async () => new Promise<string>((resolve) => {
        log('Starting server for authorization');

        const app = express();
        let server: Server;

        app.get('/', async (req, res) => {
            const { state, code, error } = req.query;

            if (state !== REDIRECT_STATE) {
                log('Wrong state from request');

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
            log('Server listening request from Spotify server');
            const authUrl = this.api.createAuthorizeURL(SCOPES, REDIRECT_STATE);

            log('Opening browser for authorization in Spotify');
            await open(authUrl);
        });
    });
}
