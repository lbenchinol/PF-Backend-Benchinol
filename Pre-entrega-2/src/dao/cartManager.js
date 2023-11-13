import CartModel from '../models/cart.model.js';
import { Exception } from '../utils.js';
import ProductManager from './productManager.js';

export default class CartManager {
    static async addCart() {
        const newCart = { products: [] };
        await CartModel.create(newCart);
    }

    static async updateWholeCart(id, newProducts) {
        const cart = (await CartModel.findById(id)).toJSON();
        cart.products = newProducts;
        const filter = { _id: id };
        const operation = { $set: cart };
        await CartModel.updateOne(filter, operation);
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
        } else if (cart.products.find(p => p.product == pId)) {
            const newProducts = cart.products.map((p) => {
                if (p.product == pId) {
                    p.quantity = quantity;
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
            const cart = (await CartModel.findById(id)).toJSON();
            cart.products = [];
            const filter = { _id: id };
            const operation = { $set: cart };
            await CartModel.updateOne(filter, operation);
        }
    }

    static async deleteProductByIdOnCart(cId, pId) {
        const cart = (await CartModel.findById(cId)).toJSON();
        const product = await ProductManager.getProductById(pId);
        if (!cart) {
            throw new Exception(`Error, el ID:${cId} no se encontró en el listado de carritos`, 404);
        }
        if (!product) {
            throw new Exception(`Error, el ID:${pId} no se encontró en el listado de productos`, 404);
        }
        const productIndex = cart.products.findIndex(p => p.product.toString() == pId);
        if (productIndex != -1) {
            cart.products.splice(productIndex, 1);
        }
        const filter = { _id: cId };
        const operation = { $set: cart };
        await CartModel.updateOne(filter, operation);
    }

    static async getCarts() {
        const carts = await CartModel.find();
        return carts.map(c => c.toJSON());
    }

    static async getCartById(id) {
        const cart = await CartModel.findById(id).populate('products.product');
        if (!cart) {
            throw new Exception(`Error, el ID:${id} no se encontró en el listado de carritos`, 404);
        } else {
            return cart;
        }
    }
}