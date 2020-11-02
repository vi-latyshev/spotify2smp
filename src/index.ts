import 'dotenv/config';
import debug from 'debug';

import { SpotifyClient } from 'spotify';
import { TelegramClient } from 'telegram';
// import { convertMsToTime } from 'utils/convertMsToTime';

const log = debug('Player');
log.enabled = true;

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
        // progress_ms: progressTime,
    } = await spotifyClient.getCurrentPlayingTrack();

    if (!isPlaying || !item) {
        if (spotifyCurrentTrackID !== undefined) {
            log('Playing stopped');
            await telegramClient.updateProfile();
            log('Telegram updated bio to default');
            spotifyCurrentTrackID = undefined;
        }
        return;
    }
    const {
        id,
        name,
        artists,
        // duration_ms: durationTime,
    } = item;

    if (spotifyCurrentTrackID === id) {
        return;
    }

    /*
    const progressTimeInString = convertMsToTime(progressTime as number);
    const durationTimeInString = convertMsToTime(durationTime);

    const currentTimer = `{${progressTimeInString} / ${durationTimeInString}}`;
    */
    const MAX_NAME_LENGTH = (TELEGRAM_MAX_BIO_LENGTH - 4 - TEXT_BEFORE_NAME.length /* - currentTimer.length */) / 2;

    const allArtists = artists.map((artist) => artist.name);
    const allArtistsInString = allArtists.join(' & ').substr(0, MAX_NAME_LENGTH);

    const nameBySubstr = name.substr(0, MAX_NAME_LENGTH);

    const status = `${TEXT_BEFORE_NAME}${allArtistsInString} > ${nameBySubstr}`; // ` ${currentTimer}`;

    log(`Curently status: ${status}`);

    await telegramClient.updateProfile({ about: status });
    log('Telegram bio updated');

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
