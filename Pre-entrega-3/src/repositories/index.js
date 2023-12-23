import UserRepository from './user.repository.js';
import UserDao from '../dao/user.dao.js';

export const userRepository = new UserRepository(new UserDao());