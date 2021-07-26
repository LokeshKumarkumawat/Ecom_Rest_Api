require('dotenv').config()
import express from 'express'
import router from './routes'
import errorHandler from './middlewares/errorHandler'
import path from 'path'

const app = express()

global.appRoot = path.resolve(__dirname)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



const connectDB = require('./config/mongoosedb');
connectDB();

app.use('/api', router)







app.use(errorHandler)
app.listen(process.env.PORT, () => console.log(`listening on ${process.env.PORT}`))


