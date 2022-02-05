const express = require('express')
const Film = require('./../models/filmovi')
const router = express.Router()

//Stranica za CRUD filmova
router.get('/crud', (req,res)=>{
    res.render('filmoviManage')
})

//Stranica za dodavanje filmova
router.get('/novi',(req,res)=>{
    res.render('filmoviDodaj', {film: new Film()})
})

//Dodavanje novog filma

router.post('/novi', async (req, res)=>{
    const film = new Film({
        naziv: req.body.naziv,
        opis: req.body.opis,
        datumIzlaska: req.body.datumIzlaska,
        zanr: req.body.zanr,
        reziser: req.body.reziser,
        glumci: req.body.glumci,
        slika: req.body.slika,
        najava: req.body.najava
    })
    await film.save()
    res.render('filmoviManage')
})
module.exports = router