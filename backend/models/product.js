import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    stock: { type: Number, required: true, default: 0 },
    category: { type: String },
  },
  { timestamps: true }
);

const productModel = mongoose.model('products',productSchema);
export { productModel };
