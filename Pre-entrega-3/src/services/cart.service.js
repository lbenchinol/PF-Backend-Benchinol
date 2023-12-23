import CartDao from '../dao/cart.dao.js';

export default class CartService {
    static async get() {
        const carts = await CartDao.get();
        return carts.map(c => c.toJSON());
    }

    static async getById(id) {
        const cart = await CartDao.getById(id);
        return cart.toJSON();
    }

    static create(data) {
        return CartDao.create(data);
    }

    static updateById(id, cartUpdated) {
        return CartDao.updateById(id, cartUpdated);
    }

    static deleteById(id) {
        return CartDao.deleteById(id);
    }
}