import * as fs from 'node:fs';

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async addCart() {
        const carts = await getJSON(this.path);

        let counter = 1;
        let condition = true;
        do {
            if (carts.find(c => c.id === counter)) {
                counter++;
            } else {
                condition = false;
            }
        } while (condition);

        carts.push({ id: counter, products: [] });
        await saveJSON(this.path, carts);
        console.log(`Carrito agregado correctamente con ID:${counter}`);
    }

    async updateCart(cId, pId, quantity) {
        const carts = await getJSON(this.path);
        if (this.getCartById(cId)) {
            const newCarts = carts.map((c) => {
                if (c.id === cId) {
                    if (c.products.find(p => p.product === pId)) {
                        const newProducts = c.products.map((p) => {
                            if (p.product === pId) {
                                p.quantity += quantity;
                                return p;
                            } else {
                                return p;
                            }
                        });
                        c.products = newProducts;
                    } else {
                        c.products.push({ product: pId, quantity: quantity });
                    }
                    return c;
                } else {
                    return c;
                }
            });
            await saveJSON(this.path, newCarts);
            console.log(`El ID:${cId} se actualizó correctamente.`);
        }
    }

    async deleteCart(id) {
        const carts = await getJSON(this.path);
        if (this.getCartById(id)) {
            const newCarts = carts.filter(p => p.id !== id);
            await saveJSON(this.path, newCarts);
            console.log(`El ID:${id} se borró correctamente.`);
        }
    }

    async getCartById(id) {
        const carts = await getJSON(this.path);
        const cartFound = carts.find(c => c.id === id);
        if (cartFound === undefined) {
            console.log(`Error, el ID:${id} no se encontró en el listado de carritos`);
            return false;
        } else {
            return cartFound;
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
    if (content === "") {
        return [];
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

export default CartManager;