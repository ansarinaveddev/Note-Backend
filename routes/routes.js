const express = require('express');
const connectDB = require('../dbConfig/mongoose');
const router = express.Router()
const User = require("../models/User");
const bcrypt = require('bcrypt');

connectDB()

// Get All the users in the database in show up the web page
router.get('/users/getAllUsers', async function (req, res) {
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
router.post('/user/adduser', async function (req, res) {
    try {
        const { name, email, password } = req.body;

        const user = await User.findOne({ email: email });


        if (user) {
            res.status(401).json({
                message: "User is Exists please use another email address"
            })
        }
        else {
            const saltRoundes = 10;
            const encryptedPassword = await bcrypt.hash(password, saltRoundes);
            console.log(encryptedPassword)
            const newUser = new User({ name, email, password: encryptedPassword });
            
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
router.post('/user/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(user){
            const checkUser = await bcrypt.compare(password, user.email);
            console.log(checkUser);
            // TODO: Kal se start karo yaha se
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