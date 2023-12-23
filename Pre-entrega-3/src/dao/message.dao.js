import MessageModel from '../models/message.model.js';

export default class MessageDao {
    static async addMessage(data) {
        await MessageModel.create(data);
    }

    static async getMessages() {
        const messages = await MessageModel.find();
        return messages.map(m => m.toJSON());
    }
}