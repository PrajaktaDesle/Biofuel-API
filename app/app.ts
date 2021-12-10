import LOGGER from './config/LOGGER';
import app from './config/express';
import mysql from './utilities/mysql'
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    if(!mysql.instance.connected){
        LOGGER.info(`Database connection not available`);
    }
LOGGER.info(`Server running at ${PORT}`);
});

