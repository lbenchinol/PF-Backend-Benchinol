import ProductDao from '../dao/product.dao.js';

export default class ProductService {
    static get(criteria, opts) {
        return ProductDao.get(criteria, opts);
    }

    static async getById(id) {
        const product = await ProductDao.getById(id);
        return product.toJSON();
    }

    static create(product) {
        return ProductDao.create(product);
    }

    static updateById(id, productUpdated) {
        return ProductDao.updateById(id, productUpdated);
    }

    static deleteById(id) {
        return ProductDao.deleteById(id);
    }
}