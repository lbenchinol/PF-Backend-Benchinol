import ProductService from '../services/product.service.js';
import { PORT } from '../server.js';

export default class ProductController {
    static async get(limit = 10, page = 1, sort, category, stock) {
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

        const data = await ProductService.get(criteria, opts);
        const products = {
            status: 'success',
            payload: data.docs.map(d => d.toJSON()),
            totalPages: data.totalPages,
            prevPage: data.prevPage,
            nextPage: data.nextPage,
            page: data.page,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevLink: data.prevPage ? `http://localhost:${PORT}/products?limit=${data.limit}&page=${data.prevPage}${data.category ? `&category=${data.category}` : ''}${data.stock ? `&stock=${data.stock}` : ''}` : null,
            nextLink: data.nextPage ? `http://localhost:${PORT}/products?limit=${data.limit}&page=${data.nextPage}${data.category ? `&category=${data.category}` : ''}${data.stock ? `&stock=${data.stock}` : ''}` : null,
        };

        return products;
    }

    static async getById(id) {
        const product = await ProductService.getById(id);
        if (!product) {
            throw new Exception(`Error, el ID:${id} no se encontró en el listado de productos`, 404);
        } else {
            return product;
        }
    }

    static async create(product) {
        const rawProducts = await ProductController.get();
        const products = rawProducts.payload;

        let { title, description, price, thumbnail, code, stock, category, status } = product;

        title !== "" ? title.trim() : title;
        description !== "" ? description.trim() : description;
        thumbnail !== "" ? thumbnail.trim() : thumbnail;
        code !== "" ? code.trim() : code;
        category !== "" ? category.trim() : category;
        status = true;

        if (title == "" || description == "" || price < 0 || code == "" || stock < 0 || category == "") {
            throw new Exception('Ingrese los valores correctamente', 400);
        } else {
            if (products.find(p => p.code === code)) {
                throw new Exception(`Error, el campo code (${code}) ya se encuentra en el listado de productos`, 400);
            } else {
                const newProduct = { title, description, price, thumbnail, code, stock, category, status };
                return await ProductService.create(newProduct);
            }
        }
    }

    static async updateById(id, productToUpdate) {
        const { title, description, price, thumbnail, code, stock, category, status } = productToUpdate;

        title !== "" ? title.trim() : title;
        description !== "" ? description.trim() : description;
        thumbnail !== "" ? thumbnail.trim() : thumbnail;
        code !== "" ? code.trim() : code;
        category !== "" ? category.trim() : category;

        if (title == "" || description == "" || price < 0 || code == "" || stock < 0 || category == "") {
            throw new Exception('Ingrese los valores correctamente', 400);
        }

        const productUpdated = { title, description, price, thumbnail, code, stock, category, status };

        const product = await ProductController.getById(id);

        if (!product) {
            throw new Exception(`Error, el ID:${id} no se encontró en el listado de productos`, 404);
        } else {
            return ProductService.updateById(id, productUpdated);
        }
    }

    static async deleteById(id) {
        if (!await ProductController.getById(id)) {
            throw new Exception(`Error, el ID:${id} no se encontró en el listado de productos`, 404);
        } else {
            return await ProductService.deleteById(id);
        }
    }
}