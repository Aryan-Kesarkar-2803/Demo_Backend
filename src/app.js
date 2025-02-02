import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {userRouter} from './routes/user.routes.js' 

export const app = express()

app.use(cookieParser())
app.use(cors({
    origin:process.env.CORS_ORIGIN ,
    credentials:true,
}))
app.use(express.json({
    limit:'20kb',
}))
app.use(express.urlencoded({extended:true,limit:"20kb"}))
app.use(express.static('public'))

app.use('/api/v1/users',userRouter);



