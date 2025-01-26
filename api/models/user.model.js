import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331257_1280.png'
    },
    // isAdmin: {
    //     type: Boolean,
    //     default: false
    // },
},
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;