const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const Korisnik = require('./models/korisnik')
const Filmovi = require('./models/filmovi')
const Kategorije = require('./models/kategorije')
const FilmKategorije = require('./models/filmKategorije')

const korisnikRouter = require('./routes/korisnik')
const filmoviRouter = require('./routes/filmovi')
const kategorijeRouter = require('./routes/kategorije')
const filmKategorijeRouter = require('./routes/filmKategorije')

const session = require('express-session')
const app = express()

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }))

mongoose.connect('mongodb://localhost/tbprojekt', { useNewUrlParser: true, useUnifiedTopology: true })

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'));

app.use('/korisnik', korisnikRouter)
app.use('/filmovi',filmoviRouter)
app.use('/kategorije', kategorijeRouter)
app.use('/film-kategorije', filmKategorijeRouter)

app.get('/', async (req, res)=>{
    console.log(req.session.result)
    if(req.session.result){
        const filmovi = await Filmovi.find().sort({ datumIzlaska: 'desc' })
        res.render('index', {filmovi:filmovi})
    }else{
        res.redirect('/korisnik/login')
    }
    
})


app.listen(9999, () => {
    console.log('Server live at 9999')
})