const personsRouter = require('express').Router()
const Person = require('../models/person');


// ROUTET
personsRouter.get('/', (request, response) => {  
    //haetaan kaikki tietokannasta ja palautetaan frontille json-merkkijonona
        Person.find({}).then(result => { 
          console.log("Result: " + result)
          console.log(JSON.stringify(result))
          response.json(JSON.stringify(result)) 
        })
    })
    
personsRouter.get('/info', (request, response) => {

    const maxId = jsondata.persons.length > 0
    ? Math.max(...jsondata.persons.map(n => n.id)) 
    : 0
    const thistime = new Date()
    response.send(`<div>Phonebook has info for ${maxId} people</div><div>${thistime}</div>`)
  })
    
personsRouter.get('/:id', (request, response, next) => {
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
    
    
personsRouter.delete('/delete/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
  .catch(error => next(error))
})
    
    
personsRouter.post('/:person', (request, response, next) => {
    
  const person = JSON.parse(request.params.person)
    
  const pers = new Person({
    name: person.name,
    number: person.number,
  })
      
  pers.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error)) 
})
    
    
personsRouter.put('/:id', (request, response, next) => {
  const {name, number} = request.body
  
  Person.findByIdAndUpdate(request.params.id, {name, number}, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
  .catch(error => next(error))
})
    
module.exports = personsRouter