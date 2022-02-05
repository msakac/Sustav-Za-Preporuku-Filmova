const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Korisnik = require('./models/korisnik')
const korisnikRouter = require('./routes/korisnik')
const filmoviRouter = require('./routes/filmovi')
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

app.get('/', async (req, res)=>{
    console.log(req.session.result)
    if(req.session.result){
        res.render('index')
    }else{
        res.redirect('/korisnik/login')
    }
    
})




app.listen(9999, () => {
    console.log('Server live at 9999')
})