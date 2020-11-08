// All variables with type 'boolean' checking as 'string' - "VAR === 'true'"

declare namespace NodeJS {
    export interface ProcessEnv {
        // App

        /**
         * if 'true' then will be showing more debug information
         * @type {boolean}
         */
        IS_DEV: string;
        /**
         * Needs set if you will be deploy on other server (Heroku / Glitch / self hosted)
         *
         * @example 'your-name-app.herokuapp.com'
         * @default 'localhost:${PORT}'
         */
        HOST: string;

        /**
         * Text before artists/name of track
         *
         * @default 'Now listening:'
         */
        TEXT_BEFORE_STATUS: string;

        // modules

        /**
         * Turn on module
         * %MODULE_NAME% with !UPPER CASE!
         *
         * @type {boolean}
         *
         * @example TELEGRAM = true
         */
        /**
         * Default status
         *
         * %MODULE_NAME%_DEFAULT_STATUS
         *
         * @example TELEGRAM_DEFAULT_STATUS = 'this is default status'
         */

        // Api client secrets

        // Spotify

        SPOTIFY_CLIENT_ID: string;
        SPOTIFY_CLIENT_SECRET: string;

        // Telegram

        TELEGRAM_API_ID: string;
        TELEGRAM_API_HASH: string;
    }
}
