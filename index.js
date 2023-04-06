import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import userRoutes from './routes/user.js'
import postRoutes from './routes/posts.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

const app = express()

dotenv.config()

app.use(bodyParser.json({ limit: "30mb", extended: true}))

app.use(cors({origin: "https://image-sharing-application.netlify.app"}))

app.use('/user', userRoutes)
app.use('/posts', postRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to your api!')
})

const PORT = process.env.PORT || 5000

mongoose.set('strictQuery', true)
mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`server running on port: http://localhost:${PORT}`)))
    .catch((error) => console.log(error.message))
