const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSchema = new Schema({
    url: String,
});

module.exports = mongoose.model('link', linkSchema);