import SpotifyWebApi from 'spotify-web-api-node';

import { Module } from 'system';

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

export class SpotifyBase extends Module {
    protected api: SpotifyWebApi;

    constructor() {
        super('Spotify');

        this.api = new SpotifyWebApi({
            clientId: SPOTIFY_CLIENT_ID,
            clientSecret: SPOTIFY_CLIENT_SECRET,
        });
    }

    protected checkRateLimit = async (headers: Record<string, string>, callback: () => Promise<any>) => {
        const retryIn = headers['Retry-After'];

        if (retryIn === undefined) {
            return Promise.resolve();
        }
        const retryInNumber = parseInt(retryIn);

        this.log(`Rate limit. Next request in ${retryInNumber} sec`);

        return new Promise<void>((resolve) => {
            setTimeout(async () => {
                await callback();
                resolve();
            }, retryInNumber * 1000);
        });
    };
}
