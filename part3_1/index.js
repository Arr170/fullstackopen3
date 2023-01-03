require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Person = require('./comunication/mango')
const app = express()
app.use(express.static('build'))
app.use(express.json())
app.use(cors())

const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if(error.name === 'CastError'){
        return response.status(400).send({ error: 'malformated id' })
    }else if(error.name === 'ValidationError'){
        return response.status(400).json({ error: error.message })
    }
    next(error)
}


app.get('/api/persons', (require, response, next) => {
    Person.find({}).then(names => {
        response.json(names)
    })
        .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    const date = new Date
    Person.find({})
        .then(names => {
            response.send(`Phonebook has info about ${names.length} people. ${date}`)
        })
        .catch(error => next(error))


})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.find({ _id: id }).then(names => {

        if(names){response.json(names)}
        else{response.status(404).end()}
    })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    //console.log('deleting...', request.params.id)
    Person.findByIdAndDelete(request.params.id)
        // eslint-disable-next-line no-unused-vars
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    //if(!body.name){return response.status(400).json({error: 'name missing'})}
    //if(!body.number){return response.status(400).json({error: 'number missing'})}

    const name = new Person({
        name: body.name,
        number: body.number,
    })

    name.save().then(savedName => {
        response.json(savedName)
    })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    if(!body.name){return response.status(400).json({ error: 'name is missing' })}
    if(!body.number){return response.status(400).json({ error: 'number is missing' })}

    const name = {
        name: body.name,
        number: body.number,
    }

    // eslint-disable-next-line no-undef
    Person.findByIdAndUpdate(request.params.id, name, { new: true, runValidations: true, context: query })
        .then(updated => {response.json(updated)})
        .catch(error => next(error))
})

app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
