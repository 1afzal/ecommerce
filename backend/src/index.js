import express from "express"
const app = express();
import dotenv from "dotenv";
import cors from "cors"
dotenv.config();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors())
import { connectDB } from "../config/connectDB.js";
import { userRouter } from "../routes/userRouter.js";
import { productRouter } from "../routes/productRoutes.js";

connectDB(); //database connection function (MONGODB)

app.use('/user',userRouter);
app.use('/product',productRouter);

app.listen(process.env.PORT,()=>{
    console.log("server running......")
})


