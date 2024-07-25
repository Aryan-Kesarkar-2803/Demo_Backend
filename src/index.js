import mongoose from "mongoose";
import express from 'express'
import dotenv from 'dotenv'
import { DB_NAME } from "./constants";
dotenv.config()

const app = express()

app.listen(process.env.PORT,()=>{
    console.log(`Server started at ${process.env.PORT}`)
})

async function connectDB(){
    await mongoose.connect(`${MONGODB_URL}/${DB_NAME}`)
    .then(()=>{
        console.log('Database Connected');
    })
    .catch((err)=>{
        console.log(`Error MongoDB - ${err}`)
    })
}

connectDB();