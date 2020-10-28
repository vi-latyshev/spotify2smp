import SpotifyWebApi from 'spotify-web-api-node';
import express from 'express';
import debug from 'debug';
import open from 'open';

import { tokensStorage } from 'utils/tokens_storage';

import type { Server } from 'net';

const { HOST, PORT } = process.env;

const SERVER_PORT = PORT ?? 3005;
const REDIRECT_HOST = HOST ?? 'localhost';
const REDIRECT_URI = `http://${REDIRECT_HOST}:${SERVER_PORT}/`;

const SPOTIFY_TOKEN_NAME = 'spotify';
const log = debug('module: Spotify');

const SCOPES = ['user-read-currently-playing'];
const REDIRECT_STATE = 'spoty2smp';

export class SpotifyAuth {
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
        const token = await tokensStorage.get(SPOTIFY_TOKEN_NAME);

        return token as string;
    };

    private exchangeCodeToRefreshToken = async (authCode: string) => {
        log('Getting refresh token');
        const { body } = await this.api.authorizationCodeGrant(authCode);

        await tokensStorage.set(SPOTIFY_TOKEN_NAME, body.refresh_token);
        log('Token saved');
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
