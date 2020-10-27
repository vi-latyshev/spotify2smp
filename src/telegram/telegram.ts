import { MTProto, getSRPParams } from '@mtproto/core';

import { prompt } from 'utils/prompt';
import { getRandomPhone } from 'telegram/utils/randomPhone';

import type {
    CallApiFn,
    CheckPassword,
    GetFullUser,
    GetPassword,
    ICallError,
    SendCode,
    SignIn,
    UpdateProfile,
} from './types';

const { IS_DEV, TELEGRAM_API_ID, TELEGRAM_API_HASH } = process.env;

export class TelegramClient {
    private api: MTProto;

    constructor() {
        this.api = new MTProto({
            api_id: parseInt(TELEGRAM_API_ID),
            api_hash: TELEGRAM_API_HASH,
            test: IS_DEV === 'true',
        });
    }

    // Auth

    /**
     * !! Implemented only for valid data !!
     *
     * !! Implemented only for password (2FA password) !!
     */
    public login = async () => {
        const phone = IS_DEV === 'true' ? getRandomPhone() : await prompt('Please enter your phone number');

        const sendCodeResult = await this.sendCode({
            phone_number: phone,
        });

        const code = IS_DEV === 'true' ? '22222' : await prompt('Please enter the secret code') ?? '';

        const signInResult = await this.signIn({
            phone_code: code,
            phone_number: phone,
            phone_code_hash: sendCodeResult.phone_code_hash,
        }).catch(async (error: ICallError) => {
            switch (error.error_message) {
                case 'SESSION_PASSWORD_NEEDED': {
                    return this.getPassword().then(async ({
                        srp_B,
                        srp_id,
                        current_algo,
                    }) => {
                        const {
                            g, p, salt1, salt2,
                        } = current_algo;

                        const password = IS_DEV === 'true' ? 'password' : await prompt('Please enter your password') ?? '';

                        const { A, M1 } = await getSRPParams({
                            g,
                            p,
                            salt1,
                            salt2,
                            gB: srp_B,
                            password,
                        });

                        return this.checkPassword({ srp_id, A, M1 });
                    });
                }
                default: break;
            }
            return Promise.reject(error);
        });

        return signInResult.user;
    };

    // Account

    public updateProfile: UpdateProfile = (params) => this.call('account.updateProfile', params);

    // Users

    public getFullUser: GetFullUser = (params) => this.call('users.getFullUser', { id: params });

    // private Auth

    private sendCode: SendCode = (params) => this.call('auth.sendCode', {
        settings: { _: 'codeSettings' },
        ...params,
    });

    private signIn: SignIn = (params) => this.call('auth.signIn', params);

    private getPassword: GetPassword = () => this.call('account.getPassword');

    private checkPassword: CheckPassword = (params) => this.call('auth.checkPassword', {
        password: {
            _: 'inputCheckPasswordSRP',
            ...params,
        },
    });

    // call api

    private call: CallApiFn = async (method, params, options) => (this.api
        .call(method, params as object, { syncAuth: true, ...options }) as Promise<any>)
        .catch(async (error: ICallError) => {
            // eslint-disable-next-line no-console
            console.warn(`call ${method} error:`, error);

            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { error_code, error_message } = error;

            let needReCall = false;

            switch (error_code) {
                case 303: {
                    const [type, dcId] = error_message.split('_MIGRATE_');

                    if (type === 'PHONE') {
                        await this.api.setDefaultDc(+dcId);
                    } else {
                        // eslint-disable-next-line no-param-reassign
                        options = {
                            ...options,
                            dcId: +dcId,
                        };
                    }
                    needReCall = true;
                    break;
                }
                case 500: {
                    switch (error_message) {
                        case 'AUTH_RESTART': needReCall = true; break;
                        default: break;
                    }
                    break;
                }
                default: break;
            }

            return needReCall
                ? this.call(method, params, options)
                : Promise.reject(error);
        }) as Promise<any>;
}
