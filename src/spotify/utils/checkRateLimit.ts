/**
 * If getted 'rate limit' then will be waiting 'retry secs' and called callback
 * https://developer.spotify.com/documentation/web-api/#rate-limiting
 */
export const checkRateLimit = async (
    log: debug.Debugger,
    headers: Record<string, string>,
    callback: () => Promise<any>,
) => {
    const retryIn = headers['Retry-After'];

    if (retryIn === undefined) {
        return Promise.resolve();
    }
    const retryInNumber = parseInt(retryIn);

    log(`Rate limit. Next request in ${retryInNumber} sec`);

    return new Promise<void>((resolve) => {
        setTimeout(async () => {
            await callback();
            resolve();
        }, retryInNumber * 1000);
    });
};
