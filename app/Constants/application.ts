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
        `${base}/supplier/register`,
        `${base}/supplier/login`,
        `${base}/supplier/verify-OTP`,
        `${base}/admin/sign-in`
    ],
};