import TicketService from "../services/ticket.service.js";
import { NotFoundException } from "../utils.js";
import ProductController from "./product.controller.js";
import UserController from "./user.controller.js";

export default class TicketController {
    static async create(cId, products) {
        const user = await UserController.find({ cart: cId });
        if (!user) {
            throw new NotFoundException('Carrito de usuario no encontrado');
        }

        let amount = 0;
        products.forEach(async p => {
            const product = await ProductController.getById(p.product);
            amount += (product.price * p.quantity);
        });

        let code = Date.now();
        let condition = false;
        do {
            const checkedCode = await TicketController.get({ code: code });
            if (!checkedCode) {
                condition = true;
            } else {
                code++;
            }
        } while (condition);

        const data = { code, purchase_datetime: new Date().toString(), amount, purchaser: user.email };
        await TicketService.create(data);
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