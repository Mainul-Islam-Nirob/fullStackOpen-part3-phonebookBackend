const express = require('express')
const app = express()

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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})