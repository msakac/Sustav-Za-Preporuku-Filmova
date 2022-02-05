const mongoose = require('mongoose')

const kategorijeSchema = new mongoose.Schema({
    naziv:{
        type: String,
        required: true
    },
    opis:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Kategorije', kategorijeSchema)