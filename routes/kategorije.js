const express = require('express')
const Kategorija = require('./../models/kategorije')
const FilmKategorije = require('./../models/filmKategorije')
const router = express.Router()

//Stranica za CRUD kategorija
router.get('/', async (req, res) => {
    const kategorije = await Kategorija.find().sort({ naziv: 'desc' })
    res.render('kategorije/kategorijeManage', { kategorije: kategorije })
})

//Stranica za dodavanje kategorije
router.get('/dodaj', (req, res) => {
    res.render('kategorije/kategorijeDodaj', { kategorija: new Kategorija() })
})

//Stranica za uredivanje kategorije
router.get('/uredi/:id', async (req, res) => {
    const kategorija = await Kategorija.findById(req.params.id)
    res.render('kategorije/kategorijeUredi', { kategorija: kategorija })
})

//Dodavanje nove kategorije
router.post('/dodaj', async (req, res) => {
    console.log("Samo dodajem")
    const kategorija = new Kategorija({
        naziv: req.body.naziv,
        opis: req.body.opis
    })
    await kategorija.save()
    res.redirect('/kategorije')
})

//Uredivanje kategorije
router.put('/uredi/:id', async (req, res) => {
    await Kategorija.findById(req.params.id)
        .then((model) => {
            return Object.assign(model, {
                naziv: req.body.naziv,
                opis: req.body.opis
            });
        })
        .then((model) => {
            return model.save()
        });

    res.redirect('/kategorije')
})

//Brisanje kategorije
router.delete('/:id', async (req, res) => {
    await Kategorija.findByIdAndDelete(req.params.id)
    await FilmKategorije.find({kategorija:req.params.id}).deleteMany()
    res.redirect('/kategorije')
})

module.exports = router