import dotenv from 'dotenv'
import {connectDB} from "./db/index.js";
import { app } from './app.js';
dotenv.config()
connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server started at port ${process.env.PORT}`)
    })
    app.on('error',(err)=>{
        console.log(`Error in Server - ${err}`)
    })
})
