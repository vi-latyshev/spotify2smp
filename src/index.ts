import 'dotenv/config';

import { SpotifyClient } from 'spotify';
import { TelegramClient } from 'telegram';
import { convertMsToTime } from 'utils/convertMsToTime';

const spotifyClient = new SpotifyClient();
const telegramClient = new TelegramClient();

const TEXT_BEFORE_NAME = 'Listening on Spotify: ';
const STATUS_UPDATE_TIME = 5000;
/**
 * TODO: move to module
 */
const TELEGRAM_MAX_BIO_LENGTH = 70;

let spotifyCurrentTrackID: string | undefined;

const updateTrack = async () => {
    const {
        item,
        is_playing: isPlaying,
        progress_ms: progressTime,
    } = await spotifyClient.getCurrentPlayingTrack();

    if (!isPlaying || !item) {
        if (spotifyCurrentTrackID !== undefined) {
            await telegramClient.updateProfile();
            spotifyCurrentTrackID = undefined;
        }
        return Promise.resolve();
    }
    const {
        id,
        name,
        artists,
        duration_ms: durationTime,
    } = item;

    const progressTimeInString = convertMsToTime(progressTime as number);
    const durationTimeInString = convertMsToTime(durationTime);

    const currentTimer = `{${progressTimeInString} / ${durationTimeInString}}`;

    const allArtists = artists.map((artist) => artist.name);
    const allArtistsInString = allArtists.join(' & ').substr(0,
        (TELEGRAM_MAX_BIO_LENGTH - 4) - TEXT_BEFORE_NAME.length - name.length - currentTimer.length);

    const status = `${TEXT_BEFORE_NAME}${allArtistsInString} > ${name} ${currentTimer}`;

    await telegramClient.updateProfile({ about: status });

    spotifyCurrentTrackID = id;
};

const updateTrackTimer = async () => {
    await updateTrack();
    setTimeout(updateTrackTimer, STATUS_UPDATE_TIME);
};

(async () => {
    await spotifyClient.authorization();
    await telegramClient.authorization();
    updateTrackTimer();
})();
