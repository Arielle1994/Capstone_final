const express = require('express');
const app = express();
const configdb = require ('./config');
const event= require('./models/event');
const participant= require('./models/participant');
const race_distance= require ('./models/race_distance');
const registration= require ('./models/registration');
const cors= require('cors');

app.use(cors());

app.use(express.urlencoded({extended:false})); //adding a global middleware
app.use(express.json()); //Angular


configdb.authenticate() //the promise
    .then(function(){
        console.log("Database is connected");
    })
    .catch(function(){
        console.log("there is no connection");
    })


//set up the routes here:

app.get('/participants', function (req, res) {

    participant.findAll()
        .then(function (results) {
            res.status(200).send(results);
        })
        .catch(function (error) {
            res.status(500).send(error);
        })
})


//get route for the events- will be similar to participants find by events
//post

//Creating a new task for getting a participant 
//creating the get events for the rest

//POST in how we get and save the data into the seperate tables
// app.post('/registration', function (req, res) {
//     let registration_data = req.body;
//     participant.create(registration_data)
//         .then(function (result) {
//             res.status(200).send(result);
//         })
//         .catch(function (error) {
//             res.status(500).send(error);
//         });
    
//         registration.create(registration_data)
//         .then(function (result) {
//             res.status(200).send(result);
//         })
//         .catch(function (error) {
//             res.status(500).send(error);
//         })
// })



//get route for the specific event_id



// app.get('/tasks/:task_id', function(req, res){
//     let taskId= req.params.task_id;

//     Task.findByPk(taskId).then(function (result){
//         res.status(200).send(result);
//     }). catch(function(err){
//         res.status(500).send(err);
//     });
// });




app.listen(3000,function(){
    console.log('server running at port 3000');
})
