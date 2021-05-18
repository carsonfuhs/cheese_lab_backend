//dependencies
///////////////////////////////////////////////
//get .env variables
require('dotenv').config()

//pull port from the .env, defaulting the value to 3000
const { PORT = 3000, MONGODB_URL } = process.env

//import express
const express = require('express')

//our express app object
const app = express()

//import mongoose
const mongoose = require('mongoose')

//import middleware
const cors = require('cors')
const morgan = require('morgan')

//database connection
///////////////////////////////////////////////

//establish connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

//connection events
mongoose.connection
.on('open', () => console.log('You are connected to Mongo'))
.on('close', () => console.log('You are disconnected from Mongo'))
.on('error', (error) => console.log(error))

//models
///////////////////////////////////////////////
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
})

const Cheese = mongoose.model("Cheese", CheeseSchema)

//middleware
///////////////////////////////////////////////
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())


//routes
///////////////////////////////////////////////
//create a test route
app.get('/', (req, res) => {
    res.send('hello world')
})

//index route - displays all types of cheese
app.get('/cheese', async (req, res) => {
    try {
        res.json(await Cheese.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

//cheese create route
app.post("/cheese", async (req, res) => {
    try {
        res.json(await Cheese.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.put('/cheese/:id', async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.delete('/cheese/:id', async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.listen(PORT, () => console.log(`LISTENING ON PORT ${PORT}`))