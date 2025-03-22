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
    bio: { type: String },
    dpUrl: { type: String }
})

const commentSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        dpUrl: { type: String },
        isEdited: { type: Boolean, default: false },
        commentContent: { type: String, required: true },
        upCount: { type: Number, required: true },
        downCount: { type: Number, required: true },
        parentPostId: { type: String, required: true },
        parentCommentId: { type: String, required: false },
        repliedTo: { type: String }
    },
    { versionKey: false });

const postSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        postContent: { type: String, required: true },
        isEdited: { type: Boolean, default: false },
        title: { type: String, required: true },
        dpUrl: { type: String },
        tag: { type: String },
        upCount: { type: Number, required: true },
        downCount: { type: Number, required: true },
    },
    { versionKey: false });


const votesSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        targetId: { type: String, required: true },
        targetType: { type: String },
        voteType: { type: Number, required: true }
    },
    { versionKey: false }
)

const postModel = mongoose.model('post', postSchema);
const userModel = mongoose.model('user', userSchema);
const voteModel = mongoose.model('vote', votesSchema);
const commentModel = mongoose.model('comment', commentSchema);


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
    let isLogged = (req.session.currUser != undefined);
    const currUserObject = await userModel.findOne({ "username": req.session.currUser }).lean();
    if (isLogged) {
        resp.render('home', {
            layout: 'index',
            title: 'AskAway - Home',
            logged: isLogged,
            posts: postsCollection,
            currUserObject: currUserObject,
        });
    } else {
        resp.render('home', {
            layout: 'index',
            title: 'AskAway - Home',
            logged: isLogged,
            posts: postsCollection,
        });
    }

})

server.get('/users/:username/posts', async function (req, resp) {
    let isLogged = (req.session.currUser != undefined);
    const currUserObject = await userModel.findOne({ "username": req.session.currUser }).lean();
    const viewedUserObject = await userModel.findOne({ "username": req.params.username }).lean();
    let allPosts = await postModel.find({ "username": viewedUserObject.username }).lean();
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


server.get('/users/:username/comments', async function (req, resp) {
    let isLogged = (req.session.currUser != undefined);

})

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

    let topLevelComments = await commentModel.find({ "parentPostId": req.params.id, "parentCommentId": { $eq: null } }).lean();
    let replies = await commentModel.find({ "parentPostId": req.params.id, "parentCommentId": { $ne: null } }).lean();
    console.log(topLevelComments);
    for (commentObject of topLevelComments) {
        const voteByCurrUser = await voteModel.findOne({ "targetId": commentObject._id.toString() }).lean();
        if (voteByCurrUser != null) {
            commentObject.voteType = voteByCurrUser;
        }
    }

    for (replyObject of replies) {
        const voteByCurrUser = await voteModel.findOne({ "targetId": replyObject._id.toString() }).lean();
        if (voteByCurrUser != null) {
            replyObject.voteType = voteByCurrUser;
        }
    }

    for (commentObject of topLevelComments) {
        let repliesArray = replies.filter(reply => reply.parentCommentId == commentObject._id.toString());
        commentObject.replies = repliesArray;
    }



    resp.render('post', {
        layout: 'index',
        title: 'View Post',
        logged: isLogged,
        thePost: thePost,
        currUserObject: currUserObject,
        comments: topLevelComments
    })
})


server.get('/about', async function (req, resp) {
    resp.render('about', {
        layout: 'index',
        title: 'About page',
    })
})

server.get('/search', async (req, res) => {
    const searchQuery = req.query.query.toLowerCase();


    const postsCollection = await postModel.find(
        {
            "$or": [
                { "title": { "$regex": searchQuery, "$options": "i" } },
                { "postContent": { "$regex": searchQuery, "$options": "i" } },
                { "tag": { "$regex": searchQuery, "$options": "i" } }
            ]
        }).lean();

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
    const newDpUrl = req.body.selectedDp;
    const currUserObject = await userModel.findOne({ "username": req.session.currUser }).lean();

    await userModel.findOneAndUpdate(
        { "username": currUserObject.username },
        { "$set": { "dpUrl": newDpUrl } },
        { new: true }
    );


    await postModel.updateMany(
        { "user": currUserObject.username },
        { "$set": { "dpUrl": newDpUrl } },
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

