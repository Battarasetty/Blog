import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';

dotenv.config();

const app = express();
const port = 3001;

mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log('connection established successfully');
    }).catch((err) => {
        console.log(`something went wrong ${err}`);

    })

app.listen(port, () => {
    console.log(`Application connected on ${port}.`);
})

//Test Route
app.use('/api/user', userRoutes)