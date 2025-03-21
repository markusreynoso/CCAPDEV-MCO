// Express ========================================================================================================================
const express = require('express');
const server = express();

const bodyParser = require('body-parser')
server.use(express.json());
server.use(express.urlencoded({ extended: true }));


// Handlebars =====================================================================================================================
const handlebars = require('express-handlebars');
const hbs = handlebars.create({
    extname: 'hbs',
    helpers: {
        eq: function (a, b) {
            return a === b;
        }
    }
});

server.engine('hbs', hbs.engine);
server.set('view engine', 'hbs');
server.use(express.static('public'));

// MongoDB =======================================================================================================================
const { MongoClient, ObjectId } = require('mongodb');
const databaseURL = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(databaseURL);


// Mongoose ======================================================================================================================
const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/MCO");


const userSchema = new mongoose.Schema({
    username: { type: String },
    password: { type: String },
    bio: {type: String},
    dpUrl: {type: String}
})

const replySchema = new mongoose.Schema(
    {
        user: { type: String, required: true },
        isEdited: { type: Boolean, default: false },
        repliedTo: { type: String, required: true },
        replyContent: { type: String, required: true },
        upCount: { type: Number, default: 0 },
        downCount: { type: Number, default: 0 },
        dpUrl: { type: String }
    },
    { versionKey: false });

const commentSchema = new mongoose.Schema(
    {
        user: { type: String, required: true },
        isEdited: { type: Boolean, default: false },
        commentContent: { type: String, required: true },
        upCount: { type: Number, default: 0 },
        downCount: { type: Number, default: 0 },
        dpUrl: { type: String },
        hasReplies: { type: Boolean, default: false },
        replies: [replySchema]
    },
    { versionKey: false });

const postSchema = new mongoose.Schema(
    {
        user: { type: String, required: true },
        postContent: { type: String, required: true },
        upCount: { type: Number, default: 0 },
        downCount: { type: Number, default: 0 },
        isEdited: { type: Boolean, default: false },
        title: { type: String, required: true },
        dpUrl: { type: String },
        tag: { type: String },
        hasReplies: { type: Boolean, default: false },
        comments: [commentSchema],
        idString: { type: String }
    },
    { versionKey: false });

const postModel = mongoose.model('post', postSchema);
const userModel = mongoose.model('user', userSchema);


// Sessions ===================================================================================================================
const session = require('express-session');
const MongoStore = require('connect-mongo');

server.use(session({
    secret: 'a secret fruit',
    saveUninitialized: true,
    resave: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/MCO',
        collectionName: 'mySession',
        ttl: 60 * 60
    })
}));


// Main =======================================================================================================================


// GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET-GET
server.get('/', function (req, resp) {
    resp.redirect('/home');
})

server.get('/home', async function (req, resp) {
    const postsCollection = await postModel.find({}).lean();
    // const usersCollection = await userModel.find({}).lean();

    const postsWithDp = await postModel.aggregate([
        {// lookup is basically joining postModel and userModel
            $lookup: {
                from: "users", // users.json
                localField: "user", // "username" local field in posts.json
                foreignField: "username", // "user" foreign field, users.json
                as: "userDetails" // output array that will store the matched user data
            }   
        },

        {
            $unwind: "$userDetails" // convert userDetails array into an object
        },

        {
            $project: {
                _id: 1,
                user: 1,
                postContent: 1,
                upCount: 1,
                downCount: 1,
                isEdited: 1,
                title: 1,
                tag: 1,
                hasReplies: 1,
                comments: 1,
                "userDetails.dpUrl": 1
            }
        }
    ])
    let isLogged = (req.session.currUser != undefined);
    const currUserObject = await userModel.findOne({ "username": req.session.currUser }).lean();
    if (isLogged) {
        resp.render('home', {
            layout: 'index',
            title: 'AskAway - Home',
            logged: isLogged,
            posts: postsWithDp,
            currUserObject: currUserObject,
        });
    } else {
        resp.render('home', {
            layout: 'index',
            title: 'AskAway - Home',
            logged: isLogged,
            posts: postsWithDp,
        });
    }

})

server.get('/profile-posts-:isLogged', async function (req, resp) {

    const postsCollection = await postModel.find({ 'user': "LuisDaBeast" }).lean();

    let isLogged = (req.params.isLogged === "logged");
    resp.render('profile-posts', {
        layout: 'index',
        title: 'AskAway - Profile',
        logged: isLogged,
        posts: postsCollection
    });
});

server.get('/users/:username/posts', async function(req, resp){
    let isLogged = (req.session.currUser != undefined);
    const currUserObject = await userModel.findOne({ "username": req.session.currUser }).lean();
    const viewedUserObject = await userModel.findOne({ "username": req.params.username }).lean();
    let allPosts = await postModel.find({"user": viewedUserObject.username}).lean();
    if (isLogged) {
        resp.render('user-posts', {
            layout: 'index',
            title: 'AskAway - Home',
            logged: isLogged,
            posts: allPosts,
            currUserObject: currUserObject,
            viewedUserObject: viewedUserObject
        });
    } else {
        resp.render('user-posts', {
            layout: 'index',
            title: 'AskAway - Home',
            logged: isLogged,
            posts: allPosts,
            viewedUserObject: viewedUserObject
        });
    }
})


server.get('/users/:username/comments', async function(req, resp){
    let isLogged = (req.session.currUser != undefined);

})

server.get('/profile-comments-:isLogged', async function (req, resp) {
    // const dbo = mongoClient.db(databaseName);
    // const postsCollection = await dbo.collection("posts").find().toArray();
    const postsCollection = await postModel.find({ 'user': "LuisDaBeast" }).lean();


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

server.get('/register', function (req, resp) {
    resp.render('register', {
        layout: 'index',
        title: 'AskAway - Register',
    })
})

server.get('/posts/:id', async function (req, resp) {
    const currUserObject = await userModel.findOne({ "username": req.session.currUser }).lean();
    let isLogged = (currUserObject != undefined);
    const thePost = await postModel.findById(req.params.id).lean();

    resp.render('post', {
        layout: 'index',
        title: 'View Post',
        logged: isLogged,
        thePost: thePost,
        currUserObject: currUserObject
    })
})


server.get('/about', async function (req, resp) {
    resp.render('about', {
        layout: 'index',
        title: 'About page',
    })
})

server.get('/search', async (req, res) => {
    // print(req.query) = {query: 'hello'}
    // print(req.query.query) = 'hello'
    const searchQuery = req.query.query.toLowerCase();


    const postsCollection = await postModel.find(
        { "$or": [ 
            { "title": { "$regex": searchQuery, "$options": "i" } }, 
            { "postContent": { "$regex": searchQuery, "$options": "i" } } 
        ] }).lean();
    
    // for (let i = 0; i < postsCollection.length; i++){
    //     console.log(postsCollection[i].user);
    // }

    let isLogged = (req.session.currUser != undefined);
    const currUserObject = await userModel.findOne({ "username": req.session.currUser }).lean();
    if (isLogged) {
        res.render('home', {
            layout: 'index',
            title: 'AskAway - Home',
            logged: isLogged,
            posts: postsCollection,
            currUserObject: currUserObject,
            searchQuery: searchQuery,
            
        
        });
    } else {
        res.render('home', {
            layout: 'index',
            title: 'AskAway - Home',
            logged: isLogged,
            posts: postsCollection,
            searchQuery: searchQuery,
            
        });
    }
    
    

    
})


// POST-POST-POST-POST-POST-POST-POST-POST-POST-POST-POST-POST-POST-POST-POST-POST-POST-POST-POST-POST-POST-POST-POST-POST-POST
server.post('/posts', async function (req, resp) {
    req.body.user = "LuisDaBeast";
    req.body.upCount = 0;
    req.body.downCount = 0;
    req.body.isEdited = false;
    req.body.dpUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBbQ3hl3GmlXklLXZQtNu5NNAbxYqVWz85ew&s";
    req.body.comments = [];

    const dbo = mongoClient.db(databaseName);
    dbo.collection("posts").insertOne(
        req.body,
        function (err, res) {
            if (err) console.log(err);

        }
    )
    resp.redirect("/home");
})


server.post('/login', async function (req, resp) {
    const inputtedUsername = req.body.username;
    const inputtedPassword = req.body.password;

    const match = await userModel.findOne({ username: inputtedUsername, password: inputtedPassword }).lean();

    if (!match) {
        return resp.render('login', {
            layout: 'index',
            title: 'AskAway - Login',
            error: true
        });
    } else {
        req.session.currUser = inputtedUsername;
        return resp.redirect('/home');
    }
})

server.post('/logout', function (req, resp) {
    req.session.destroy(function (err) {
        if (err) {
            console.error(err);
            return resp.status(500).send('Error logging out');
        }
        resp.redirect('/home');
    });
});


server.post('/register', async function (req, resp) {
    const username = req.body.username;
    const password = req.body.password;

    const user = {
        username: username,
        password: password
    }

    const isNew = await userModel.findOne({ "username": username }) == null;

    if (isNew) {
        try {
            let newUserInstance = await userModel(user);
            await newUserInstance.save();
            return resp.redirect('/home-logged');
        }
        catch (error) {
            resp.render('register', {
                layout: 'index',
                title: 'AskAway - Register',
                error: true,
                errorMessage: "Unexpected error occurred"
            });
        }
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

// UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE

server.put('/change-dp', async function (req, res) {
    
    const dpUrl = req.body.selectedDp;
    
    const currUserObject = await userModel.findOne({ "username": req.session.currUser }).lean();
    const currId = currUserObject._id.toString();

    await userModel.findOneAndUpdate( 
        { "_id": currId }, 
        { "$set": {"dpUrl": dpUrl} },
        {new: true}
    );
    
    res.json({ success: true, redirectUrl: `/users/${currUserObject.username}/posts` });
});

// DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE
server.delete('/post-:isLogged/:id', async function (req, res) {
    const dbo = mongoClient.db(databaseName);
    let oid = getOid(req.params.id);
    await dbo.collection("posts").deleteOne({ _id: oid });

    res.sendStatus(200);
});


// End ========================================================================================================================


function finalClose() {
    console.log('Close connection at the end!');
    mongoose.connection.close();
    process.exit();
}

process.on('SIGTERM', finalClose);
process.on('SIGINT', finalClose);
process.on('SIGQUIT', finalClose);

const port = 3000;
server.listen(port, function () {
    console.log('Listening at port ' + port);
});

function getOid(oid) {
    let tester = /[0-9A-Fa-f]{6}/g;

    if (tester.test(oid)) {
        return new ObjectId(oid + "");
    }

    return oid;
}

