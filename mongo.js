const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url =`mongodb+srv://fullstack:${password}@cluster0.vlgfh.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
})

if (process.argv.length === 5) {
    person.save().then(() => {
        // console.log("arg0", argv[0])
        // console.log("arg1", argv[1])
        // console.log("arg2", argv[2])
        // console.log("arg3", argv[3])
        // console.log("arg4", argv[4])
        // console.log("arg5", argv[5])
        // console.log("arg6", argv[6])
        console.log(`Added name: ${process.argv[3]} number: ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length === 4 || process.argv.length > 5) {
    console.log(`Please give the exact number of arguments. If the name containes space, wrap it in quotes`)
    mongoose.connection.close()
}
