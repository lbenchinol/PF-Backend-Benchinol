import * as fs from 'node:fs';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {
        const products = await getJSON(this.path);
        let { title, description, price, thumbnail, code, stock, category, status } = product;
        title !== "" ? title.trim() : title;
        description !== "" ? description.trim() : description;
        thumbnail !== "" ? thumbnail.trim() : thumbnail;
        code !== "" ? code.trim() : code;
        category !== "" ? category.trim() : category;
        status = true;
        const newProduct = { title, description, price, thumbnail, code, stock, category, status };

        if (title == "" || description == "" || price < 0 || code == "" || stock < 0 || category == "") {
            console.log('Ingrese los valores correctamente');
        } else {
            if (products.find(p => p.code === code)) {
                console.log(`Error, el campo code (${code}) del producto "${title}" ya se encuentra en el listado de productos`);
            } else {
                let counter = 1;
                let condition = true;
                do {
                    if (products.find(p => p.id === counter)) {
                        counter++;
                    } else {
                        condition = false;
                    }
                } while (condition);

                products.push({ id: counter, ...newProduct });
                console.log(`Producto "${title}" agregado correctamente`);
            }
        }
        await saveJSON(this.path, products);
    }

    async updateProduct(id, productUpdated) {
        const { title, description, price, thumbnail, code, stock, category, status } = productUpdated;
        title !== "" ? title.trim() : title;
        description !== "" ? description.trim() : description;
        thumbnail !== "" ? thumbnail.trim() : thumbnail;
        code !== "" ? code.trim() : code;
        category !== "" ? category.trim() : category;
        const products = await getJSON(this.path);

        if (this.getProductById(id)) {
            const newProducts = products.map((p) => {
                if (p.id === id) {
                    p.title = title;
                    p.description = description;
                    p.price = price;
                    p.thumbnail = thumbnail;
                    p.code = code;
                    p.stock = stock;
                    p.category = category;
                    p.status = status;
                    return p;
                } else {
                    return p;
                }
            });
            await saveJSON(this.path, newProducts);
            console.log(`El ID:${id} se actualizó correctamente.`);
        }
    }

    async deleteProduct(id) {
        const products = await getJSON(this.path);
        if (this.getProductById(id)) {
            const newProducts = products.filter(p => p.id !== id);
            await saveJSON(this.path, newProducts);
            console.log(`El ID:${id} se borró correctamente.`);
        }
    }

    async getProducts(limit) {
        if (limit) {
            const products = await getJSON(this.path);
            if (limit >= products.length) {
                return products;
            } else {
                const limitedProducts = products.slice(0, limit);
                return limitedProducts;
            }
        } else {
            return await getJSON(this.path);
        }
    }

    async getProductById(id) {
        const products = await getJSON(this.path);
        const productFound = products.find(p => p.id === id);
        if (productFound === undefined) {
            console.log(`Error, el ID:${id} no se encontró en el listado de productos`);
            return false;
        } else {
            return productFound;
        }
    }
}

const existFile = async (path) => {
    try {
        await fs.promises.access(path);
        return true;
    } catch (error) {
        return false;
    }
}

const getJSON = async (path) => {
    if (!await existFile(path)) {
        return [];
    }
    let content;
    try {
        content = await fs.promises.readFile(path, 'utf-8');
    } catch (error) {
        throw new Error(`El archivo ${path} no pudo ser leido.`);
    }
    try {
        return JSON.parse(content);
    } catch (error) {
        throw new Error(`El archivo ${path} no tiene un formato JSON válido.`);
    }
}

const saveJSON = async (path, data) => {
    const content = JSON.stringify(data, null, '\t');
    try {
        await fs.promises.writeFile(path, content, 'utf-8');
    } catch (error) {
        throw new Error(`El archivo ${path} no pudo ser guardado correctamente.`);
    }
}

export default ProductManager;