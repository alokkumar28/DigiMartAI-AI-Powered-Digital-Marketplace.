import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.route.js';
dotenv.config()

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

const PORT = process.env.PORT

app.get('/',(req , res)=>{
    res.send('Auth Service Server is running')
})

app.use('/', authRouter);

app.listen(PORT ,()=>{
    console.log(`Auth Service Server is running on port ${PORT}`)
    connectDB();
})