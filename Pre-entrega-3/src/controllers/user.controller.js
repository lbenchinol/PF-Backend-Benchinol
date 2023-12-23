import UserService from '../services/user.service.js';
import config from '../config/config.js';
import { Exception, createHash, tokenGenerator } from '../utils.js';
import CartController from './cart.controller.js';

const userAdmin = {
    first_name: config.admin_first_name,
    last_name: config.admin_last_name,
    email: config.admin_email,
    password: config.admin_password,
    role: config.admin_role
};

export default class UserController {
    static async create(body) {
        const { first_name, last_name, email, age, password, provider = 'Local' } = body;

        first_name !== "" ? first_name.trim() : first_name;
        last_name !== "" ? last_name.trim() : last_name;
        email !== "" ? email.trim() : email;
        password !== "" ? password.trim() : password;
        age !== "" ? Number(age) : age;

        if (provider == 'Local') {
            if (first_name == "" || last_name == "" || email == "" || age < 18 || password == "") {
                throw new Exception('Ingrese los valores correctamente', 400);
            }
        } else {
            if (first_name == "" || email == "") {
                throw new Exception('Ingrese los valores correctamente', 400);
            }
        }
        const cart = await CartController.create();
        const newUser = { first_name, last_name, email, age, password: createHash(password), provider, cart: cart._id };

        return await UserService.create(newUser);
    }

    static async get(email) {
        email !== "" ? email.trim() : email;

        if (email == "") {
            throw new Exception('Ingrese los valores correctamente', 400);
        }

        //      HARDCODEADO
        if (email === userAdmin.email && password === userAdmin.password) {
            return { first_name: userAdmin.first_name, last_name: userAdmin.last_name, email: userAdmin.email, role: userAdmin.role };
        }
        return await UserService.get(email);
    }

    static async getById(id) {
        id !== "" ? id.trim() : id;

        if (id == "") {
            throw new Exception('Ingrese los valores correctamente', 400);
        }
        return await UserService.getById(id);
    }

    static async updateById(id, body) {
        const user = await UserController.getById(id);

        if (!user) {
            throw new Exception('Usuario no encontrado', 404);
        }

        const { first_name: first_name_updated, last_name: last_name_updated, age: age_updated } = body;

        first_name_updated !== "" ? first_name_updated.trim() : first_name_updated;
        last_name_updated !== "" ? last_name_updated.trim() : last_name_updated;
        age_updated !== "" ? Number(age_updated) : age_updated;

        if (first_name_updated == "" || last_name_updated == "" || age_updated < 18) {
            throw new Exception('Ingrese los valores correctamente', 400);
        }

        const userUpdated = { ...user, first_name: first_name_updated, last_name_updated, age: age_updated };

        return await UserService.updateById(id, userUpdated);
    }

    static async deleteById(id) {
        const user = await UserController.getById(id);

        if (!user) {
            throw new Exception('Usuario no encontrado', 404);
        }

        return await UserService.deleteById(id);
    }

    static async authenticate(email, password) {
        email !== "" ? email.trim() : email;
        password !== "" ? password.trim() : password;

        if (email == "" || password == "") {
            throw new Exception('Ingrese los valores correctamente', 400);
        }

        //      HARDCODEADO
        if (email === userAdmin.email && password === userAdmin.password) {
            const token = tokenGenerator(userAdmin);
            return { first_name: userAdmin.first_name, last_name: userAdmin.last_name, email: userAdmin.email, role: userAdmin.role, token };
        }

        const user = await UserController.get(email);
        if (!user) {
            throw new Exception('Correo o contraseña incorrectos', 404);
        }

        const isPasswordValid = UserService.passwordCheck(email, password);
        if (!isPasswordValid) {
            throw new Exception('Correo o contraseña incorrectos', 404);
        }

        const token = tokenGenerator(user);

        const { _id, first_name, last_name, role } = user;
        return { _id, first_name, last_name, email, role, token };
    }
}