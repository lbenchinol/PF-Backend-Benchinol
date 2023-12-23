import CartService from '../services/cart.service.js';
import ProductController from './product.controller.js';

export default class CartController {
    static async get() {
        return await CartService.get();
    }

    static async getById(id) {
        const cart = await CartService.getById(id);
        if (!cart) {
            throw new Exception(`Error, el ID:${id} no se encontró en el listado de carritos`, 404);
        } else {
            return cart;
        }
    }

    static async create() {
        const newCart = { products: [] };
        return await CartService.create(newCart);
    }

    static async updateById(cId, pId, quantity) {
        const cart = await CartController.getById(cId);
        const product = await ProductController.getById(pId);
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
        return await CartService.updateById(cId, cart);
    }

    static async updateWholeCart(id, newProducts) {
        const cart = await CartController.getById(id);
        if (!newProducts) {
            throw new Exception(`Error, ingrese los datos correctamente`, 400);
        }
        cart.products = newProducts;
        return await CartService.updateById(id, cart);
    }

    static async deleteById(id) {
        const cart = await CartController.getById(id);
        if (!cart) {
            throw new Exception(`Error, el ID:${id} no se encontró en el listado de carritos`, 404);
        }
        cart.products = [];
        return CartController.updateWholeCart(id, cart);
    }

    static async deleteProductByIdOnCart(cId, pId) {
        const cart = await CartController.getById(cId);
        const product = await ProductController.getById(pId);
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
        return await CartController.updateWholeCart(cId, cart);
    }
}