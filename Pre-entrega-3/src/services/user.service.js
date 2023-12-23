import { userRepository } from '../repositories/index.js';

export default class UserService {
    static get(email) {
        return userRepository.get(email);
    }

    static getById(id) {
        return userRepository.getById(id);
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