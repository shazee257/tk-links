const path = require('path');
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cors = require("cors");
const http = require('http');
const LinkModel = require('./models/link');

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

app.use("/", express.static(path.join(__dirname, './frontend/build')));
// app.use("/", express.static(path.resolve(path.join(__dirname, "frontend/build"))))
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, './frontend/build/index.html'));
// });


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


const port = 5000 || 3000;

http.createServer(app).on("error", (ex) => {
    console.log(ex);
    console.log("Can't connect to server.");
}).listen(port, () => {
    console.log(`Server Started :: ${port}`);
});