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

// // Frontend Routes
// app.use(express.static(path.join(__dirname, './frontend/build')));
// app.get('*', function (_, res) {
//     res.sendFile(path.join(__dirname, './frontend/build/index.html'),
//         function (err) {
//             if (err) {
//                 res.status(500).send(err)
//             }
//         }
//     )
// });

app.listen(PORT, () => {
    console.log(`Server Started :: ${PORT}`);
});