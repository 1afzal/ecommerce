import { getProducts, getProductById, createProduct, updateProduct,deleteProduct } from "../middleware/productController.js"
import Router from "express";
const productRouter = Router();

productRouter.get("/all",getProducts);
productRouter.get("/:id",getProductById);
productRouter.post("/new", createProduct);
productRouter.patch("/update/:id",updateProduct);
productRouter.delete("/delete/:id",deleteProduct);

export {productRouter};
