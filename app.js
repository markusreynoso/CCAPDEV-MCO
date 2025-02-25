// Express boilerplates

const express = require('express');
const server = express();

const bodyParser = require('body-parser')
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs'
}));

server.use(express.static('public'));

// MongoDB boilerplates

const { MongoClient } = require('mongodb');
const databaseURL = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(databaseURL);

// Main
const databaseName = "MCO";

async function initialConnection(){
    let con = await mongoClient.connect();
    // console.log("Attempt to create!");
    const dbo = mongoClient.db(databaseName);
    /* Will create a collection if it has not yet been made */
    // dbo.createCollection(collectionName);
  }
initialConnection();

server.get('/', async function(req, resp){
    const dbo = mongoClient.db(databaseName);
    const postsCollection = await dbo.collection("posts").find().toArray();
    resp.render('home', {
        layout: 'index',
        title: 'AskAway - Home',
        logged: false,
        posts: postsCollection
    })
})

server.get('/home-logged', async function(req, resp){
    const dbo = mongoClient.db(databaseName);
    const postsCollection = await dbo.collection("posts").find().toArray();
    resp.render('home', {
        layout: 'index',
        title: 'AskAway - Home',
        logged: true,
        posts: postsCollection
    })
})

server.get('/login', function(req, resp){
    resp.render('login', {
        layout: 'index',
        title: 'AskAway - Login',
    })
})

server.get('/register', function(req, resp){
    resp.render('register', {
        layout: 'index',
        title: 'AskAway - Register',
    })
})

server.get('/post/:isLogged', function(req, resp){
    let isLogged = (req.params.isLogged === "logged");
    resp.render('login', {
        layout: 'index',
        title: 'View Post',
        logged: isLogged
    })
})

const port = 3000;
server.listen(port, function () {
    console.log('Listening at port ' + port);
});

