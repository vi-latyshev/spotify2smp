import SpotifyWebApi from 'spotify-web-api-node';

import { SpotifyAuth } from './spotify_auth';

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

export class SpotifyClient {
    api: SpotifyWebApi;

    private auth: SpotifyAuth;

    constructor() {
        this.api = new SpotifyWebApi({
            clientId: SPOTIFY_CLIENT_ID,
            clientSecret: SPOTIFY_CLIENT_SECRET,
        });
        this.auth = new SpotifyAuth(this.api);
    }

    login = async () => {
        const refreshToken = await this.auth.getRefreshToken();
        return refreshToken;

        // TODO: set timeOut for refresh access token in Auth
    };
}
