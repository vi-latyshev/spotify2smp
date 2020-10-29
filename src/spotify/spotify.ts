import SpotifyWebApi from 'spotify-web-api-node';

import { SpotifyAuth } from './spotify_auth';
import { checkRateLimit } from './utils/checkRateLimit';

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

export class SpotifyClient {
    private api: SpotifyWebApi;

    private auth: SpotifyAuth;

    constructor() {
        this.api = new SpotifyWebApi({
            clientId: SPOTIFY_CLIENT_ID,
            clientSecret: SPOTIFY_CLIENT_SECRET,
        });
        this.auth = new SpotifyAuth(this.api);
    }

    public authorization = async () => {
        await this.auth.getRefreshToken();
        await this.auth.setUpdateAccessTokenTimer();
    };

    public getCurrentPlayingTrack = async () => {
        const { body, headers } = await this.api.getMyCurrentPlayingTrack();
        await checkRateLimit(headers, this.getCurrentPlayingTrack);

        return body;
    };
}
