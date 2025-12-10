import { CartModel } from "../models/cart.js";
import { productModel } from "../models/product.js";


async function getCart(req, res) {

    let cart = await CartModel.findOne({
        user: req.user._id
    }).populate("items.product");
    

    if (!cart) {
        cart = await CartModel.create({
            user: req.user._id,
            items: []
        });
    }
    
    res.json(cart);
}


async function addToCart(req, res) {
    const { productId, quantity = 1 } = req.body;
    
    const product = await productModel.findById(productId);
    
    if (!product) {
        return res.status(404).json({ message: "Product not found in db" });
    }
    
    let cart = await CartModel.findOne({
        user: req.user._id
    });
    
    if (!cart) {
        cart = await CartModel.create({
            user: req.user._id,
            items: []
        });
    }
    
    const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
    );
    

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {

        cart.items.push({
            product: productId,
            quantity: quantity
        });
    }
    
    await cart.save();
    await cart.populate("items.product");
    
    res.json(cart);
}

export { getCart, addToCart };