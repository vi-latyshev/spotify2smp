import 'dotenv/config';

import { SpotifyClient } from 'spotify';
// import { TelegramClient } from 'telegram';

// const { TELEGRAM_DEFAULT_BIO } = process.env;

// const client = new TelegramClient();

// client.login().then(async () => {
//     const fullUser = await client.getFullUser({ _: 'inputUserSelf' });
//     console.log(fullUser, 'fullUser');
//     await client.updateProfile({ about: TELEGRAM_DEFAULT_BIO });
//     const updatedfullInfo = await client.getFullUser({ _: 'inputUserSelf' });
//     console.log(updatedfullInfo, 'updatedfullInfo');
// });

const spotifyClient = new SpotifyClient();

spotifyClient.login().then((token) => {
    console.log(token, 'token');
});
