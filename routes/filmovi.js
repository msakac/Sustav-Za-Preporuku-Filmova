const express = require('express')
const Film = require('./../models/filmovi')
const router = express.Router()

//Stranica za CRUD filmova
router.get('/crud', async (req, res) => {
    const filmovi = await Film.find().sort({ datumIzlaska: 'desc' })
    res.render('filmovi/filmoviManage', { filmovi: filmovi })
})

//Stranica za dodavanje filmova
router.get('/novi', (req, res) => {
    res.render('filmovi/filmoviDodaj', { film: new Film() })
})

//Stranica za uredivanje filma
router.get('/uredi/:id', async (req, res) => {
    const film = await Film.findById(req.params.id)
    res.render('filmovi/filmoviUredi', { film: film})
})

//Uredivanje filma
router.put('/uredi/:id', async (req, res) => {
    console.log(req.body.datum)
    await Film.findById(req.params.id)
        .then((model) => {
            return Object.assign(model, {
                naziv: req.body.naziv,
                opis: req.body.opis,
                datumIzlaska: req.body.datum,
                reziser: req.body.reziser,
                trajanje: req.body.trajanje,
                glumci: req.body.glumci,
                slika: req.body.slika,
                najava: req.body.najava
            });
        })
        .then((model) => {
            return model.save()
        });
    res.redirect('/filmovi/crud')
})

//Dodavanje novog filma
router.post('/novi', async (req, res) => {
    const film = new Film({
        naziv: req.body.naziv,
        opis: req.body.opis,
        datumIzlaska: req.body.datum,
        zanr: req.body.zanr,
        reziser: req.body.reziser,
        glumci: req.body.glumci,
        slika: req.body.slika,
        najava: req.body.najava
    })
    await film.save()
    res.redirect('/filmovi/crud')
})

//Brisanje filma
router.delete('/crud/:id', async (req, res) => {
    await Film.findByIdAndDelete(req.params.id)
    res.redirect('/filmovi/crud')
})
module.exports = router