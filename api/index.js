import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();

const app = express();
const port = 3001;
app.use(express.json());

mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log('connection established successfully');
    }).catch((err) => {
        console.log(`something went wrong ${err}`);

    })

//Test Route
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)


//Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
        success: false,
        message,
        statusCode
    })
})

app.listen(port, () => {
    console.log(`Application connected on ${port}.`);
})