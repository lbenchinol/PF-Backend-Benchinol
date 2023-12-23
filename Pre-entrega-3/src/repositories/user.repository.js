import UserDTO from '../dto/user.dto.js';

export default class User {
    constructor(dao) {
        this.dao = dao;
    }

    async get(email) {
        return new UserDTO(await this.dao.get(email));
    }

    async getById(id) {
        return new UserDTO(await this.dao.getById(id));
    }

    async create(user) {
        return new UserDTO(await this.dao.create(user));
    }

    updateById(id, userUpdated) {
        return this.dao.updateById(id, userUpdated);
    }

    deleteById(id) {
        return this.dao.deleteById(id);
    }

    async passwordCheck(email, password) {
        return this.dao.passwordCheck(email, password);
    }

}