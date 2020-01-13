// implement your API here
const express = require('express');
const cors = require('cors');

const db = require('./data/db');

const server = express();

server.use(express.json());
server.use(cors())

server.get('/', (req, res) => {
    res.status(200).json({hello: 'Web25'})
})

server.get('/api/users', (req, res) => {
    db.find()
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json({ errorMessage: "The users information could not be retrieved." }))
})

server.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;

    db.findById(userId)
        .then(user => {
            if(!user){
                res.status(404).json({errorMessage: "The user with the specified ID does not exist."})
                return null;
            }
            res.status(200).json(user)
        })
        .catch(err => res.status(500).json({errorMessage: "The user information could not be retrieved."}))
})

server.post('/api/users', (req, res) => {
    const newUser = req.body;

    if(!newUser.name || !newUser.bio) {
        res.status(400).json({errorMessage: 'Please provide name and bio for the user.'});
        return null
    }

    db.insert(newUser)
        .then(user => res.status(201).json(user))
        .catch(err => {
            res.status(500).json({errorMessage: "There was an error while saving the user to the database"})
        })

})

server.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const userData = req.body;

    if(!userData.name || !userData.bio) {
        res.status(400).json({errorMessage: 'Please provide name and bio for the user.'});
        return null
    }

    db.update(userId, userData)
        .then(user => {
            if(!user){
                res.status(404).json({errorMessage: "The user with the specified ID does not exist."})
                return null;
            }
            res.status(200).json(user)
        })
        .catch(err => res.status(500).json({ errorMessage: "The user information could not be retrieved." }))
})

server.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;

    db.remove(userId)
        .then(user => {
            if(!user){
                res.status(404).json({errorMessage: "The user with the specified ID does not exist."})
                return null;
            }
            res.status(200).json(user)
        })
        .catch(err => res.status(500).json({ errorMessage: "The user could not be removed" }))
})


const port = 8000;
server.listen(port, () => {
    console.log(`\n ** api listening on port ${port} ** \n`);
})