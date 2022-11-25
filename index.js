const path = require('path');
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cors = require("cors");
const LinkModel = require('./models/link');

// connect DB
connectDB();

// app init
const app = express();
const PORT = 5000 || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

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

    // filter out links that are already in db
    // const filteredLinks = links.filter((item) => {
    //     if (!allLinksArray.includes(item.url)) {
    //         return item;
    //     }
    // });
    // console.log({ filteredLinks });

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

// // Frontend Routes
app.use(express.static(path.join(__dirname, './frontend/build')));
app.get('*', function (_, res) {
    res.sendFile(path.join(__dirname, './frontend/build/index.html'),
        function (err) {
            if (err) {
                res.status(500).send(err)
            }
        }
    )
});

app.listen(PORT, () => {
    console.log(`Server Started :: ${PORT}`);
});