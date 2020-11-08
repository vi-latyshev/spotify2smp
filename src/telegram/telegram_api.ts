import { MTProto } from '@mtproto/core';

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

/**
 * @todo update mtproto token storange to custom
 */
export class TelegramApi {
    private mproto: MTProto;

    constructor() {
        this.mproto = new MTProto({
            api_id: parseInt(TELEGRAM_API_ID),
            api_hash: TELEGRAM_API_HASH,
        });
    }

    // Auth

    public sendCode: SendCode = (params) => this.call('auth.sendCode', params);

    public signIn: SignIn = (params) => this.call('auth.signIn', params);

    public getPassword: GetPassword = () => this.call('account.getPassword');

    public checkPassword: CheckPassword = (params) => this.call('auth.checkPassword', params);

    // Account

    public updateProfile: UpdateProfile = (params) => this.call('account.updateProfile', params);

    // Users

    public getFullUser: GetFullUser = (params) => this.call('users.getFullUser', { id: params });

    // call api

    private call: CallApiFn = async (method, params, options) => (this.mproto
        .call(method, params as object, { syncAuth: true, ...options }) as Promise<any>)
        .catch(async (error: ICallError) => {
            if (IS_DEV === 'true') {
                // eslint-disable-next-line no-console
                console.warn(`call ${method} error:`, error);
            }
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { error_code, error_message } = error;

            let needReCall = false;

            switch (error_code) {
                case 303: {
                    const [type, dcId] = error_message.split('_MIGRATE_');

                    if (type === 'PHONE') {
                        await this.mproto.setDefaultDc(+dcId);
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
