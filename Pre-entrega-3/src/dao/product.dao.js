import ProductModel from '../models/product.model.js';

export default class ProductDao {
    static get(criteria, opts) {
        return ProductModel.paginate(criteria, opts);
    }

    static getById(id) {
        return ProductModel.findById(id);
    }

    static create(product) {
        return ProductModel.create(product);
    }

    static updateById(id, productUpdated) {
        return ProductModel.updateOne({ _id: id }, { $set: productUpdated });
    }

    static deleteById(id) {
        return ProductModel.deleteOne({ _id: id });
    }
}