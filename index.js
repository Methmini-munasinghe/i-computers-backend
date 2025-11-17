import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import jwt from 'jsonwebtoken';
import productRouter from './routes/productRouter.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const mongoURI = process.env.MONGO_URL;

mongoose.connect(mongoURI).then(
    () => {
        console.log("MongoDB connected");
    }
)

const app = express();

//middleware
app.use(express.json());
app.use(cors());

app.use( 
    (req,res,next)=>{
        const authorizationHeader = req.header('authorization');

        if(authorizationHeader != null){

            const token = authorizationHeader.replace("Bearer ","");

            // console.log("token received:",token);

            jwt.verify(token, process.env.JWT_SECRET,
                (error, content) => {

                    if(content == null){

                        res.status(401).json ({
                            message : "Token is not valid"
                        })

                
                    }else{

                        req.user = content;

                        next();
                    }
                }

            );
        } else {
            next();
        }



    }
);


//routes

app.use("/api/users",userRouter)
app.use("/api/products",productRouter)


app.listen(3000, 
    ()=>{
    console.log('Server is running on 3000');
});