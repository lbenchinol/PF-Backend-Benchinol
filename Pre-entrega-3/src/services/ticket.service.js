import TicketDao from '../dao/ticket.dao.js';

export default class TicketService {
    static create(data) {
        return TicketDao.create(data);
    }

    static async get(criteria={}) {
        const tickets = await TicketDao.get(criteria);
        return tickets.map(t => t.toJSON());
    }

    static async getById(id) {
        const ticket = await TicketDao.getById(id);
        return ticket.toJSON();
    }

    static updateById(id, ticketUpdated) {
        return TicketDao.updateById(id, ticketUpdated);
    }

    static deleteById(id) {
        return TicketDao.deleteById(id);
    }
}