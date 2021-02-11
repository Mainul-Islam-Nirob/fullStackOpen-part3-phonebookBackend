const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

// middleware
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())


let persons = [
    {
        "id": 1,
        "name": "Nirob Chowdhury",
        "number": "01783791670"
    },
    {
        "id": 2,
        "name": "Mainul Islam",
        "number": "01885597774"
    },
    {
        "id": 3,
        "name": "Ridoy Khan",
        "number": "01752311016"
    },
    {
        "id": 4,
        "name": "Aman Mahbub Hasan",
        "number": "01719121739"
    }
]

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
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(
        `<div>
            <span>Phonebook has info of ${persons.length} people</span> 
        </div>
        <span>${new Date().toString()}</span>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const generateId = () => (Math.random() * 10000).toFixed(0)

    const { body } = request

    // Empty related error handling
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

    // Checking if person is already exist
    const alreadyExist = persons.some(person => person.name === body.name)

    if (alreadyExist) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})