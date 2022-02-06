const express = require('express')
const Film = require('./../models/filmovi')
const FilmKategorije = require('./../models/filmKategorije')
const Kategorija = require('./../models/kategorije')
const FilmOcjene = require('./../models/filmOcjene')
const filmOcjene = require('./../models/filmOcjene')
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
    if(req.session.result){
        const film = await Film.findById(req.params.id)

        var kategorijeFilma = await FilmKategorije.find({film: film.id})
        var naziviKategorija = await dohvatiKategorije(kategorijeFilma)
        var komentari = await filmOcjene.find({film: film.id}).sort({datum: 'desc'})

        var korisnikKomentiral = await filmOcjene.find({film: film.id, korisnik:req.session.result})

        res.render('filmovi/filmoviVise', {
            film: film, 
            kategorije: 
            naziviKategorija, 
            komentari: komentari, 
            korisnik: req.session.result,
            korisnikKomentiral : korisnikKomentiral
        })
        
    }else{
        res.redirect('/')
    }
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
//Stranica za preporuke
router.get('/preporuceno', async(req,res)=>{
    if(req.session.result){
        filmoviSaFaktorom = await algoritamZaPreporuke(req)
        res.render('filmovi/preporuceni',{filmovi: Array.from(filmoviSaFaktorom)})
    }else{
        res.redirect('/')
    }
})
//Uredivanje filma
router.put('/uredi/:id', async (req, res) => {
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
//Dodavanje novog komentara na film
router.post('/detalji/komentiraj/:id', async(req, res)=>{
    if(req.body.ocjena > 0 && req.body.ocjena <=5){
        const ocjena = new FilmOcjene({
            film: req.params.id,
            komentar: req.body.komentar,
            ocjena: req.body.ocjena,
            korisnik: req.session.result
        })
        await ocjena.save()
        res.redirect('/filmovi/detalji/'+req.params.id)
    }else{
        res.redirect('/filmovi/detalji/'+req.params.id)
    }
    
})
//Brisanje komentara i redirect na istu tu stranicu
router.delete('/detalji/obrisi-komentar/:id/:idFilma', async(req, res)=>{
    await FilmOcjene.findByIdAndDelete(req.params.id)
    res.redirect('/filmovi/detalji/'+req.params.idFilma)
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
//Brisem film, sve njegove kategorije i ocjene
router.delete('/crud/:id', async (req, res) => {
    await Film.findByIdAndDelete(req.params.id)
    await FilmKategorije.find({film:req.params.id}).deleteMany()
    await FilmOcjene.find({film:req.params.id}).deleteMany()
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

async function algoritamZaPreporuke(req){
    var listaOcjenaPoKategoriji = []
    //lista ocjena sadrzi id kategorije i ocjenu

    const korisnik = req.session.result //id korisnika
    const ocjeneKorisnika = await filmOcjene.find({korisnik: korisnik}) //korisnikovi komentari

    //za svaku ocjenu korisnika dodajem element objekt u listaOcjenaPoKategoriji
    //ako film sadrzi 3 kategorije i dobije ocjenu x, onda svakoj toj kategoriji dam ocjenu x
    //na kraju dobim listu objekta v kojem je svaka kategorija sa ocjenom
    for(var i in ocjeneKorisnika){
        var kategorijeFilma = await FilmKategorije.find({film: ocjeneKorisnika[i].film})
        for(j in kategorijeFilma){
            var element = {}
            element.id = kategorijeFilma[j].kategorija
            element.ocjena = ocjeneKorisnika[i].ocjena
            listaOcjenaPoKategoriji.push(element)
        }
    }
    //ispis ocjena 
    //console.log(listaOcjenaPoKategoriji)

    //getanje svih kategorija
    const sveKategorije = await Kategorija.find()
    var kategorijeSaFaktorom = []
    //Zbrajanje ocjena svake kategorije i brojanje koliko je ta kategorija dobila ocjeni
    for(var i in sveKategorije){
        id = sveKategorije[i].id //id kategorije

        var ocjeneZaKategoriju = listaOcjenaPoKategoriji.filter(i=>i.id == id)//broj ocjena
        var brojOcjenaZaKategoriju = ocjeneZaKategoriju.length//broj ocjena
        var sumaOcjena = listaOcjenaPoKategoriji.filter(i=>i.id == id).reduce((a,b)=> a + b.ocjena,0);//suma ocjena
        var prosjecnaOcjena = (sumaOcjena/5).toFixed(2)
        var faktorPreporuke = (prosjecnaOcjena * sumaOcjena).toFixed(2)
        
        // console.log(sveKategorije[i].naziv)
        // console.log("--------Broj ocjena: "+brojOcjenaZaKategoriju)
        // console.log("--------Suma ocjena: "+sumaOcjena)
        // console.log("--------Prosjecna ocjena: "+prosjecnaOcjena)
        // console.log("--------Faktor preporuke: "+faktorPreporuke)

        //dodavanje novog atributa kategoriji
        var rKategorija = sveKategorije[i].toObject()
        rKategorija.id = sveKategorije[i].id
        rKategorija.faktor = faktorPreporuke
        kategorijeSaFaktorom.push(rKategorija)
    }
    //console.log(kategorijeSaFaktorom)

    //Dodavanje zbrojene sume faktora svakom filmu
    var filmoviZaStranicu = []
    const filmovi = await Film.find()
    for(var i in filmovi){

        var idFilma = filmovi[i].id
        var ocjenjen = ocjeneKorisnika.filter(i=>i.film == idFilma) //trazimo da li je korisnik vec ocjenio film
        //ako nije ocjenio film onda ulazimo u petlju
        if(ocjenjen.length === 0){
            var kategorijeFilma = await FilmKategorije.find({film: filmovi[i].id})
            var faktorZaFilm = 0
            for(var j in kategorijeFilma){
                var kategorijaFilma = kategorijeSaFaktorom.find(i=>i.id == kategorijeFilma[j].kategorija)
                faktorZaFilm = +faktorZaFilm + +kategorijaFilma.faktor
            }
            console.log(filmovi[i].naziv+" Faktor: "+faktorZaFilm)
            //objektu dodajem atribut faktora i dodajem v novu listu
            var idFilma = filmovi[i].id
            var rFilm = filmovi[i].toObject()
            rFilm.faktor = faktorZaFilm
            rFilm.id = idFilma
            filmoviZaStranicu.push(rFilm)
        }

    }
    //sortiranje
    function compare( a, b ) {
        if ( a.faktor < b.faktor ){
          return 1;
        }
        if ( a.faktor > b.faktor ){
          return -1;
        }
        return 0;
      }
      filmoviZaStranicu.sort( compare );
      //console.log(filmoviZaStranicu)

    return filmoviZaStranicu
}


module.exports = router