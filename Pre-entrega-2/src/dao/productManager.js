import ProductModel from '../models/product.model.js';
import { Exception } from '../utils.js';
import { PORT } from '../server.js';

export default class ProductManager {
    static async addProduct(product) {
        const products = await ProductModel.find();

        let { title, description, price, thumbnail, code, stock, category, status } = product;

        title !== "" ? title.trim() : title;
        description !== "" ? description.trim() : description;
        thumbnail !== "" ? thumbnail.trim() : thumbnail;
        code !== "" ? code.trim() : code;
        category !== "" ? category.trim() : category;
        status = true;

        const newProduct = { title, description, price, thumbnail, code, stock, category, status };

        if (title == "" || description == "" || price < 0 || code == "" || stock < 0 || category == "") {
            throw new Exception('Ingrese los valores correctamente', 400);
        } else {
            if (products.find(p => p.code === code)) {
                throw new Exception(`Error, el campo code (${code}) ya se encuentra en el listado de productos`, 400);
            } else {
                await ProductModel.create(newProduct);
                return newProduct;
            }
        }
    }

    static async updateProduct(id, productUpdated) {
        const { title, description, price, thumbnail, code, stock, category, status } = productUpdated;

        title !== "" ? title.trim() : title;
        description !== "" ? description.trim() : description;
        thumbnail !== "" ? thumbnail.trim() : thumbnail;
        code !== "" ? code.trim() : code;
        category !== "" ? category.trim() : category;

        if (title == "" || description == "" || price < 0 || code == "" || stock < 0 || category == "") {
            throw new Exception('Ingrese los valores correctamente', 400);
        }

        const newProduct = { title, description, price, thumbnail, code, stock, category, status };

        const product = await ProductModel.findById(id);

        if (!product) {
            throw new Exception(`Error, el ID:${id} no se encontró en el listado de productos`, 404);
        } else {
            const filter = { _id: id };
            const operation = { $set: newProduct };
            await ProductModel.updateOne(filter, operation);
        }
    }

    static async deleteProduct(id) {
        if (!await ProductModel.findById(id)) {
            throw new Exception(`Error, el ID:${id} no se encontró en el listado de productos`, 404);
        } else {
            const filter = { _id: id };
            await ProductModel.deleteOne(filter);
        }
    }

    static async getProducts(limit = 10, page = 1, sort, category, stock) {
        const opts = {};
        const criteria = {};


        if (parseInt(limit) < 1) {
            throw new Exception(`Error, ingrese los valores de "limit" correctamente.`, 400);
        } else {
            opts.limit = limit;
        }
        if (parseInt(page) < 1) {
            throw new Exception(`Error, ingrese los valores de "page" correctamente.`, 400);
        } else {
            opts.page = page;
        }
        if (sort) {
            if (sort !== "asc" && sort !== "desc") {
                throw new Exception(`Error, ingrese los valores de "sort" correctamente.`, 400);
            } else {
                opts.sort = { price: sort };
            }
        }
        if (category) {
            criteria.category = category;
        }
        if (stock) {
            if (parseInt(stock) < 1) {
                throw new Exception(`Error, ingrese los valores de "stock" correctamente.`, 400);
            } else {
                criteria.stock = stock;
            }
        }

        const data = await ProductModel.paginate(criteria, opts);
        const products = {
            status: 'success',
            payload: data.docs.map(d => d.toJSON()),
            totalPages: data.totalPages,
            prevPage: data.prevPage,
            nextPage: data.nextPage,
            page: data.page,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevLink: data.prevPage ? `http://localhost:${PORT}/products?limit=${data.limit}&page=${data.prevPage}${data.category ? `&category=${data.category}` : ''}${data.stock ? `&stock=${data.stock}` : ''}` : '',
            nextLink: data.nextPage ? `http://localhost:${PORT}/products?limit=${data.limit}&page=${data.nextPage}${data.category ? `&category=${data.category}` : ''}${data.stock ? `&stock=${data.stock}` : ''}` : '',
        };

        return products;
    }

    static async getProductById(id) {
        const product = await ProductModel.findById(id);
        if (!product) {
            throw new Exception(`Error, el ID:${id} no se encontró en el listado de productos`, 404);
        } else {
            return product.toJSON();
        }
    }
}