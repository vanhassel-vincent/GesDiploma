const Web3 = require('web3');
const contract = require('truffle-contract');
const express = require('express');
const path = require('path');
const GescontractJSON = require(path.join(__dirname, '../build/contracts/Gescontract.json'));
const bodyParser = require('body-parser');
const jsSHA = require('jsSHA');

const address = '0x89bfb188784f7cee02d86dfe3dba47fded4df340';
const provider = new Web3.providers.HttpProvider('http://localhost:9545');

var flash = require('connect-flash');

const Gescontract = contract(GescontractJSON);
Gescontract.setProvider(provider);

const hostname = 'localhost';
const port = 3000;
const app = express();

let passport = require('passport'),
    Strategy = require('passport-local').Strategy;

let secret = 'eeeek';

let user = {
    username: 'admin',
    id: 0,
    password: 'admin'
};


app.use(require('express-session')({
    name: 'site_cookie',
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 150000
    }
}));

passport.use(new Strategy({
    usernameField: 'user',
    passwordField: 'pass',
    passReqToCallback : true
},
    function (req, username, password, cb) {
        if (username === user.username && password.toString() === user.password) {
            return cb(null, user);
        }
        return cb(null, false, req.flash('loginMessage', 'Invalid user or password'));
    })
);

passport.serializeUser((user, cb)=> { cb(null, user.id); });
passport.deserializeUser((id, cb) =>{ cb(null, user); });

app.set('views', __dirname + '/front');
app.set('view engine', 'ejs');
app.use(express.static('front'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//ensure a user is authenticated
const ensureAuthenticated = (req, res, next) =>{
    req.isAuthenticated() ? next()
    : res.redirect('/login')
}

//get command
app
    .get('/', (req, res) => { res.render('index'); })

    .get('/logout', (req, res) => { req.logout(); res.redirect('/'); })

    .get('/admin', ensureAuthenticated, function (req, res) {
        res.render('admin', {
            user: req.user
        });
    })
    .get('/login', (req, res) => {
        res.render('login', {message: req.flash('loginMessage')});
    });

//Post command
app
    .post('/login',
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true
        }),
        function (req, res) {
            res.redirect('/admin');
        }
    )
    .post('/create', async (req, res) => {
        let status = [];
        const data = req.body.data;
        for (let x = 0; x < data.length; x++) {
            let actual = data[x];
            let str = actual.replace(/\","/g, '');
            str = str.replace(/\,/g, '');
            str = str.toLowerCase();
            hash = getHash(str);
            let response = await newCertified(hash, address);
            status.push(response);
        }
        console.log(status);
        res.send(status);
    })
    
    .post('/verify', async (req, res) => {
        const person = req.body.person;
        const hash = getHash(person);
        const response = await isCertified(hash);
        console.log(response);
        res.send(response);
    });

// BC functions 

const newCertified = (hash, address) => {
    return Gescontract.deployed().then((instance) => instance.newCertified.sendTransaction(hash, { from: address }));
}

const isCertified = (targetHash, address) => {
    return Gescontract.deployed()
        .then((instance) => instance.isCertified.call(targetHash, { from: address }))
        .then(result => ({ [targetHash]: result }));
}

const getHash = (data) => {
    const shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(data);
    return shaObj.getHash("HEX");
}

//server listen 
app.listen(port, hostname, () => {
    console.log('server running on port: ' + port);
    console.log('');
});
