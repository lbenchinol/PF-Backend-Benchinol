import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    password: { type: String },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    provider: { type: String, default: 'Local' },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },
}, { timestamps: true });

userSchema.pre('find', function () {
    this.populate('carts.cart');
});

export default mongoose.model('users', userSchema);