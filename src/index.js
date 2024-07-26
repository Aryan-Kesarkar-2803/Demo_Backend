
import express from 'express'
import dotenv from 'dotenv'
import connectDB from "./db/index.js";
dotenv.config()

const app = express()

app.listen(process.env.PORT,()=>{
    console.log(`Server started at ${process.env.PORT}`)
})

connectDB();

// async function connectDB(){
//     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//     .then(()=>{
//         console.log('Database Connected');
//     })
//     .catch((err)=>{
//         console.log(`Error MongoDB - ${err}`)
//     })
// }

// connectDB();