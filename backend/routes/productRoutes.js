import { getProducts, getProductById, createProduct, updateProduct,deleteProduct } from "../controllers/productController.js"
import Router from "express";
const productRouter = Router();

productRouter.get("/all",getProducts);
productRouter.get("/:id",getProductById);
productRouter.post("/new", createProduct);
productRouter.put("/update/:id",updateProduct);
productRouter.delete("/delete/:id",deleteProduct);

export {productRouter};
