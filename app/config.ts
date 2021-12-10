const env = process.env;

export = {
    DB : { /* don't expose password or any sensitive info, done only for demo */
        host: env.MASTER_DB_HOST || 'localhost',
        user: env.MASTER_DB_USER || 'root',
        password: env.MASTER_DB_PASSWORD || '9jy3LDBl',
        database: env.MASTER_DB_NAME || 'nidhi_bank',
    },
    listPerPage: env.LIST_PER_PAGE || 10
}