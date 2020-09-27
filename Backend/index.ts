
import dotenv from 'dotenv';
import http from 'http';
import app from './src/app';
import logger from './src/utils/winston';

dotenv.config();


/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val: string) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
};

/**
 * Get port from environment and store in Express.
 */
const envPort = process.env.PORT;
const port = normalizePort(envPort ? envPort : "4001");
app.set('port', port);

const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error: any) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
    
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.debug(`${bind} requires elevated privileges`);
            process.exit(1);
        case 'EADDRINUSE':
            logger.debug(`${bind} is already in use`);
            process.exit(1);
        default:
            throw error;
    }
};

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = async() => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr!.port}`;
    logger.info(`Listening on ${bind}`);
};

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
//server.timeout = 240000;

export default server;