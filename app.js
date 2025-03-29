// Express ========================================================================================================================
const express = require('express');
const server = express();

const bodyParser = require('body-parser')
server.use(express.json());
server.use(express.urlencoded({ extended: true }));


// Handlebars =====================================================================================================================
const handlebars = require('express-handlebars');

// Helpers
const hbs = handlebars.create({
    extname: 'hbs',
    helpers: {
        eq: function (a, b) {
            return a === b;
        },

        removeAt: function (username) {
            if (username.startsWith("@")) {
                return username.substring(1);
            }
            
            return username;
        },

        hasVoted: function (upVoteArray, currentUserId) {

            if (!Array.isArray(upVoteArray) || !currentUserId) {
                return false; // Default to false if missing data
            }
            return upVoteArray.some(id => id.toString() === currentUserId.toString())
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

// Hashing ======================================================================================================================
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
        upCount: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]  ,
        downCount:  [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
        dpUrl: { type: String }
    },
    { versionKey: false });

const commentSchema = new mongoose.Schema(
    {
        user: { type: String, required: true },
        isEdited: { type: Boolean, default: false },
        commentContent: { type: String, required: true },
        upCount: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]  ,
        downCount:  [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
        dpUrl: { type: String },
        hasReplies: { type: Boolean, default: false },
        replies: [replySchema]
    },
    { versionKey: false });

const postSchema = new mongoose.Schema(
    {
        user: { type: String, required: true },
        postContent: { type: String, required: true },
        upCount: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]  ,
        downCount:  [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
        isEdited: { type: Boolean, default: false },
        title: { type: String, required: true },
        dpUrl: { type: String },
        tag: { type: String },
        hasReplies: { type: Boolean, default: false },
        comments: [commentSchema]
       
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
    const postsCollection = (await postModel.find({}).lean()).reverse();
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

server.get('/users/:username/posts', async function(req, resp){
    let isLogged = (req.session.currUser != undefined);
    const currUserObject = await userModel.findOne({ "username": req.session.currUser }).lean();
    const viewedUserObject = await userModel.findOne({ "username": req.params.username }).lean();
    

    if (!viewedUserObject) {
        return resp.status(404).send("User not found"); 
    }
    

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
    const currUserObject = await userModel.findOne({ "username": req.session.currUser }).lean();
    const viewedUserObject = await userModel.findOne({ "username": req.params.username }).lean();

    let allComments = await postModel.find({
        $or: [
            { "comments.user": viewedUserObject.username },
            { "comments.replies.user": viewedUserObject.username }
        ]
    }).lean();

    
    if (isLogged) {
        resp.render('user-comments', {
            layout: 'index',
            title: 'AskAway - Home',
            logged: isLogged,
            posts: allComments,
            currUserObject: currUserObject,
            viewedUserObject: viewedUserObject
        });
    } else {
        resp.render('user-comments', {
            layout: 'index',
            title: 'AskAway - Home',
            logged: isLogged,
            posts: allComments,
            viewedUserObject: viewedUserObject
        });
    }

})

// will delete this


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
            { "postContent": { "$regex": searchQuery, "$options": "i" } },
            { "tag": { "$regex": searchQuery, "$options": "i" } } 
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

    try {
        const currUserObject = await userModel.findOne({ "username": req.session.currUser }).lean();
        
        if (!currUserObject) {
            return resp.status(400).send("User not found.");
        }

        await postModel.create({ 

            user: currUserObject.username,
            postContent: req.body.postContent,
            upCount: [],
            downCount: [],
            isEdited: false,
            title: req.body.title,
            dpUrl: currUserObject.dpUrl,
            tag: req.body.tag,
            hasReplies: false,
            comments: []
        
        });

        resp.redirect("/home");
        
    } catch (error) {
        console.error("Error creating post: ", error);
        resp.status(500).send("Unexpected error occured while creating the post. ")
    }
    
})


server.post('/login', async function (req, resp) {
    const inputtedUsername = req.body.username;
    const inputtedPassword = req.body.password;

    const user = await userModel.findOne({ username: inputtedUsername }).lean();

    if (!user) {
        return resp.render('login', {
            layout: 'index',
            title: 'AskAway - Login',
            error: true
        });
    }

    const isMatch = await bcrypt.compare(inputtedPassword, user.password);

    if (!isMatch) {
        return resp.render('login', {
            layout: 'index',
            title: 'AskAway - Login',
            error: true
        });
    }

    req.session.currUser = inputtedUsername;
    return resp.redirect('/home');
});

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
    const defaultDpUrl = "https://upload.wikimedia.org/wikipedia/en/c/cc/Wojak_cropped.jpg";

    
    const isNew = await userModel.findOne({ "username": username }) == null;
    
    if (isNew) {
        try {
            // let newUserInstance = await userModel(user);

            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = new userModel({
                username: username,
                password: hashedPassword,
                dpUrl: defaultDpUrl
            });

            await newUser.save();
            req.session.currUser = username;
            return resp.redirect('/home');
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

});

// UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE-UPDATE

server.put('/comments', async function (req, resp) {
    try {
        const currUserObject = await userModel.findOne({ "username" : req.session.currUser }).lean();
        let postId = req.body.postId;
        let commentContent = req.body.commentContent;

        let commentObject = {
            _id: new mongoose.Types.ObjectId(),
            user: currUserObject.username,
            isEdited: false,
            commentContent: commentContent,
            upCount: [],
            downCount: [],
            dpUrl: currUserObject.dpUrl,
            hasReplies: false,
            replies: []
        }

        if (!currUserObject) {
            return resp.status(400).send("User not found.");
        }

        let thePost = await postModel.findById(postId);
        
        if (!thePost) {
            return resp.status(400).send("Post not found.");
        }

        thePost.comments.push(commentObject);
        await thePost.save();
        resp.json({ success: true, message: "Succesfully commented", redirectUrl: `/posts/${postId}` });

    } catch (error) {
        console.error(error);
        resp.status(500).json({ success: false, message: "Internal server error" });
    }
})

server.put("/reply-replies", async function(req, res) {
    try {
        
        let postId = req.body.postId;
        
        let commentId = req.body.commentId;
    
        let replyingTo = req.body.replyingTo;
        let replyContent = req.body.newReply;

        let currUserObject = await userModel.findOne({ "username" : req.session.currUser }).lean();
        

        let replyObject = {
            _id: new mongoose.Types.ObjectId(),
            user: currUserObject.username,
            isEdited: false,
            repliedTo: replyingTo,
            replyContent: replyContent,
            upCount: [],
            downCount: [],
            dpUrl: currUserObject.dpUrl
        }

        let thePost = await postModel.findById(postId);
        if (!thePost) return res.status(404).json({ success: false, message: "Post not found" });if (!thePost) return res.status(404).json({ success: false, message: "Post not found" });

        // find the comment by commentid
        let theComment = thePost.comments.find(c => c._id.toString() === commentId);
        if (!theComment) return res.status(404).json({ success: false, message: "Comment not found" });if (!theComment) return res.status(404).json({ success: false, message: "Comment not found" });
        
        theComment.replies.push(replyObject);
        await thePost.save();

        res.json({ success: true, message: "Succesfully replied", redirectUrl: `/posts/${postId}` });
        
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})
server.put("/comment-replies", async function(req, res) {

    try {
        let postId = req.body.postId;
        let commentId = req.body.commentId;
        let replyingTo = req.body.replyingTo;
        let replyContent = req.body.newReply;

        let currUserObject = await userModel.findOne({ "username" : req.session.currUser }).lean();

        let replyObject = {
            _id: new mongoose.Types.ObjectId(),
            user: currUserObject.username,
            isEdited: false,
            repliedTo: replyingTo,
            replyContent: replyContent,
            upCount: [],
            downCount: [],
            dpUrl: currUserObject.dpUrl
        }

        let thePost = await postModel.findById(postId);
        if (!thePost) return res.status(404).json({ success: false, message: "Post not found" });if (!thePost) return res.status(404).json({ success: false, message: "Post not found" });

        // find the comment by commentid
        let theComment = thePost.comments.find(c => c._id.toString() === commentId);
        if (!theComment) return res.status(404).json({ success: false, message: "Comment not found" });if (!theComment) return res.status(404).json({ success: false, message: "Comment not found" });
        
        theComment.replies.push(replyObject);
        await thePost.save();

        res.json({ success: true, message: "Succesfully replied", redirectUrl: `/posts/${postId}` });
        
        await postModel.updateOne(
            {_id: postId, "comments._id": commentId },
            {$set: {"comments.$.hasReplies": true}}
        )
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
    

})

server.put('/upvote', async function (req, res) {
    try {
        
        let postId = req.body.postId;
    
        let currUserObject = await userModel.findOne({ "username": req.session.currUser });
        let currOid = getOid(currUserObject._id);

        let thePost = await postModel.findById(postId);

        // If upCount does not contain the userId yet
        if ( !thePost.upCount.some(id => id.equals(currOid)) ){

            // If user has downvoted originally, remove from downvotes and add to upvotes
            if ( thePost.downCount.some(id => id.equals(currOid)) ){
                thePost.downCount = thePost.downCount.filter(id => !id.equals(currOid)); 
                thePost.upCount.push(currOid);
            }

            // Otherwise, just normally add an upcount
            else {
                thePost.upCount.push(currOid);
            }
        }

        // If user has already upvoted, just remove the upvote
        else {
            thePost.upCount = thePost.upCount.filter(id => !id.equals(currOid));
        }

        await thePost.save();

        res.json({
            success: true,
            upCount: thePost.upCount,
            downCount: thePost.downCount,
            hasUpvoted: thePost.upCount.some(id => id.equals(currOid)),
            hasDownvoted: thePost.downCount.some(id => id.equals(currOid))
        });
        

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}) 


server.put('/downvote', async function (req, res) {
    try {
        
        let postId = req.body.postId;
        let currUserObject = await userModel.findOne({ "username": req.session.currUser });
        let currOid = getOid(currUserObject._id);

        let thePost = await postModel.findById(postId);

        // If downCount does not contain the userId yet
        if ( !thePost.downCount.some(id => id.equals(currOid)) ){
            
            // If user has upvoted originally, remove from upvotes and add in downvotes
            if ( thePost.upCount.some(id => id.equals(currOid)) ) {
                thePost.upCount = thePost.upCount.filter(id => !id.equals(currOid)); 
                thePost.downCount.push(currOid);
            }

            else {
                thePost.downCount.push(currOid);
            }
            
        }

        // if user has already downvoted, just remove the downvote upon click
        else {
            thePost.downCount = thePost.downCount.filter(id => !id.equals(currOid));
        }

        await thePost.save();
        res.json({
            success: true,
            upCount: thePost.upCount,
            downCount: thePost.downCount,
            hasUpvoted: thePost.upCount.some(id => id.equals(currOid)),
            hasDownvoted: thePost.downCount.some(id => id.equals(currOid))
        });
        

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}) 

server.put('/upvote-comment', async function (req, res) {
    try {
        
        let commentId = req.body.commentId;
        let currUserObject = await userModel.findOne({ "username": req.session.currUser });
        let currOid = getOid(currUserObject._id);
        
        let thePost = await postModel.findOne({
            "comments._id": getOid(commentId)
        });

        let theComment = thePost.comments.find(c => c._id.toString() === commentId);

        // If upCount does not contain the userId yet
        if ( !theComment.upCount.some(id => id.equals(currOid)) ){

            // If user has downvoted originally, remove from downvotes and add to upvotes
            if ( theComment.downCount.some(id => id.equals(currOid)) ){
                theComment.downCount = theComment.downCount.filter(id => !id.equals(currOid)); 
                theComment.upCount.push(currOid);
            }

            // Otherwise, just normally add an upcount
            else {
                theComment.upCount.push(currOid);
            }
        }
        // If user has already upvoted, just remove the upvote
        else {
            theComment.upCount = theComment.upCount.filter(id => !id.equals(currOid));
        }

        await thePost.save();
        
        res.json({
            success: true,
            upCount: theComment.upCount,
            downCount: theComment.downCount,
            hasUpvoted: theComment.upCount.some(id => id.equals(currOid)),
            hasDownvoted: theComment.downCount.some(id => id.equals(currOid))
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

server.put('/downvote-comment', async function (req, res) {
    try {
        
        let commentId = req.body.commentId;
        let currUserObject = await userModel.findOne({ "username": req.session.currUser });
        let currOid = getOid(currUserObject._id);
        
        let thePost = await postModel.findOne({
            "comments._id": getOid(commentId)
        });

        let theComment = thePost.comments.find(c => c._id.toString() === commentId);
        
        // If downCount does not contain the userId yet
        if ( !theComment.downCount.some(id => id.equals(currOid)) ){
            
            // If user has upvoted originally, remove from upvotes and add in downvotes
            if ( theComment.upCount.some(id => id.equals(currOid)) ) {
                theComment.upCount = theComment.upCount.filter(id => !id.equals(currOid)); 
                theComment.downCount.push(currOid);
            }

            else {
                theComment.downCount.push(currOid);
            }
            
        }

        // if user has already downvoted, just remove the downvote upon click
        else {
            theComment.downCount = theComment.downCount.filter(id => !id.equals(currOid));
        }

        await thePost.save();
        res.json({
            success: true,
            upCount: theComment.upCount,
            downCount: theComment.downCount,
            hasUpvoted: theComment.upCount.some(id => id.equals(currOid)),
            hasDownvoted: theComment.downCount.some(id => id.equals(currOid))
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})


server.put('/upvote-reply', async function (req, res) {
        let replyId = req.body.replyId;
        let currUserObject = await userModel.findOne({ "username": req.session.currUser });
        let currOid = getOid(currUserObject._id);
        
        
        let thePost = await postModel.findOne({
            "comments.replies._id": getOid(replyId)
        });

        let theComment = thePost.comments.find(comment => 
            comment.replies.some(reply => reply._id.toString() === replyId)
        ); // the comment that contains thereply

        let theReply = theComment.replies.find(reply => reply._id.toString() === replyId);

        // If upCount does not contain the userId yet
        if ( !theReply.upCount.some(id => id.equals(currOid)) ){

            // If user has downvoted originally, remove from downvotes and add to upvotes
            if ( theReply.downCount.some(id => id.equals(currOid)) ){
                theReply.downCount = theReply.downCount.filter(id => !id.equals(currOid)); 
                theReply.upCount.push(currOid);
            }

            // Otherwise, just normally add an upcount
            else {
                theReply.upCount.push(currOid);
            }
        }
        // If user has already upvoted, just remove the upvote
        else {
            theReply.upCount = theReply.upCount.filter(id => !id.equals(currOid));
        }

        await thePost.save();
        res.json({
            success: true,
            upCount: theReply.upCount,
            downCount: theReply.downCount,
            hasUpvoted: theReply.upCount.some(id => id.equals(currOid)),
            hasDownvoted: theReply.downCount.some(id => id.equals(currOid))
        });
})

server.put('/downvote-reply', async function (req, res) {
    let replyId = req.body.replyId;
        let currUserObject = await userModel.findOne({ "username": req.session.currUser });
        let currOid = getOid(currUserObject._id);
        
        
        let thePost = await postModel.findOne({
            "comments.replies._id": getOid(replyId)
        });

        let theComment = thePost.comments.find(comment => 
            comment.replies.some(reply => reply._id.toString() === replyId)
        ); // the comment that contains thereply

        let theReply = theComment.replies.find(reply => reply._id.toString() === replyId);

        // If downCount does not contain the userId yet
        if ( !theReply.downCount.some(id => id.equals(currOid)) ){
            
            // If user has upvoted originally, remove from upvotes and add in downvotes
            if ( theReply.upCount.some(id => id.equals(currOid)) ) {
                theReply.upCount = theReply.upCount.filter(id => !id.equals(currOid)); 
                theReply.downCount.push(currOid);
            }

            else {
                theReply.downCount.push(currOid);
            }
            
        }

        // if user has already downvoted, just remove the downvote upon click
        else {
            theReply.downCount = theReply.downCount.filter(id => !id.equals(currOid));
        }

        await thePost.save();
        res.json({
            success: true,
            upCount: theReply.upCount,
            downCount: theReply.downCount,
            hasUpvoted: theReply.upCount.some(id => id.equals(currOid)),
            hasDownvoted: theReply.downCount.some(id => id.equals(currOid))
        });
})

server.put('/change-bio', async function (req, res) {
    try {
        
        let newBio = req.body.newBio;
        const currUserObject = await userModel.findOne({ "username": req.session.currUser });
        const currUsername = currUserObject.username;
        await userModel.updateOne(
            { "username" :  currUsername },
            { "$set" : { "bio": newBio }}
        );
        // req.session.currUser = newBio;
        // await req.session.save();

        res.json({ success: true, message: "Bio succesfully changed!", redirectUrl: `/users/${currUserObject.username}/posts`});
    } catch (error) {
        
    }
})

server.put('/change-username', async function (req, res) {
    try {
        
        let newUsername = req.body.newUsername;
        
        const existingUser = await userModel.findOne({ username: newUsername });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username already taken" });
        }
        
        const currUserObject = await userModel.findOne({"username": req.session.currUser}).lean();
        let currUsername = currUserObject.username;
       
        await userModel.findOneAndUpdate(
            { "username" : currUsername },
            { "$set": {"username": newUsername} },
            {new: true}
        );

        await postModel.updateMany( 
            { "user": currUsername },
            { "$set": {"user": newUsername} }
        );

        await postModel.updateMany( 
            { "comments": {$exists: true}, "comments.user" : currUsername },
            { "$set" : { "comments.$[comUserElem].user": newUsername } },
            { arrayFilters: [{"comUserElem.user": currUsername}]}
        )

        await postModel.updateMany(
            { "comments.replies": {$exists: true}, "comments.replies.user" : currUsername},
            { "$set" : { "comments.$[].replies.$[repUserElem].user": newUsername } },
            { arrayFilters: [{"repUserElem.user": currUsername}]}
        )

        await postModel.updateMany(
            { "comments.replies": {$exists: true}, "comments.replies.repliedTo" : "@"+ currUsername},
            { "$set" : { "comments.$[].replies.$[repToUserElem].repliedTo": "@"+newUsername } },
            { arrayFilters: [{"repToUserElem.repliedTo": "@"+ currUsername}]}
        )

        req.session.currUser = newUsername;
        await req.session.save();
        res.json({ success: true, message: "Username succesfully changed!", redirectUrl: `/users/${newUsername}/posts` });
    
    } catch (error) {
        console.error("Error updating username:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
    
})

server.put('/change-reply', async function(req, res) {
    const postId = req.body.postId;
    const commentId = req.body.commentId;
    const replyId = req.body.replyId;
    const newReplyContent = req.body.newReply;

    try {

        await postModel.updateOne(
            {_id: postId, "comments._id": commentId },
            {
                $set: { 
                    "comments.$.replies.$[reply].replyContent": newReplyContent, 
                    "comments.$.replies.$[reply].isEdited": true 
                } 
            },
            { arrayFilters: [{ "reply._id": replyId }] }

        );

        res.json({ success: true, redirectUrl: "/posts/" + postId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update reply" });
    }
    
})

server.put('/change-comment', async function (req, res) {
    const postId = req.body.postId;
    const newComment = req.body.newComment;
    const commentId = req.body.commentId;


    try {

        await postModel.updateOne(
            {_id: postId, "comments._id": commentId },
            {$set: { "comments.$.commentContent": newComment, "comments.$.isEdited": true } }
        );

        res.json({ success: true, redirectUrl: "/posts/" + postId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update comment" });

    }

})

server.put('/change-post', async  function (req, res) {
    const postId = req.body.postId;
    const newTitle = req.body.newTitle;
    const newTag = req.body.newTag;
    const newContent = req.body.newContent;


    await postModel.findOneAndUpdate(
        { "_id": postId },
        { "$set": {
            "title": newTitle,
            "isEdited": true,
            "postContent": newContent,
            "tag": newTag}}
    )

    res.json({ success: true, redirectUrl: "/posts/" + postId });
})  

server.put('/change-dp', async function (req, res) {
    const newDpUrl = req.body.selectedDp;
    const currUserObject = await userModel.findOne({ "username": req.session.currUser }).lean();

    await userModel.findOneAndUpdate( 
        { "username": currUserObject.username }, 
        { "$set": {"dpUrl": newDpUrl} },
        {new: true}
    );

    await postModel.updateMany( 
        { "user": currUserObject.username }, 
        { "$set": {"dpUrl": newDpUrl} },
    );

    await postModel.updateMany(
        {"comments.user": currUserObject.username },
        { "$set": {"comments.$[commentElem].dpUrl": newDpUrl} },
        { arrayFilters: [{ "commentElem.user": currUserObject.username }] }
    );

    await postModel.updateMany(
        {"comments.replies.user": currUserObject.username },
        { "$set": {"comments.$[].replies.$[replyElem].dpUrl": newDpUrl} },
        { arrayFilters: [{ "replyElem.user": currUserObject.username }] }
    )

    res.json({ success: true, redirectUrl: `/users/${currUserObject.username}/posts` });
});

server.put('/delete-comment', async function(req, res) {
    try {
        let postId = req.body.postId;
        let commentId = req.body.commentId;

        await postModel.updateOne(
            { _id: postId }, 
            { $pull: { comments: { _id: commentId } } } 
        );

        res.json({success: true})

        // {_id: postId, "comments._id": commentId },
        //{$set: { "comments.$.commentContent": newComment, "comments.$.isEdited": true } }
    } catch (error) {
        console.log(error);
        resp.status(500).send("Unexpected error deleting comment. ")
    }
})

server.put('/delete-reply', async function(req, res) {
    try {
        let postId = req.body.postId;
        let commentId = req.body.commentId;
        let replyId = req.body.replyId;

        await postModel.updateOne(
            { _id: postId, "comments._id": commentId }, 
            { $pull: { "comments.$.replies": { _id: replyId } } } 
        );

        res.json({success: true})

    } catch (error) {
        console.log(error);
        resp.status(500).send("Unexpected error deleting reply. ")
    }
})

// DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE-DELETE
server.delete('/posts/:id', async function (req, res) {
    // const dbo = mongoClient.db(databaseName);

    try {

        let oid = getOid(req.params.id);
        await postModel.deleteOne( {_id: oid});
        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        resp.status(500).send("Unexpected error deleting post. ")
    }
    
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

function splitAtFirstSpace(str) {
    let index = str.indexOf(" ");
    if (index === -1) return [str, ""]; 
    return [str.substring(0, index), str.substring(index + 1)];
}

