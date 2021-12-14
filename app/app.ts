import LOGGER from './config/LOGGER';
import app from './config/express';
import mysql from './utilities/mysql'
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
LOGGER.info(`Server running at ${PORT}`);
});

