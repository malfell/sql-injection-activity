// initial code to create the server
const http = require('http'),
path = require('path'),
express = require('express'),
bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// sqlite database for our log-in information
const db = new sqlite3.Database(':memory:');
db.serialize(function () {
    db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
    db.run("INSERT INTO user VALUES ('User', 'User1', 'Admin')");
    db.run("INSERT INTO user VALUES ('mod', 'modpass', 'Mod')");
});

// GET method route to send HTML file to the browser
app.get('/', function (req, res) {
    res.sendFile('index.html')
})

// Express POST route to /login to handle any forms submitted
app.post('/login', function (req, res) {
    // get username and password variables from req.body of POST request
    var username = req.body.username;
    var password = req.body.password;
    // SQL query to check validity 
    // REMEMBER!! SQL syntax should NEVER be written this way in practice!! 
    var query = "SELECT title FROM user WHERE username = '" + username + "' and password = '" + password + "'";

    // console.log to see SQL injection at work!
    console.log("username: " + username);
    console.log("password: " + password);
    console.log("query: " + query);

    // sqlite method to verify our log in and handle errors in event of invalid log in
    db.get(query, function (err, row) {
        if (err) {
            console.log('ERROR', err);
            res.redirect("/index.html#error");
        } else if (!row) {
            res.redirect("/index.html#unauthorized");
        } else {
            res.send(`Hello <b>` + row.title + `!</b><br />
            This file contains all your secret data: <br /><br />
            SECRETS!!! <br /><br />
            MORE SECRETS!!!! WHOA, SO SECRETY!! <br/><br/>
            <a href="/index.html">Go back to login</a>`);
        }
    });
});

app.listen(3000);