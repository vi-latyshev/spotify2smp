export const convertMsToTime = (miliseconds: number | string) => {
    const totalSeconds = Math.floor(parseInt(miliseconds as string) / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);

    const seconds = totalSeconds % 60;
    const minutes = totalMinutes % 60;
    const hours = totalHours % 24;

    const daysInString = days > 0 ? `${days}d ` : '';
    const hoursInString = hours > 0 ? `${hours}:` : '';
    const secondsInString = seconds < 10 ? `0${seconds}` : seconds;

    return `${daysInString}${hoursInString}${minutes}:${secondsInString}`;
};
