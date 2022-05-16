// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config')(app);

// default value for title local
const projectName = 'food-hunters';
const capitalized = (string) =>
	string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with Food hunters`;

// 👇 Start handling routes here
const isLoggedIn = require('./middleware/isLoggedIn');

const authRoutes = require('./routes/auth-routes');
app.use('/auth', authRoutes);

const recipesRoutes = require('./routes/recipes-routes');
app.use('/', recipesRoutes);

//const privateRoutes = require('./auth');
//app.use('/private', isLoggedIn, privateRoutes);

const index = require('./routes/index');
app.use('/', index);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('../foodhunters/error-handeling')(app);

module.exports = app;