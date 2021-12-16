const base = '/api';

export default {
    url: {
        base,
    },
    timers: {
        userCookieExpiry: '720h',
    },
    env: {

    },
    authorizationIgnorePath: [
        `${base}/user/login`,
        ,
    ],
};
