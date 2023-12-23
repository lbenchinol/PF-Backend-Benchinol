import CartModel from '../models/cart.model.js';

export default class CartDao {
    static get() {
        return CartModel.find();
    }

    static getById(id) {
        return CartModel.findById(id).populate('products.product');
    }

    static create(data) {
        return CartModel.create(data);
    }

    static updateById(id, cartUpdated) {
        return CartModel.updateOne({ _id: id }, { $set: cartUpdated });
    }

    static deleteById(id) {
        return CartModel.deleteOne({ _id: id });
    }
}