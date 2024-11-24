const Users = require('../models/userModel')
const Payments = require('../models/paymentModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userCtrl = {
    register : async (req , res) => {
        try {
            const {name , email , password} = req.body;


            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg : 'the email already exists'})

            if(password.length < 6)
                return res.status(400).json({msg : 'password is atleast 6 characters long.'})

            //password encryption
            const passwordHash = await bcrypt.hash(password , 10)
            const newUser = new Users({
                name, email , password: passwordHash
            })

            // save mongoDB
            await newUser.save();

            // create jsonwebtoken authentication
            const accesstoken = createAccessToken({id : newUser._id})

            const refreshtoken = createRefreshToken({id : newUser._id})

            res.cookie('refreshtoken' , refreshtoken , {
                httpOnly : true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7d
            })

            res.json({accesstoken})
            // res.json({msg : 'registered success'})

        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    },
    login : async (req , res) => {
        try {
            const {email , password} = req.body;
            
            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg : 'user does not exit'});
            
            const isMatch = await bcrypt.compare(password , user.password)
            if(!isMatch) return res.status(400).json({msg : 'incorrect password'});

            //if login success , create access token and refresh token
            const accesstoken = createAccessToken({id : user._id})

            const refreshtoken = createRefreshToken({id : user._id})

            res.cookie('refreshtoken' , refreshtoken , {
                httpOnly : true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7d
            })

            res.json({accesstoken})
            
            
        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    },
    logout : async (req , res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'});
            return res.json({msg : 'Logged Out'});
        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    },
    refreshToken: (req , res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.status(500).json({msg: "please login or Register"})
            jwt.verify(rf_token , process.env.REFRESH_TOKEN_SECRET , (err , user) => {
                if(err) return res.status(500).json({msg : "please login or regiser"})
                const accesstoken = createAccessToken({id : user.id})

                
                res.json({accesstoken})
            })

        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
        
    },
    getUser : async (req , res)=> {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg: "User does not exist"})
            res.json(user)
        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    },
    addCart: async (req, res) =>{
        try {
            const user = await Users.findById(req.user.id)
            if(!user) return res.status(400).json({msg: "User does not exist."})

            await Users.findOneAndUpdate({_id: req.user.id}, {
                cart: req.body.cart
            })

            return res.json({msg: "Added to cart"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    history: async(req, res) =>{
        try {
            const history = await Payments.find({user_id: req.user.id})

            res.json(history)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

 // auth of the currrent registering user 
const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOEKEN_SECRET , {expiresIn : '15m'} )
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET , {expiresIn : '7d'} )
}

module.exports = userCtrl