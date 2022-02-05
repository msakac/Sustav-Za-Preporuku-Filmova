const express = require('express')
const Korisnik = require('./../models/korisnik')
const session = require('express-session')
const router = express.Router()

//Renderamo stranicu registracije. Ako je korisnik logiran redirectamo na početnu
router.get('/registracija', (req, res) => {
    if(req.session.result){
        res.redirect('/')
    }else{
    res.render('registracija', {errorPoruka: req.errorPoruka})
    }
})
//Renderamo stranicu prijave. Ako je korisnik logiran redirectamo na početnu
router.get('/login', (req,res)=>{
    if(req.session.result){
        res.redirect('/')
    }else{
        res.render('login', {errorPoruka: req.errorPoruka})
    }
    
})

router.get('/bezvezni',(req, res)=>{
    res.render('bezvezni')
})

//Registracija
router.post('/registracija', async (req, res) => {
    const postojiKorIme = await Korisnik.find({ korisnickoIme: req.body.korisnickoIme })
    if (postojiKorIme !== null && postojiKorIme !== '') {
        res.render('registracija', {errorPoruka: "Korisnicko ime vec postoji"})
    } else {
        const korisnik = new Korisnik({
            ime: req.body.ime,
            prezime: req.body.prezime,
            korisnickoIme: req.body.korisnickoIme,
            email: req.body.email,
            lozinka: req.body.lozinka
        })
        await korisnik.save()
        res.render('login')
    }
})

//Login
router.post('/login', async(req, res) =>{
    const korisnikPostoji = await Korisnik.findOne({korisnickoIme: req.body.korisnickoIme})
    if(korisnikPostoji){
        const korisnik = new Korisnik
        if(korisnikPostoji.lozinka == req.body.lozinka){
            //Ako se logira, kreiramo session i spremamo korisnikov ID. Zatim redirect na početnu
            req.session.result = {
                id: korisnikPostoji.id
            }
            res.redirect('/')
        }else{
            res.render('login', {errorPoruka: "Pogrešna lozinka"})
        }
    }else{
        res.render('login', {errorPoruka: "Korisnik ne postoji"})
    }
})

module.exports = router