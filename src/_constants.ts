const { HOST, PORT } = process.env;

export const PROJECT_NAME = process.env.npm_package_name as string;

export const SERVER_HOST = HOST ?? 'localhost';
export const SERVER_PORT = PORT ?? 3005;
export const SERVER_URI = `http://${SERVER_HOST}:${SERVER_PORT}/`;
