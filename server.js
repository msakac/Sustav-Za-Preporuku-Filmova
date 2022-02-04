const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const app = express()

mongoose.connect('mongodb://localhost/tbprojekt', { useNewUrlParser: true, useUnifiedTopology: true })

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res)=>{
    res.render('index')
})

app.listen(9999, () => {
    console.log('Server live at 9999')
})