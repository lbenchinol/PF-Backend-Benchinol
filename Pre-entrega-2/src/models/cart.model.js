import mongoose from 'mongoose';

const productItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    quantity: { type: Number }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    products: { type: [productItemSchema], default: [] }
}, { timestamps: true });

cartSchema.pre('find', function () {
    this.populate('products.product');
});

export default mongoose.model('carts', cartSchema);