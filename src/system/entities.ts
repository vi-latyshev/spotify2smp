export interface IModule {
    authorization: () => Promise<void>;
}

export interface IModuleStatus {
    updateStatus: (status: string) => Promise<void>;

    getSelf: () => Promise<any>;
}
