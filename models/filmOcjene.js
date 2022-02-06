const mongoose = require('mongoose')

const filmOcjeneSchema = new mongoose.Schema({
    film:{
        type: String,
        required: true
    },
    ocjena:{
        type: Number,
        required: true,
    },
    datum:{
        type: Date,
        default: Date.now
    },
    komentar: {
        type: String,
    },
})

module.exports = mongoose.model('FilmOcjene', filmOcjeneSchema)