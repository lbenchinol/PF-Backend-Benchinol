import { userRepository } from '../repositories/index.js';

export default class UserService {
    static async get(email) {
        return await userRepository.get(email);
    }

    static getById(id) {
        return userRepository.getById(id);
    }

    static find(criteria) {
        return userRepository.find(criteria);
    }

    static create(user) {
        return userRepository.create(user);
    }

    static updateById(id, userUpdated) {
        return userRepository.updateById(id, userUpdated);
    }

    static deleteById(id) {
        return userRepository.deleteById(id);
    }

    static async passwordCheck(email, password) {
        return userRepository.passwordCheck(email, password);
    }
}