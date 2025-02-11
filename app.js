const express = require('express');
const mongoose = require('mongoose');
const shortUrl = require("./models/shortUrl")
const bodyParser = require('body-parser')
const uri = "mongodb+srv://kudakai:Theansweris43!@cluster0.ge6bi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(uri)
    .then(() => {
        console.log("Connected to DB")
    }).catch((err) => {
        console.log(err)
    })

const app = express();

app.set('view engine', 'ejs')
// app.use(express.urlencoded({extended: false}))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    shortUrl.find()
        .then((data) => {
            res.render('index', {shortUrls: data})
        })
    // res.render('index')
})

app.post('/shortUrls', (req, res) => {
    shortUrl.create({full: req.body.fullURL}).then(() => {
        res.redirect("/")
    })
})

app.get("/:shortUrl", (req, res) => {
    shortUrl.findOne({short: req.params.shortUrl}).then((data) => {
        if(data == null){
            return res.sendStatus(404)
        }else{
            data.clicks++
            data.save()
            res.redirect(data.full)
        }
    })
})

app.listen(3000)