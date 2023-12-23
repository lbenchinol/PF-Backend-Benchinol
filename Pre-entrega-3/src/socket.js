import { Server } from 'socket.io';

import ProductController from './controllers/product.controller.js';
import MessageDao from './dao/message.dao.js';

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer);

    io.on('connection', async (socketClient) => {
        console.log(`Nuevo cliente conectado (${socketClient.id})`);

        /*      -----  Products -----        */

        const products = await ProductController.get();
        socketClient.emit('products-list-updated', { products });

        /*      -----  Chat -----        */

        const messages = await MessageDao.getMessages();
        socketClient.emit('chat-updated', { messages });

        socketClient.on('new-message', async (data) => {
            await MessageDao.addMessage(data);
            const messages = await MessageDao.getMessages();
            io.emit('chat-updated', { messages });
        });

        socketClient.on('disconnect', () => {
            console.log(`Se ha desconectado el cliente (${socketClient.id})`);
        });
    });
}

export const emitFromApi = (event, data) => io.emit(event, data);