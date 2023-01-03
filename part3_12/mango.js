/*mongodb+srv://arsenij:<password>@cluster0.xvlknz4.mongodb.net/?retryWrites=true&w=majority   */
const mongoose = require('mongoose')

if (process.argv.length < 3){
    console.log('please provide password as argument: node mango.js <password> ')
    process.exit(1)
}

console.log(process.argv.length)

const password = process.argv[2]

const url = `mongodb+srv://arsenij:${password}@cluster0.xvlknz4.mongodb.net/?retryWrites=true&w=majority`

const peopleSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

const Person = mongoose.model('Person', peopleSchema)


if(process.argv.length == 5){
mongoose
    .connect(url)
    .then((result) => {
        console.log('connected')

        const person = new Person({
            name: process.argv[3],
            number: process.argv[4],
        })
        return person.save()
    })
    .then(() => {
        console.log(process.argv[3], process.argv[4], ' saved')
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
    .then(() => process.exit(1))
}

if(process.argv.length == 3){
    mongoose
        .connect(url)
        .then((x) => {
            console.log('phonebook:')
        })
    Person.find({}).then(result => {
        result.forEach(x => {
            console.log(x)
        })
        mongoose.connection.close()
    })
    .then(() => process.exit(1))
}

peopleSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
