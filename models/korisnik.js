const mongoose = require('mongoose')

const korisnikSchema = new mongoose.Schema({
    korisnickoIme:{
        type: String,
        required: true
    },
    ime:{
        type: String,
        required: true,
    },
    prezime:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    lozinka: {
        type: String,
        required: true
    },
    uloga: {
        type: Number,
        required: true,
        default: 1
    },
})

module.exports = mongoose.model('Korisnik', korisnikSchema)