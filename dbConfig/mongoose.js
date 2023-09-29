const mongoose = require('mongoose');
require('dotenv').config()


const connectDB = async () => {
    console.log(process.env.MONGODB_URI)
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MONGODB database")
    } catch (error) {   
        console.log(`Mongoose connection error: ${error}`)
    }
};

module.exports = connectDB;