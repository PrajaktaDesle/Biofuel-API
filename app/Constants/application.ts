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
        `${base}/admin/sign-in`,
        `${base}/product/raw_materials/all`,
        `${base}/product/packaging/all`,
        `${base}/address/states/all`,
        `${base}/address/cities/all`,
        `${base}/address/cities-by-state`,
    ],
};



