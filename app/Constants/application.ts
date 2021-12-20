const base = '/api';

export default {
    url: {
        base,
    },
    timers: {

    },
    env: {

    },
    authorizationIgnorePath: [
        `${base}/user/login`,
        `${base}/user/register`,
        `${base}/customer/register`,
        `${base}/customer/fetch/customers-details`,
    ],
};
