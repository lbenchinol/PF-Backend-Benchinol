import http from 'http';

import app from './app.js';
import { init } from './db/mongodb.js';
import { initSocket } from './socket.js';

await init();

const server = http.createServer(app);
export const PORT = 8080;

const httpServer = server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

initSocket(httpServer);