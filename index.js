import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import jwt from 'jsonwebtoken';
import productRouter from './routes/productRouter.js';

const mongoURI = "mongodb+srv://admin:1234@cluster0.bcc0p8b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI).then(
    () => {
        console.log("MongoDB connected");
    }
)

const app = express();

//middleware
app.use(express.json());

app.use( 
    (req,res,next)=>{
        const authorizationHeader = req.header('authorization');

        if(authorizationHeader != null){

            const token = authorizationHeader.replace("Bearer ","");

            // console.log("token received:",token);

            jwt.verify(token, "secretKey2003",
                (error, content) => {

                    if(content == null){

                        res.json ({
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

app.use("/users",userRouter)
app.use("/products",productRouter)




app.listen(3000, 
    ()=>{
    console.log('Server is running on 3000');
});