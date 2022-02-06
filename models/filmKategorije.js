const mongoose = require('mongoose')

const filmKategorije = new mongoose.Schema({
    film:{
        type: String,
        required: true
    },
    kategorija:{
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('FilmKategorije', filmKategorije)