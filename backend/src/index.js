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

connectDB(); //database connection function (MONGODB)

app.use('/user',userRouter);

app.listen(process.env.PORT,()=>{
    console.log("server running......")
})


userRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({
      error: "incomplete credentials",
    });
  }

  const requiredBody = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),  // Validates email format
    password: z.string().min(6).max(100),
  });

  const parsedbody = requiredBody.safeParse(req.body);
  
  if (!parsedbody.success) {
    return res.status(400).json({
      error: "invalid credentials",
      details: parsedbody.error.errors,  // Helpful for debugging
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  try {
    await userModel.create({
      name: name,
      email: email,
      password: hashedpassword,
    });
    res.status(201).json({  // 201 is better for resource creation
      success: "user successfully signed up"
    });
  } catch (err) {
    res.status(400).json({
      error: "signup error",
    });
  }
});