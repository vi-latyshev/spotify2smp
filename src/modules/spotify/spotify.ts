import { SpotifyAuth } from './spotify_auth';

import type { IModule } from 'system';

export class SpotifyClient extends SpotifyAuth implements IModule {
    public authorization = async () => {
        await this.getRefreshToken();
        await this.setUpdateAccessTokenTimer();
    };

    public getCurrentPlayingTrack = async () => {
        const { body, headers } = await this.api.getMyCurrentPlayingTrack();
        await this.checkRateLimit(headers, this.getCurrentPlayingTrack);

        return body;
    };
}
