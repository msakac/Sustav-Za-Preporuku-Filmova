const express = require('express')
const Korisnik = require('./../models/korisnik')
const router = express.Router()

router.get('/pocetna', (req,res)=>{
    res.render('pocetna')
})

module.exports = router