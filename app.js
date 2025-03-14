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

const { MongoClient, ObjectId } = require('mongodb');
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
    const postsCollection = (await dbo.collection("posts").find().toArray()).reverse();
    let isLogged = (req.params.isLogged === "logged");
    resp.render('home', {
        layout: 'index',
        title: 'AskAway - Home',
        logged: isLogged,
        posts: postsCollection
    });
})

server.post('/posts', async function(req, resp) {
    req.body.user = "LuisDaBeast";
    req.body.upCount = 0;
    req.body.downCount = 0;
    req.body.isEdited = false;
    req.body.dpUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBbQ3hl3GmlXklLXZQtNu5NNAbxYqVWz85ew&s";
    req.body.comments = [];

    const dbo = mongoClient.db(databaseName);
    dbo.collection("posts").insertOne(
        req.body,
        function(err, res){
            if (err) console.log(err);
            
        }
    )


    // resp.json(req.body);

    resp.redirect("/home-logged");
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
    const postsCollection = await dbo.collection("posts").find().toArray();

    let isLogged = (req.params.isLogged === "logged");

    resp.render('profile-comments', {
        layout: 'index',
        title: 'AskAway - Profile',
        logged: isLogged,
        posts: postsCollection
    });
});


server.get('/login', async function (req, resp) {
    resp.render('login', {
        layout: 'index',
        title: 'AskAway - Login',
        error: false
    })
})

server.post('/login', async function (req, resp) {
    const inputtedUsername = req.body.username;
    const inputtedPassword = req.body.password;

    const dbo = mongoClient.db(databaseName);
    const match = await dbo.collection("users").findOne({ "username": inputtedUsername });

    if (match == null) {
        return resp.render('login', {
            layout: 'index',
            title: 'AskAway - Login',
            error: true
        })
    }
    if (match.password != inputtedPassword) {
        return resp.render('login', {
            layout: 'index',
            title: 'AskAway - Login',
            error: true
        })
    } else {
        return resp.redirect('/home-logged');
    }
})

server.get('/register', function (req, resp) {
    resp.render('register', {
        layout: 'index',
        title: 'AskAway - Register',
    })
})

server.post('/register', async function (req, resp) {

    const dbo = mongoClient.db(databaseName);

    const userCollection = dbo.collection("users");
    let username = req.body.username;
    let password = req.body.password;

    var user = {
        username: username,
        password: password
    }

    var isNew = await userCollection.findOne({"username": username}) == null;

    if (isNew){

        userCollection.insertOne(
            user,
            function(err, res){
                if (err)
                    resp.render('register', {
                        layout: 'index',
                        title: 'AskAway - Register',
                        error: true,
                        errorMessage: "Unexpected error occurred"
                    });
            }
        )
        return resp.redirect('/home-logged');
    }

    else {
        resp.render('register', {
            layout: 'index',
            title: 'AskAway - Register',
            error: true,
            errorMessage: "Username already exists"
        });
    }

    
})

server.get('/post-:isLogged/:id', async function (req, resp) {
    const dbo = mongoClient.db(databaseName);
    let oid = getOid(req.params.id);
    let isLogged = (req.params.isLogged === "logged");
    const postsCollection = await dbo.collection("posts").find({_id : oid}).toArray(); // TODO: refactor because find by id is a single element, does not need an array
    resp.render('post', {
        layout: 'index',
        title: 'View Post',
        logged: isLogged,
        posts: postsCollection
    })
})

server.delete('/post-:isLogged/:id', async function(req, res) {
    const dbo = mongoClient.db(databaseName);
    let oid = getOid(req.params.id);
    await dbo.collection("posts").deleteOne({_id : oid});

    res.sendStatus(200);
})
server.get('/about', async function (req, resp) {
    resp.render('about', {
        layout: 'index',
        title: 'About page',
    })
})

// TODO ideas
// collection =  mongodb get a post given user id (luis) -> returns post object, has comments, whose comments have replies
// current user is luisthebeast. Can be derived from the session/token MCO3
// Step 1. Evaluate main post. Is author == luisthebeast. If true, add new field isEditable = true, add new field isDeletable = true
// Step 2. Evaluate all comments. Is author == luisthebeast. If true, add new field isEditable = true, add new field isDeletable = true
// Step 2.1 Evaluate all replies to one comment. Is author == luisthebeast. If true, add new field isEditable = true, add new field isDeletable = true


const port = 3000;
server.listen(port, function () {
    console.log('Listening at port ' + port);
});

function getOid(oid){
    let tester = /[0-9A-Fa-f]{6}/g;

    if (tester.test(oid)){
        return new ObjectId(oid + "");
    }

    return oid;
}

