import mongoose from "mongoose";
import dotenv from 'dotenv'
import { DB_NAME } from "./constants";
dotenv.config()
async function connectDB(){
    await mongoose.connect(`${MONGODB_URL}/${DB_NAME}`)
    .then(()=>{
        console.log('Database Connected');
    })
    .catch((err)=>{
        console.log(`Error MongoDB - ${err}`)
    })
}
