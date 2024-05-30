const express = require("express");
require('dotenv').config();
const { MongoClient } = require('mongodb');

const mongodb_url = 'mongodb://localhost:27017';
const client = new MongoClient(mongodb_url);



// create the server 
const server = express();

// middleware
server.use(express.json())

// set the port 
const server_port = 8085;

// define our routes
server.get("/", (request, response) => {

    response.status(200).send({
        "message":  "You are on the home route from OA", 
        "code" : "success"
    })


});

// get email
server.get("/get-email", (req, res) => {

    console.log(req.query);

    let id = req.query.id


    res.send({
        "message": "Sends an email ... from OA  ",
        "code": "success"
    })

})


// creates an email
server.post("/create-email", async (req, res) => {
    // Requirements for creating an email
    // 1. user token
    // 2. email subject
    // 3. email body

    console.log(req.headers.authorization);
    let auth = req.headers.authorization;
    let user_token = auth.split(" ")[1];

    console.log(user_token)

    // check if this token is valid


    // get the subject and content from the body of the request
    let subject = req.body.subject;
    let body = req.body.body;

    let feedback = await client.db(process.env.DATABASE_NAME).collection("emails").insertOne({
        subject, 
        body
    });


    // returns an id that represents the email in the database

    res.status(201).send({
        message: "Email created successfully", 
        data: feedback, 
        code: "success"
    });
})

// send an email



// create user account
server.post("/create-account", async (request, response) => {
    // define

    console.log(request.body);

    let firstname = request.body.firstname;
    let lastname = request.body.lastname;
    let email = request.body.email;
    let password = request.body.password;

    const feedback = await client.db(process.env.DATABASE_NAME).collection("users").insertOne({
        firstname,
        lastname,
        email,
        password
    })


    response.status(201).send({
        message: "User account was created successfully", 
        code: "success"
    })
})




// start the server, make the server start listening
server.listen(server_port, () => console.log(`server is listening on port ${server_port}, http://localhost:${server_port}`))
