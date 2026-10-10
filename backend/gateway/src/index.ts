import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import proxy from 'express-http-proxy';
dotenv.config()

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

const PORT = process.env.PORT

app.get('/',(req , res)=>{
    res.send('Gateway Server is running')
})

app.use('/api/auth' , proxy(process.env.AUTH_SERVICE_URL as string))

app.listen(PORT ,()=>{
    console.log(`Gateway Server is running on port ${PORT}`)
})