import { productModel } from "../models/product";

async function getProducts(req, res) {
  try {
    const products = await productModel.find({});
    res.status(200).send(products);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: "error in fetching products",
    });
  }
}

async function getProductById(req, res) {
  try {
    const idx = req.params.id;
    const product = productModel.findById(idx);
    console.log(product);
    res.status(200).send(product);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      message: "error in fetching products",
    });
  }
}

async function createProduct(req, res) {
  const { name, description, price, image, stock, category } = req.body;

  try {
    await productModel.create({
      name,
      description,
      price,
      image,
      stock,
      category,
    });
    res.status(200).json({
      success: "product created",
    });
  } catch (err) {
    res.status(400).json({
      error: "error in creating product",
    });
  }
}
async function updateProduct(req, res) {
  const { name, description, price, image, stock, category } = req.body;
  const idx = req.params.id;
  try {
    const product = await productModel.findById(idx);
    if (!product) {
      return res.status(404).json({
        message: "unable to fetch product",
      });
    }
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.image = image ?? product.image;
    product.stock = stock ?? product.stock;
    product.category = category ?? product.category;

    const updated = await product.save();
    res.status(200).send(updated);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.messsage);
  }
}

export { getProducts, getProductById, createProduct };
