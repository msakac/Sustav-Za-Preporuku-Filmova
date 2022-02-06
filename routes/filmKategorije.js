const express = require('express')
const Film = require('./../models/filmovi')
const FilmKategorije = require('./../models/filmKategorije')
const Kategorija = require('./../models/kategorije')
const router = express.Router()

//Stranica za prikaz kategorije filma
router.get('/:id', async (req, res) => {
    const film = await Film.findById(req.params.id)
    const filmKategorije = await FilmKategorije.find({film:film.id})
    const kategorije = await Kategorija.find()
    const error = req.session.error;
    delete req.session.error

    res.render('filmKategorije/filmKategorijeManage', {
        film:film, 
        kategorije:kategorije, 
        kategorijeZaStranicu: await dohvatiKategorijeZaPrikaz(filmKategorije),
        errorPoruka: error
    })
})

//Dodavanje nove kategorije filmu. 
//Prije dodavanja projveravamo dal mozda taj film vec ima tu kategoriju
//Ako ima setamo error poruku i redirectamo
router.post('/dodaj/:id', async(req,res)=>{
    const film = await Film.findById(req.params.id)
    if(req.body.kategorija == "null"){
        req.session.error = "Niste odabrali kategoriju"
    }else{
        const vecPostoji = await FilmKategorije.find({kategorija:req.body.kategorija, film:film.id})
        if(vecPostoji.length != 0){
            req.session.error = "Film već sadrži tu kategoriju"
        }else{
            const filmKategorija = new FilmKategorije({
                film: req.params.id,
                kategorija: req.body.kategorija
            })
            await filmKategorija.save()
        }
    }
    
    res.redirect('/film-kategorije/'+req.params.id)
})

//Brisanje kategorije filma
//Prvi id mi je od kategorije koji koristim za brisanje
//Drugi id mi je od filma koji koristim da redirectam na istu stranicu
router.delete('/obrisi/:idKategorije/:idFilma', async(req,res)=>{
    await FilmKategorije.findOneAndDelete({kategorija:req.params.idKategorije})
    res.redirect('/film-kategorije/'+req.params.idFilma)
})

//Dohvacam objekte kategorija za sve filmKategorije
async function dohvatiKategorijeZaPrikaz(filmKategorije){
    var kategorijeZaStranicu = []
    for(var el in filmKategorije){
        const kat = await Kategorija.findById(filmKategorije[el].kategorija)
        kategorijeZaStranicu.push(kat)
    }
    return kategorijeZaStranicu
}

module.exports = router
