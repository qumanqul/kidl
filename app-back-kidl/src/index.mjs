import express, { request } from "express";
import mongoose from 'mongoose';
import {body, validationResult, checkSchema} from 'express-validator';
import User from './models/user.mjs';
import Product from './models/product.mjs';
import routes from "./routers/index.mjs";
import cors from "cors";
import cookieParser from 'cookie-parser';


const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(routes);
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});


app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});


mongoose.connect('mongodb+srv://defople:pyQ2AZUs6lw4BwxC@cluster0.yewm5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=> console.log('Connected to Database'))
    .catch((err)=> console.log(`Error:${err}`));

    
// const userEx = new User ({
//   name: "Michal",
//   email: "mich@gmail.com",
//   passwordHash: 1234567,
//   address: {
//     street: 'Weglowska',
//     city: 'Katowice',
//     zipCode: '123414',
//     country: 'Poland',
//   },
//   phone: '+48798789789',
  
// });

// const savedUser = await userEx.save();
// console.log(savedUser);

app.get("/", (request, response) => {
  return response
    .status(201)
    .send({ msg: "It's an app Kidl, where u can buy some items" });
});


app.get('/api/profile', async(request,response)=>{
  
})


app.post("/api/signup",[
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  body('phone')
    .optional()
    .isMobilePhone().withMessage('Invalid phone number'),
], async(request,response)=>{
  try{
    const { body } = request;
    const user = new User(body);
    const newUser = await user.save();
    response.status(201).send(newUser);
    }catch(error){
        response.status(400).send(error.message);
   } 

})
