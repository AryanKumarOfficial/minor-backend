require('dotenv').config();
const express = require('express');
const connectDB = require('./database/middleware/connectdb');
const cors = require('cors');

const app = express();
app.use(cors());
connectDB();



app.get('/', (req, res) => {
    res.send(`<h1 style="color:green;text-align:center;margin-top:25rem;font-size:3rem;">Backend is working properly on port ${process.env.EXPRESS_PORT}</h1>`);
});

app.use('/user', require('./routes/users'));


app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is running on localhost:${process.env.EXPRESS_PORT}`);
});