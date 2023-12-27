import TicketService from "../services/ticket.service.js";
import { NotFoundException } from "../utils.js";
import ProductController from "./product.controller.js";
import UserController from "./user.controller.js";

export default class TicketController {
    static async create(cId, products) {
        const email = (await UserController.get(`cart: ${cId}`)).email;
        if (!email) {
            throw new NotFoundException('Carrito de usuario no encontrado');
        }

        const amount = products.reduce(async (total, p) => {
            const price = (await ProductController.getById(p.product)).price;
            return total + price * p.quantity;
        });

        let code = Date.now();
        let condition = false;
        do {
            const checkedCode = await TicketController.get(`code: ${code}`);
            if (!checkedCode) {
                condition = true;
            } else {
                code++;
            }
        } while (condition);

        const data = { code, purchase_datetime: '', amount, purchaser: email };
        await TicketService.create(data);

        const ticket = await TicketController.get(`code: ${code}`);
        const dataUpdated = `purchase_datetime:${ticket.createdAt}`;
        return await TicketController.updateById(ticket._id, dataUpdated);
    }

    static get(criteria = {}) {
        return TicketService.get(criteria);
    }

    static getById(id) {
        return TicketService.getById(id);
    }

    static updateById(id, data) {
        return TicketService.updateById(id, data);
    }

    static deleteById(id) {
        return TicketService.deleteById(id);
    }
}