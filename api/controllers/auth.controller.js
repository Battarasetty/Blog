import User from "../models/user.model.js";
import { errorHandler } from "../utilis/errorHandler.js";
import jwt from 'jsonwebtoken';

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
        res.status(200).json({
            status: 200,
            msg: 'user signedup successfully',
        })
    } catch (error) {
        console.log(error);
        next(error)
    }
}


export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email.length === '' || password.length === '') {
        next(errorHandler(400, 'email & password are required'))
    }

    try {
        const findUser = await User.findOne({ email })
        if (!findUser) {
            return next(errorHandler(404, 'User Not Found'))
        }
        const validPassword = findUser.password === password;
        if (!validPassword) {
            return next(errorHandler(400, 'Wrong Credentials entered'))
        }

        const { password: pass, ...rest } = findUser._doc;
        // console.log(pass);

        const token = jwt.sign(
            { id: findUser._id, isAdmin: findUser.isAdmin },
            process.env.KEY
        )

        return res.status(200).cookie(
            'access_token', token,
            { httpOnly: true }
        ).json({
            status: 200,
            msg: 'user Signin successfully',
            data: rest
        })
    } catch (error) {
        next(error)
    }
};


export const google = async (req, res, next) => {
    const { name, email, googlePhotoUrl } = req.body;
    try {
        const findUser = await User.findOne({ email });
        if (findUser) {
            const token = jwt.sign(
                { id: findUser._id, isAdmin: findUser.isAdmin },
                process.env.KEY
            )
            const { password: pass, ...rest } = findUser._doc
            res.status(200).cookie(
                'access_token', token,
                { httpOnly: true }
            ).json({
                status: 200,
                success: true,
                data: rest
            })
        } else {
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const newUser = new User({
                username: name.toLowerCase().split().join('') + Math.random().toString(9).slice(-4),
                email,
                password: generatePassword,
                profilePicture: googlePhotoUrl,
            })

            await newUser.save();
            const token = jwt.sign(
                { id: newUser._id, isAdmin: newUser.isAdmin },
                process.env.KEY
            )
            const { password, ...rest } = newUser._doc
            res.status(200).cookie(
                'access_token', token,
                { httpOnly: true }
            ).json({
                status: 200,
                success: true,
                data: rest
            })
        }
    } catch (error) {
        next(error)
    }
};