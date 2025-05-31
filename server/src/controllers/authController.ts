import {Request, Response} from "express";;
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET=process.env.JWT_SECRET as string;
//type safety here too

export const registerUser=async(req:Request, res:Response)=>{
    
        try{
            const {username, email, password} = req.body;

            const userExists=await User.findOne({email});
            if(userExists) return res.status(400).json({message:"User already exists"});


            const hashedPassword= await bcrypt.hash(password,10);
            

            const user=await User.create({
                username,
                email,
                password: hashedPassword,
            })

            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

            res.status(201).json({
                token,
                user:{
                    id:user._id,
                    username:user.username,
                    email:email
                }
            })
        }
            catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }

};

export const loginUser=async(req:Request, res:Response)=>{
    try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};
