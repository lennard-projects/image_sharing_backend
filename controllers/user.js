import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import axios from 'axios'

export const signup = async (req, res) => {

    if(req.body.googleAccessToken){
        const { googleAccessToken } = req.body
            axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers:{
                    "Authorization": `Bearer ${googleAccessToken}`
                } 
            })
            .then(async response => {
                const firstName = response?.data.given_name
                const lastName = response?.data.family_name
                const email = response?.data.email
                const picture = response?.data.picture

                const existingUser = await User.findOne({ email })

                if(existingUser){
                    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.SECRET, { expiresIn: '1h' })
                    res.status(200).json({ result: existingUser ,token })
                } else {
                    const result = await User.create({ verified: "true", email, name: `${firstName} ${lastName}`, picture })
                    const token = jwt.sign({ email: result.email, id: result._id }, process.env.SECRET, { expiresIn: '1h' })
                    res.status(200).json({ result, token })
                }
            })


    } else {
        const { email, password, confirmPassword, firstName, lastName  } = req.body
        try {
            const existingUser = await User.findOne({email})

            if(existingUser) return res.status(400).json({ message: 'User already exist.'})

            if(password !== confirmPassword) return res.status(400).json({ message: "Password don't match." })

            const hashPassword = await bcrypt.hash(password, 12)

            const result = await User.create({ email, password: hashPassword, name: `${firstName} ${lastName}` })

            const token = jwt.sign({ email: result.email, id: result._id }, process.env.SECRET, { expiresIn: "1h"})

            res.status(200).json({ result, token })
        
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong.'})
        }
    }
    
}

export const signin = async (req, res) => {
    const { email, password } = req.body
    try {
        const existingUser = await User.findOne({ email })

        if(!existingUser) return res.status(400).json({ message: "User doesn't exist."})

        const isPasswordCorrect = await bcrypt.compare( password, existingUser.password )

        if(!isPasswordCorrect) return res.status(400).json({ message: "Password incorrect. Please try again." })

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.SECRET, { expiresIn: "1h" })

        res.status(200).json({ result: existingUser, token })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong."})
    }
}
