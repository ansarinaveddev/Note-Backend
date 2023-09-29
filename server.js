const express = require('express');
const routes = require('./routes/routes');
require("dotenv").config();

const port = 3000;
const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use('/', routes)


app.listen(port, () => {
    console.log(`Your Backend Server listening on http://localhost:${port}`)
})