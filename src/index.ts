import * as http from 'http';
import * as logger from "winston";

import App from './App';

const PORT = process.env.PORT || 3000;

const app = new App();

app.express.set('port', PORT);
const server = http.createServer(app.express);
server.listen(PORT);

logger.configure({
    transports: [
        new logger.transports.Console({
            colorize: true
        })
    ]
});

server.on('error', onError);
server.on('listening', onListening);

function onError(error: NodeJS.ErrnoException): void {
    logger.error("Error starting service");
}

function onListening(): void {
    logger.info("Service listening on " + PORT);
}