import mongoose from 'mongoose';

const productItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    products: { type: [productItemSchema], default: [] }
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);