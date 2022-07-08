const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const session = require('express-session');

// Connect to db
mongoose.connect(config.database);

// Connect message
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' +config.database);
});

//Error msg
mongoose.connection.on('error', () => {
    console.log('Database error: ' +err);
});

const app = express();
// Express middleware
app.use(session({ secret:'salestracker' }));

const users = require('./routes/users');

// PORT number
const port = 3000;

// CORS Middlware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

// Index Route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
});

// Start Server
app.listen(port, () => {
    console.log('Server started on port ' +port)
});