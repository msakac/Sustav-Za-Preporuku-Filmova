const express = require('express')
const Film = require('./../models/filmovi')
const FilmKategorije = require('./../models/filmKategorije')
const Kategorija = require('./../models/kategorije')
const router = express.Router()

//Stranica za CRUD filmova
router.get('/crud', async (req, res) => {
    const filmovi = await Film.find().sort({ datumIzlaska: 'desc' })
    
    //filmovima dodam kategorije
    filmoviZaStranicu = await dohvatiKategorijeZaSvakiFilm(filmovi)
    res.render('filmovi/filmoviManage', { filmovi: Array.from(filmoviZaStranicu)})
})

//Stranica za prikaz detalja filma
router.get('/detalji/:id', async(req,res)=>{
    var filmZaDetalje = []

    const film = await Film.findById(req.params.id)

    var kategorijeFilma = await FilmKategorije.find({film: film.id})
    var naziviKategorija = await dohvatiKategorije(kategorijeFilma)
    console.log(naziviKategorija)
    for(i in naziviKategorija){
        console.log(naziviKategorija[i])
    }
    res.render('filmovi/filmoviVise', {film: film, kategorije: naziviKategorija })
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
        trajanje: req.body.trajanje,
        glumci: req.body.glumci,
        slika: req.body.slika,
        najava: req.body.najava
    })
    await film.save()
    res.redirect('/filmovi/crud')
})

//Brisanje filma
//Brisem film i brišem sve njegove kategorije
router.delete('/crud/:id', async (req, res) => {
    await Film.findByIdAndDelete(req.params.id)
    await FilmKategorije.find({film:req.params.id}).deleteMany()
    res.redirect('/filmovi/crud')
})

async function dohvatiKategorijeZaSvakiFilm(filmovi){
    var filmoviZaStranicu = []
    for(var i in filmovi){
        var kategorijeFilma = await FilmKategorije.find({film: filmovi[i].id})
        var naziviKategorija = await dohvatiKategorije(kategorijeFilma)
        var idFilma = filmovi[i].id
        var rFilm = filmovi[i].toObject()
        rFilm.kategorije = naziviKategorija
        rFilm.id = idFilma
        filmoviZaStranicu.push(rFilm)
    }
    return filmoviZaStranicu
}

async function dohvatiKategorije(filmKategorije){
    var kategorijeZaStranicu = []
    for(var el in filmKategorije){
        const kat = await Kategorija.findById(filmKategorije[el].kategorija)
        kategorijeZaStranicu.push(kat.naziv)
    }
    return kategorijeZaStranicu
}
module.exports = router