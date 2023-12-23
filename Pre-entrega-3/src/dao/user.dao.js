import UserModel from '../models/user.model.js';
import { isValidPassword } from '../utils.js';

export default class UserDao {
    static get(email) {
        return UserModel.findOne({ email });
    }

    static getById(id) {
        return UserModel.findById(id);
    }

    static create(user) {
        return UserModel.create(user);
    }

    static updateById(id, userUpdated) {
        return UserModel.updateOne({ _id: id }, { $set: userUpdated });
    }

    static deleteById(id) {
        return UserModel.deleteOne({ _id: id });
    }

    static async passwordCheck(email, password) {
        const user = await UserDao.get(email);
        return isValidPassword(password, user.password);
    }
}