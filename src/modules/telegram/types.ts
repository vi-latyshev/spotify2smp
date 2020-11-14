// https://github.com/airgram/airgram/tree/mtproto/src/api/types

export type CallApiFn = <Params extends object, Response> (
    method: string,
    params?: Params,
    options?: CallOptions
) => Promise<Response>;

export type CallOptions = {
    dcId?: number;
    syncAuth?: boolean;
};

export interface ICallError extends Error {
    error_code: number;
    error_message: string;
}

export type SendCode = (params: ISendCodeParams) => Promise<IAuthSentCode>;

export type SignIn = (params: ISignInParams) => Promise<IAuthAuthorizationUnion>;

export type GetPassword = () => Promise<IAccountPassword>;

export type CheckPassword = (params: ICheckPasswordParams) => Promise<IAuthAuthorizationUnion>;

export type UpdateProfile = (params: IUpdateProfileParams) => Promise<IUser>;

export type GetFullUser = (params: IGetFullUser) => Promise<IUserFull>;

interface ISendCodeParams {
    settings: CodeSettings,
    phone_number: string,
}

interface IAuthSentCode {
    _: 'auth.sentCode';
    flags: number;
    phone_registered?: true;
    type: AuthSentCodeTypeUnion;
    phone_code_hash: string;
    next_type?: AuthCodeTypeUnion;
    timeout?: number;
}

interface AuthSentCodeTypeApp {
    _: 'auth.sentCodeTypeApp';
    length: number;
}

interface AuthSentCodeTypeCall {
    _: 'auth.sentCodeTypeCall';
    length: number;
}

interface AuthSentCodeTypeFlashCall {
    _: 'auth.sentCodeTypeFlashCall';
    pattern: string;
}

interface AuthSentCodeTypeSms {
    _: 'auth.sentCodeTypeSms';
    length: number;
}

interface CodeSettings {
    _: 'codeSettings';
}

// https://github.com/typescript-eslint/typescript-eslint/issues/1824
// eslint-disable-next-line max-len
type AuthSentCodeTypeUnion = AuthSentCodeTypeApp | AuthSentCodeTypeCall | AuthSentCodeTypeFlashCall | AuthSentCodeTypeSms;

interface AuthCodeTypeCall {
    _: 'auth.codeTypeCall';
}

interface AuthCodeTypeFlashCall {
    _: 'auth.codeTypeFlashCall';
}

interface AuthCodeTypeSms {
    _: 'auth.codeTypeSms';
}

type AuthCodeTypeUnion = AuthCodeTypeCall | AuthCodeTypeFlashCall | AuthCodeTypeSms;

interface ISignInParams {
    phone_code: string,
    phone_code_hash: string,
    phone_number: string;
}

interface AuthAuthorization {
    _: 'auth.authorization';
    flags: number;
    tmp_sessions?: number;
    user: UserUnion;
}

interface AuthAuthorizationSignUpRequired {
    _: 'auth.authorizationSignUpRequired';
    user: UserUnion;
    // some...
}

type IAuthAuthorizationUnion = AuthAuthorization | AuthAuthorizationSignUpRequired;

interface IAccountPassword {
    _: 'password',
    flags: number;
    has_recovery?: true;
    has_secure_values?: true;
    has_password?: true;
    current_algo: PasswordKdfAlgo;
    srp_B: Uint8Array;
    srp_id: number;
    hint?: string;
    email_unconfirmed_pattern?: string;
    new_algo: PasswordKdfAlgo;
    new_secure_algo: SecurePasswordKdfAlgo;
    secure_random: number;
}

interface IUser {
    _: 'user';
    flags: number;
    self?: true;
    contact?: true;
    mutual_contact?: true;
    deleted?: true;
    bot?: true;
    bot_chat_history?: true;
    bot_nochats?: true;
    verified?: true;
    restricted?: true;
    min?: true;
    bot_inline_geo?: true;
    id: number;
    access_hash?: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    phone?: string;
    photo?: object; // UserProfilePhotoUnion;
    status?: object; // UserStatusUnion;
    bot_info_version?: number;
    restriction_reason?: string;
    bot_inline_placeholder?: string;
    lang_code?: string;
}

interface UserEmpty {
    _: 'userEmpty';
    id: number;
}

export type UserUnion = IUser | UserEmpty;

interface PasswordKdfAlgo {
    salt1: Uint8Array;
    salt2: Uint8Array;
    g: number;
    p: Uint8Array;
}

interface SecurePasswordKdfAlgo {
    salt: number;
}

interface ICheckPasswordParams {
    password: IInputCheckPasswordEmpty | IInputCheckPasswordSRP;
}

interface IInputCheckPasswordEmpty {
    _: 'inputCheckPasswordEmpty';
}

interface IInputCheckPasswordSRP {
    _: 'inputCheckPasswordSRP';
    srp_id: number;
    A: Uint8Array;
    M1: Uint8Array;
}

interface IUpdateProfileParams {
    first_name?: string;
    last_name?: string;
    about?: string;
}

interface IGetFullUser {
    _?: 'inputUserEmpty' | 'inputUserSelf' | 'inputUser' | 'inputUserFromMessage';
    user_id?: number;
    access_hash?: number;
}

interface IUserFull {
    flags: number;
    blocked?: true;
    phone_calls_available?: true;
    phone_calls_private?: true;
    can_pin_message?: true;
    has_scheduled?: true;
    user: UserUnion;
    about?: string;
    settings: object; // PeerSettings;
    profile_photo?: object; // Photo;
    notify_settings: object; // PeerNotifySettings
    bot_info?: object; // BotInfo
    pinned_msg_id?: number;
    common_chats_count: number;
    folder_id?: number;
}
