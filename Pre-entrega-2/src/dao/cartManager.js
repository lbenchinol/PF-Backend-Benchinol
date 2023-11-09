import CartModel from '../models/cart.model.js';
import { Exception } from '../utils.js';
import ProductManager from './productManager.js';

export default class CartManager {
    static async addCart() {
        const newCart = { products: [] };
        await CartModel.create(newCart);
    }

    static async updateCart(cId, pId, quantity) {
        const cart = (await CartModel.findById(cId)).toJSON();
        const product = await ProductManager.getProductById(pId);
        if (!cart) {
            throw new Exception(`Error, el ID:${cId} no se encontró en el listado de carritos`, 404);
        } if (!product) {
            throw new Exception(`Error, el ID:${pId} no se encontró en el listado de productos`, 404);
        } else if (quantity < 1) {
            throw new Exception(`Error, la cantidad a agregar debe ser mayor o igual a 1`, 400);
        } else if (cart.products.find(p => p.product === pId)) {
            const newProducts = cart.products.map((p) => {
                if (p.product === pId) {
                    p.quantity += quantity;
                    return p;
                } else {
                    return p;
                }
            });
            cart.products = newProducts;
        } else {
            cart.products.push({ product: pId, quantity });
        }
        const filter = { _id: cId };
        const operation = { $set: cart };
        await CartModel.updateOne(filter, operation);

    }

    static async deleteCart(id) {
        if (!await CartModel.findById(id)) {
            throw new Exception(`Error, el ID:${id} no se encontró en el listado de carritos`, 404);
        } else {
            const filter = { _id: id };
            await CartModel.deleteOne(filter);
        }
    }

    static async getCarts(query = {}) {
        const filter = {};
        const carts = await CartModel.find(filter).limit(query);
        return carts.map(c => c.toJSON());
    }

    static async getCartById(id) {
        const cart = await CartModel.findById(id);
        if (!cart) {
            throw new Exception(`Error, el ID:${id} no se encontró en el listado de carritos`, 404);
        } else {
            return cart.toJSON();
        }
    }
}