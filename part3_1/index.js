const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

/*morgan.token('body', function(req, res,){
  const body = req.body
  return JSON.stringify(body)})
  app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.body(req, res)
    ].join(' ')
}))*/


let names = [
    { 
      "id": 1,
      "name": "Arte aaaa", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (require, response) => {
 response.json(names)
})

app.get('/info', (request, response) => {
    const personsNumber = names.length
    const date = new Date()
    const info = '<p>Phonebook has info about '+ personsNumber+ ' people</p><p>'+ date + '</p>'
    response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const name = names.find(name => name.id === id)
  
  if(name){response.json(name)}
  else{response.status(404).end()}
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  names = names.filter(name => name.id !== id)
  response.status(204).end()
})

const generateId = (max) => {return(Math.floor(Math.random()*max))}

app.post('/api/persons', (request, response) => {
  const body = request.body
  const dublicate = names.find(name => name.name === body.name)

  if(dublicate !== undefined){return response.status(400).json({error: 'name must be unique'})}
  if(!body.name){return response.status(400).json({error: 'name missing'})}
  if(!body.number){return response.status(400).json({error: 'number missing'})}

  const name = {
    name: body.name,
    number: body.number,
    id: generateId(100),

  }
  
  names = names.concat(name)

  response.json(name)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
