const env = process.env;

export = {
    DB : { /* don't expose password or any sensitive info, done only for demo */
        host: env.MASTER_DB_HOST || 'localhost',
        user: env.MASTER_DB_USER || 'root',
        password: env.MASTER_DB_PASSWORD || '@Patil360',
        database: env.MASTER_DB_NAME || 'dhani',
        timezone: 'utc'
    },
    JwtToken: {
        secretKey : process.env.JWT_TOKEN_SECRET_KEY || 'test',
        expiry : process.env.JWT_TOKEN_EXPIRY || '1d'
    },

    listPerPage: env.LIST_PER_PAGE || 10
}