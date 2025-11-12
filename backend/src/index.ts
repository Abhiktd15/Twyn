import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import userRouter from './routes/user.routes.js'
import connectDB from './lib/db.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
// app.use(express.urlencoded({extended:true})

// App Routes
app.use('/api/user',userRouter)

app.listen(3000,() => {
    console.log(`Server is running at port 3000 `)
    connectDB()
})