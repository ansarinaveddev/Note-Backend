const express = require('express');
const connectDB = require('../dbConfig/mongoose');
const router = express.Router()
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

router.use(cookieParser());
require("dotenv").config();

connectDB()

// Get All the users in the database in show up the web page
router.get('/getAllUsers', async function (req, res) {
    try {
        const user = await User.find({});
        console.log(user);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            error: `Internal server error: ${error}`
        })
        console.log("User:: GetAllUsers error: " + error)
    }
})

// Add the user to check if the user is already in the database no to add the user
router.post('/adduser', async function (req, res) {
    try {
        const { name, email, password } = req.body;

        const user = await User.findOne({ email: email });


        if (user) {
            res.status(401).json({
                message: "User is Exists please use another email address"
            })
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new User({ name, email, password: hashedPassword });
            const savedUser = await newUser.save();
            res.status(201).json({ success: true, savedUser });
        }
    } catch (error) {
        res.status(500).json({
            error: `Internal server error: ${error}`
        })
        console.log(`User:: AddUser Error: ${error}`)
    }
})

// Login user with cookies
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(user){

            console.log(user.name, user.password)

            const validPassword = await bcrypt.compare(password, user.password);
            console.log(validPassword);


            if(!validPassword){
                res.status(405).json({
                    error: "Invalid Credentials"
                })
            }         

            const tokenData = {
                id: user._id,
                name: user.name,
                email: user.email
            }

            // create a new token
            const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
                expiresIn: '1d'
            })


            res.cookie("token", tokenData);

            console.log(res.cookie())

            res.status(200).json({
                message: "Login successful",
                user,
                token
            })
        }
        else{
            res.status(401).json({
                message: "User doese not exits please create a new account"
            })
        }
    } catch (error) {
        console.log(`User:: Login Error: ${error}`)
    }
});


// Delete a user from the user id
router.post('/delete',async function(req, res) {
    try {
        const {userId} = req.body;
        console.log(userId);
        const user = await User.findByIdAndDelete(String(userId));
        res.status(201).json({
            message: "User deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            error: `Internal server error: ${error}`
        })
        console.log(`User:: DeleteUser Error: ${error}`)
    }
})


// router.get('/', function(req, res) {
//     res.send("Hello HomeScreen!");
// }).post('/', (req, res) => {
//     res.send("I am back here!")
// });

// // Route parameters
// router.get('/user/:userId/books/:bookid', function(req, res) {
//     res.send(req.params)
// })


module.exports = router;