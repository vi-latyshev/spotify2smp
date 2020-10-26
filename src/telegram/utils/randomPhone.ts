const phoneTemplate = '999662';

const getRandomArbitrary = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

export const getRandomPhone = () => phoneTemplate + getRandomArbitrary(1000, 9999);
