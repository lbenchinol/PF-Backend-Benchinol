import UserModel from '../models/user.model.js';

export default class UserDao {
    get(email) {
        return UserModel.findOne({ email });
    }

    getById(id) {
        return UserModel.findById(id);
    }

    create(user) {
        return UserModel.create(user);
    }

    updateById(id, userUpdated) {
        return UserModel.updateOne({ _id: id }, { $set: userUpdated });
    }

    deleteById(id) {
        return UserModel.deleteOne({ _id: id });
    }

}