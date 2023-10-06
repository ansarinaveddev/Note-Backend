const express = require('express');
const user = require('./routes/user');
const note = require('./routes/note');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require("dotenv").config();

const port = 3000;
const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use('/user/', user);
app.use('/note/', note)
app.use(cookieParser());
app.use(cors({credentials: true}));

app.listen(port, () => {
    console.log(`Your Backend Server listening on http://localhost:${port}`)
})