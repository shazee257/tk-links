const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cors = require("cors");
const http = require('http');
const LinkModel = require('./models/link');

// Load config
dotenv.config({ path: './config/config.env' });

// connect DB
connectDB();

// app init
const app = express();

// Middlewares
app.use(cors());

app.use(express.json({ limit: '200kb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Port assign
const port = 5000 || 3000;

app.get('/api', async (req, res) => {
    const links = await LinkModel.find();
    res.status(200).json({
        success: true,
        data: links,
        message: 'Links fetched successfully',
    });
});

app.post('/api', async (req, res) => {
    const links = req.body.links;
    // console.log({ links });
    const result = await LinkModel.insertMany(links);
    res.status(200).json({
        success: true,
        data: result,
        message: 'Links created successfully',
    });
});

// app.use(express.static(path.join(__dirname, './frontend/build')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, './frontend/build/index.html'));
// });


http.createServer(app).on("error", (ex) => {
    console.log(ex);
    console.log("Can't connect to server.");
}).listen(port, () => {
    console.log(`Server Started :: ${port}`);
});