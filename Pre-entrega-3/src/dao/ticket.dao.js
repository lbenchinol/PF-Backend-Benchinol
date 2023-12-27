import TicketModel from '../models/ticket.model.js';

export default class TicketDao {
    static create(data) {
        return TicketModel.create(data);
    }

    static get(criteria={}) {
        return TicketModel.find(criteria);
    }

    static getById(id) {
        return TicketModel.findById(id);
    }

    static updateById(id, ticketUpdated) {
        return TicketModel.updateOne({ _id: id }, { $set: ticketUpdated });
    }

    static deleteById(id) {
        return TicketModel.deleteOne({ _id: id });
    }
}