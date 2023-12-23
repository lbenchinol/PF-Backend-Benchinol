import http from 'http';
import config from './config/config.js';

import app from './app.js';
import { init } from './db/mongodb.js';
import { initSocket } from './socket.js';

await init();

const server = http.createServer(app);
export const PORT = config.port;

const httpServer = server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

initSocket(httpServer);