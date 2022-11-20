const env = process.env;

export = {
    DB : { /* don't expose password or any sensitive info, done only for demo */
        host: env.MASTER_DB_HOST || 'localhost'
        ,
        user: env.MASTER_DB_USER || 'root'
        ,
        password: env.MASTER_DB_PASSWORD  || 'root@123'
        ,
        database: env.MASTER_DB_NAME || 'biofuel_updated'
        ,
        timezone: 'utc'
    },
    JwtToken: {
        secretKey : process.env.JWT_TOKEN_SECRET_KEY || 'my_secret_key',
        expiry : process.env.JWT_TOKEN_EXPIRY || '1d'
    },
    baseUrl: "http://qa1.digitalflake.com",
    listPerPage: env.LIST_PER_PAGE || 10
}
    process.env.AWS_BUCKET_NAME = "digi-qa-s3",
    process.env.AWS_BUCKET_REGION = "ap-south-1",
    process.env.AWS_ACCESS_KEY = "AKIA4FVNO3EYUANR25WJ",
    process.env.AWS_SECRET_KEY = "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"