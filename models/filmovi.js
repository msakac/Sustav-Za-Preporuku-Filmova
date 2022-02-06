const mongoose = require('mongoose')

const filmoviSchema = new mongoose.Schema({
    naziv:{
        type: String,
        required: true
    },
    opis:{
        type: String,
        required: true,
    },
    datumIzlaska:{
        type: Date,
        default: Date.now
    },
    reziser: {
        type: String,
        required: true
    },
    trajanje: {
        type: String,
        required: true
    },
    glumci: {
        type: String,
        required: true,
    },
    slika:{
        type: String,
        required: true
    },
    najava:{
        type: String,
    }
})

module.exports = mongoose.model('Filmovi', filmoviSchema)