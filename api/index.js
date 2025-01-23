import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

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