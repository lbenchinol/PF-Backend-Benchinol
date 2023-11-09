import { Server } from 'socket.io';

import ProductManager from './dao/productManager.js';
import MessageManager from './dao/messageManager.js';

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer);

    io.on('connection', async (socketClient) => {
        console.log(`Nuevo cliente conectado (${socketClient.id})`);

        /*      -----  Products -----        */

        const products = await ProductManager.getProducts();
        socketClient.emit('products-list-updated', { products });

        /*      -----  Chat -----        */

        const messages = await MessageManager.getMessages();
        socketClient.emit('chat-updated', { messages });

        socketClient.on('new-message', async (data) => {
            await MessageManager.addMessage(data);
            const messages = await MessageManager.getMessages();
            io.emit('chat-updated', { messages });
        });

        socketClient.on('disconnect', () => {
            console.log(`Se ha desconectado el cliente (${socketClient.id})`);
        });
    });
}

export const emitFromApi = (event, data) => io.emit(event, data);