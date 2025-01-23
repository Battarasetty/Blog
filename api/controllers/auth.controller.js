import User from "../models/user.model.js";
import { errorHandler } from "../utilis/errorHandler.js";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        next(errorHandler(400, 'All fields are required'));
    } else if (username.length < 4 || username.length > 10) {
        next(errorHandler(400, 'Username should be between 4 to 10'))
    }

    const newUser = new User({
        username,
        email,
        password
    })

    try {
        await newUser.save()
        res.status(200).json('user saved successfully')
    } catch (error) {
        console.log(error);
        next(error)
    }
}