const express = require('express')
const app = express()
const Person = require('./models/person');
const { default: mongoose } = require('mongoose');
require('dotenv').config();


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}


// MIDDLEWARET, järjestyksellä on merkitystä
app.use(express.static('build'))
// staattisen toiminnon osoitus (frontti backissa)
app.use(express.json())
app.use(requestLogger) 
// pyyntöjen tulostus terminal-ikkunaan



// ROUTET
app.get('/api/persons', (request, response) => {  
//haetaan kaikki tietokannasta ja palautetaan frontille json-merkkijonona
    Person.find({}).then(result => { 
      console.log("Result: " + result)
      //const temp = Object.values(result);
      console.log(JSON.stringify(result))
      response.json(JSON.stringify(result)) 
    })
    //response.json(persons.persons)
})

app.get('/info', (request, response) => {
    //console.log(request.headers) 
    const maxId = jsondata.persons.length > 0
    ? Math.max(...jsondata.persons.map(n => n.id)) 
    : 0
    const thistime = new Date()
    response.send(`<div>Phonebook has info for ${maxId} people</div><div>${thistime}</div>`)
 })

 app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(pers => {
            if(pers) {
                response.json(pers)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))    
        })


app.delete('/api/persons/delete/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.post
('/api/persons/:person', (request, response, next) => {
    //console.log("req param"+   request.params.person)
    //console.log("req body" + request.body.person)
    const person = JSON.parse(request.params.person)
    
    const pers = new Person({
      name: person.name,
      number: person.number,
    })
    if(person.name >2) {
      pers.save().then(savedPerson => {

        //mongoose.connection.close()
        response.json(savedPerson)
      })
    .catch(error => next(error))
    }
})


app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body
  //console.log(body)

  Person.findByIdAndUpdate(request.params.id, {name, number}, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})



const unknownEndpoint = (request, response) => {
  mongoose.connection.close()
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  // käsitellään tietyt virheet
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {    
    return response.status(400).json({ error: error.message })  
  }
  // jos muu virhe, laitetaan virheilmoitus eteenpäin
  next(error)
}
// tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})



