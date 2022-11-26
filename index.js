const PORT = 5000 || 3000;
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cors = require("cors");
const LinkModel = require('./models/link');
var http = require("http");

// connect DB
connectDB();

// app init
var app = express();
var server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:3000', 'https://tiktok-links.vercel.app'],
    credentials: true
}));

app.use(morgan('dev'));

app.use("/", express.static(path.resolve(path.join(__dirname, "frontend/build"))))

app.get('/api', async (req, res) => {
    const links = await LinkModel.find({});
    res.send({
        statusCode: 200,
        success: true,
        data: links,
        message: 'Links fetched successfully',
    });
});

app.post('/api', async (req, res) => {
    let duplicateLinks = [];
    let newLinks = [];
    const links = req.body.links;

    // find all links in db and match with links from frontend
    const dbLinks = await LinkModel.find({});
    const allLinksArray = dbLinks.map((item) => item.url);
    console.log("DB Links: ", allLinksArray);

    links.forEach((item) => {
        if (!allLinksArray.includes(item.url)) {
            newLinks.push(item);
        } else {
            duplicateLinks.push(item);
        }
    });
    console.log("duplicateLinks:", duplicateLinks);
    console.log("newLinks:", newLinks);

    // if newlinks empty, return message
    if (newLinks.length === 0) {
        return res.send({
            statusCode: 409,
            success: true,
            duplicateLinks,
            message: 'Duplicate links, nothing to save',
        });
    }

    // save links to db
    const savedLinks = await LinkModel.insertMany(newLinks);

    res.send({
        statusCode: 200,
        success: true,
        duplicateLinks,
        data: savedLinks,
        message: 'Links saved successfully',
    });
});

app.post('/api/check', async (req, res) => {
    let duplicateLinks = [];
    const links = req.body.links;

    // find all links in db and match with links from frontend
    const dbLinks = await LinkModel.find({});
    const allLinksArray = dbLinks.map((item) => item.url);
    console.log("DB Links: ", allLinksArray);

    links.forEach((item) => {
        if (allLinksArray.includes(item.url)) {
            duplicateLinks.push(item);
        }
    });
    console.log("duplicateLinks:", duplicateLinks);

    // if duplicateLinks empty, return message
    if (duplicateLinks.length === 0) {
        return res.send({
            statusCode: 409,
            success: true,
            duplicateLinks,
            message: 'No duplicate links found',
        });
    }

    res.send({
        statusCode: 200,
        success: true,
        duplicateLinks,
        message: 'Duplicate links found',
    });
});


server.listen(PORT, () => {
    console.log(`Server Started :: ${PORT}`);
});