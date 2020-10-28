// All variables with type 'boolean' checking as 'string' - "VAR === 'true'"

declare namespace NodeJS {
    export interface ProcessEnv {
        // App

        /**
         * @type {boolean}
         */
        IS_DEV: string;

        /**
         * Needs set if you will be deploy on other server (Heroku / Glitch / self hosted)
         *
         * @example 'your-name-app.herokuapp.com'
         * @default 'http://localhost:${PORT}'
         */
        HOST: string;

        // Spotify

        SPOTIFY_CLIENT_ID: string;
        SPOTIFY_CLIENT_SECRET: string;

        // Telegram

        /**
         * Update telegram bio
         *
         * @type {boolean}
         */
        TELEGRAM: string;

        TELEGRAM_API_ID: string;
        TELEGRAM_API_HASH: string;

        TELEGRAM_DEFAULT_BIO: string;
    }
}
