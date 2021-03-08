const express = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

// middleware
app.use(express.static('build'))
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

// Morgan Token
morgan.token("person", (request, response) => {
    if (request.method === "POST") {
        return JSON.stringify(request.body)
    } else {
        return null
    }
})

app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :person"
    )
)

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON()))
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then((persons) => {
        response.send(
            `<div>
                <span>Phonebook has info of ${persons.length} people</span> 
            </div>
            <span>${new Date().toString()}</span>`
        )
    })
})

app.get('/api/persons/:id', (request, response, next) => {

    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            }else{
                response.status(404).end()
            }   
    })
    .catch((error) => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {       
            response.status(204).end()
        })
        .catch(error => next(error))
   
})

app.post('/api/persons', (request, response, next) => {

    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: "name is required"
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: "number is required"
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person
        .save()
        .then(savedPerson => {
            response.json(savedPerson.toJSON())
        .catch((error) =>(error))
    })

})

app.put('/api/persons/:id', (request, response, next) => {
    const { body } = request
    const { id } = request.params

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(id, person, { new: true })
        .then((updatedPerson) => {
            response.json(updatedPerson.toJSON())
        })
        .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.message.includes('ObjectId')) {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

// handler of requests with result to errors
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})