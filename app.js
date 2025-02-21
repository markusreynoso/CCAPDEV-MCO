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

server.get('/', function(req, resp){
    resp.render('home', {
        layout: 'index',
        title: 'AskAway - Home',
        logged: false
    })
})

server.get('/home-logged', function(req, resp){
    resp.render('home', {
        layout: 'index',
        title: 'AskAway - Home',
        logged: true
    })
})

server.get('/login', function(req, resp){
    resp.render('login', {
        layout: 'index',
        title: 'AskAway - Login',
    })
})

const port = 3000;
server.listen(port, function () {
    console.log('Listening at port ' + port);
});

