// Express boilerplates

const express = require('express');
const server = express();

const bodyParser = require('body-parser')
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// const handlebars = require('express-handlebars');
// server.set('view engine', 'hbs');
// server.engine('hbs', handlebars.engine({
//     extname: 'hbs'
// }));



const handlebars = require('express-handlebars');
// Create Handlebars instance with helpers
const hbs = handlebars.create({
    extname: 'hbs',
    helpers: {
        eq: function (a, b) {
            return a === b;
        }
    }
});

// Set up Handlebars with Express
server.engine('hbs', hbs.engine);
server.set('view engine', 'hbs');



server.use(express.static('public'));

// MongoDB boilerplates

const { MongoClient } = require('mongodb');
const databaseURL = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(databaseURL);

// Main

const databaseName = "MCO";

async function initialConnection() {
    let con = await mongoClient.connect();
    const dbo = mongoClient.db(databaseName);
}

initialConnection();


server.get('/', function (req, resp) {
    resp.redirect('/home-unlogged');
})

server.get('/home-:isLogged', async function (req, resp) {
    const dbo = mongoClient.db(databaseName);
    const postsCollection = await dbo.collection("posts").find().toArray();
    let isLogged = (req.params.isLogged === "logged");
    resp.render('home', {
        layout: 'index',
        title: 'AskAway - Home',
        logged: isLogged,
        posts: postsCollection
    });
})

server.get('/profile-posts-:isLogged', async function (req, resp) {
    const dbo = mongoClient.db(databaseName);
    const postsCollection = await dbo.collection("posts").find().toArray();
    // const filteredPosts = postsCollection.filter(post => post.user === "LuisDaBeast"); // Filter posts

    let isLogged = (req.params.isLogged === "logged");
    resp.render('profile-posts', {
        layout: 'index',
        title: 'AskAway - Profile',
        logged: isLogged, 
        posts: postsCollection
    });
});

server.get('/profile-comments-:isLogged', async function (req, resp) {
    const dbo = mongoClient.db(databaseName);
    const commentsCollection = await dbo.collection("comments").find().toArray();

    let isLogged = (req.params.isLogged === "logged");

    resp.render('profile-comments', {
        layout: 'index',
        title: 'AskAway - Profile',
        logged: isLogged, 
        commentsCollection : commentsCollection[0]
    });
});


server.get('/login', function (req, resp) {
    resp.render('login', {
        layout: 'index',
        title: 'AskAway - Login',
    })
})

server.get('/register', function (req, resp) {
    resp.render('register', {
        layout: 'index',
        title: 'AskAway - Register',
    })
})

server.get('/post-:isLogged', async function (req, resp) {
    const dbo = mongoClient.db(databaseName);
    let isLogged = (req.params.isLogged === "logged");
    const commentsCollection = await dbo.collection("comments").find().toArray();
    resp.render('post', {
        layout: 'index',
        title: 'View Post',
        logged: isLogged,
        commentsCollection: commentsCollection[0]
    })
})

const port = 3000;
server.listen(port, function () {
    console.log('Listening at port ' + port);
});

