import { Router } from "express";
const userRouter = Router();
import { z } from "zod";
import { userModel } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

userRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({
      error: "incomplete credentials",
    });
  }

  const requiredBody = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),  
    password: z.string().min(6).max(100),
  });

  const parsedbody = requiredBody.safeParse(req.body);
  
  if (!parsedbody.success) {
    return res.status(400).json({
      error: "invalid credentials",
      details: parsedbody.error.errors,
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
    res.status(201).json({
      success: "user successfully signed up"
    });
  } catch (err) {
    res.status(400).json({
      error: "signup error",
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      error: "incomplete credentials"
    });
  }

  // Fix: Remove 'name' from signin validation
  const requiredBody = z.object({
    email: z.string().email(), 
    password: z.string().min(6).max(100),
  });

  const parsedbody = requiredBody.safeParse(req.body);
  
  if (!parsedbody.success) {
    return res.status(400).json({
      error: "invalid credentials",
      details: parsedbody.error.errors,
    });
  }

  try {
    const user = await userModel.findOne({
      email: email
    });

    if (!user) {
      return res.status(404).json({
        error: "user not found"
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({
        error: "invalid credentials"
      });
    }

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }  
    );

    res.status(200).json({
      token: token,
      message: "signin successful"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "signin error"
    });
  }
});

export { userRouter };
