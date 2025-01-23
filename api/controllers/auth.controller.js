import User from "../models/user.model.js";

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json('ALL fields are required')
    } else if (username.length < 4 || username.length > 10) {
        return res.status(400).json('Username should be between 4 to 10')
    }

    const newUser = new User({
        username,
        email,
        password
    })

    await newUser.save()

    res.status(200).json('user saved successfully')
}