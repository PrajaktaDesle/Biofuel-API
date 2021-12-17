import router from "../Routes";

const axios = require('axios').default;

const data = JSON.stringify({
    "email": "cjadhav.it@gmail.com",
    "password": "q21asdasd"
});

const config = {
    method: 'post',
    url: 'localhost:3002/api/user/rejkhkh',
    headers: {
        'Content-Type': 'application/json',
        'tenant-id': '1',
        'cookie': 'x-DigiFlake-Token=hgasfdhfahsdf;'
    },
    data: data
};

axios(config)
    .then(function (response:any) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error:any) {
        console.log(error);
    });

export default config;