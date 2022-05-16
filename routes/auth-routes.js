// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();

const bcrypt = require("bcrypt");
const saltRounds = 5;

const User = require("../models/user.model");
const Comments = require("./../models/comments.model");
//const likedPost = require('..auth/liked-post') (bjork tried to add this)


const Recipe = require('../models/recipe.model');
const res = require("express/lib/response");
const { estimatedDocumentCount } = require("../models/user.model");
const { route } = require("./recipes-routes");


// Sign up
router
  .route("/signup")
  .get((req, res) => res.render("auth/signup"))
  // POST route ==> to process form data
  .post((req, res, next) => {
    // console.log("The form data: ", req.body);

    const { username, email, password /*foodPreferences*/ } = req.body;

    bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({
          // username: username
          username,
          password: hashedPassword,
          email,
          /*foodPreferences*/
        });
      })
      .then((userFromDB) => {
        // console.log("Newly created user is: ", userFromDB);
        res.redirect("/food-preferences");
      })
      .catch((err) => res.render("auth/signup", { errorMessage: err.message }))
      .catch((error) => next(error));
  });

  //user login
router
  .route("/login")
  .get((req, res) => res.render("auth/login"))
  .post((req, res) => {
    const { username, email, password } = req.body;

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          res.render("auth/login", { errorMessage: "Wrong credentials!" });
          return;
        } else {
          const encryptedPassword = user.password;
          const passwordCorrect = bcrypt.compareSync(
            password,
            encryptedPassword
          );

          if (passwordCorrect) {
            req.session.currentUser = user;

            res.redirect("/profile"); // redirect to wherever you want
            return;
          } else {
            res.render("/auth/login", { errorMessage: "Wrong credentials" });
          }
        }
      })
      .catch((err) => console.log(err));
  });

//logout from user profile
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.render("error", { message: "Something went wrong! Yikes!" });
    } else {
      res.redirect("/");
    }
  });
});

/*
router
.route("/auth/liked-post")
.get((req, res) => {
	res.render("auth/lliked-post")
})*/

// Edit profile

router
.route("/profile/edit")
.get((req, res) => {
    const { id } = req.params;

    User.findById(id)
    .populate("foodPreferences")
    .then((user) =>{
    Recipe.find()
    .then((recipes) => {
        res.render("user-profile/private/edit-profile", {
            user: user,
            recipes: {recipes}
        })
    })
})
})
.post((req, res) => {
const { id } = req.params;
const { username, email, password,  description,
    imageUrl,foodPreferences,recipesMade } = req.body;

User.findByIdAndUpdate(id, { username, email, password,  description,
    imageUrl,foodPreferences,recipesMade  })
.then(() => res.redirect(`/profile`))
.catch((err) => console.log(err))
})


module.exports = router;

/*//1 import packages and User model
const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = process.env.SALT || 10;

const User = require('./../models/User.model');

const isNotLoggedIn = require('./../middleware/isNotLoggedIn')

//2 - Create 5 routes: 2 for login, 2 for signup and 1 for logout
router.get('/signup', isNotLoggedIn, (req, res) => {
	res.render('auth/signup');
});

router.post('/signup', isNotLoggedIn, (req, res) => {
	
	//GET VALUES FROM FORM
	const { username, email, password } = req.body;

	//VALIDATE INPUT
	if (
		!username ||
		username === '' ||
		!password ||
		password === '' ||
		!email ||
		email === '' ||
		!email.includes('@')
	) {
		res.render('auth/signup', { errorMessage: 'Something went wrong' });
	}

	//Check if user already exists
	User.findOne({ username: username })
		.then((user) => {
			
			//If user exists, send error
			if (user) {
				res.render('auth/signup', { errorMessage: 'This user already exists' });
				return;
			
			} else {
			
				//Hash the password
				const salt = bcrypt.genSaltSync(saltRounds);
				const hash = bcrypt.hashSync(password, salt);

				//If user does not exist, create it
				User.create({ username, email, password: hash })
					.then((newUser) => {

						console.log(newUser);
						//Once created, redirect
						res.redirect('/auth/login');
					})
					.catch((err) => console.log(err));
			}
		})
		.catch((err) => console.log(err));
});

router.get('/login', isNotLoggedIn, (req, res) => {
	res.render('auth/login');
});

router.post('/login', isNotLoggedIn, (req, res) => {
	//GET VALUES FROM FORM
	const { username, email, password } = req.body;

	//VALIDATE INPUT
	if (
		!username ||
		username === '' ||
		!password ||
		password === '' ||
		!email ||
		email === '' ||
		!email.includes('@')
	) {
		res.render('auth/signup', { errorMessage: 'Something went wrong' });
	}

	User.findOne({ username })
		.then((user) => {
			if (!user) {
				res.render('auth/login', { errorMessage: 'Input invalid' });
			} else {
				
				const encryptedPassword = user.password;
				const passwordCorrect = bcrypt.compareSync(password, encryptedPassword);

				if (passwordCorrect) {
					req.session.currentUser = user;
					res.redirect('/private/profile');
				} else {
					res.render('auth/login', { errorMessage: 'Input invalid' });
				}
			}
		})
		.catch((err) => console.log(err));
});

router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			res.render('error', { message: 'Something went wrong! Yikes!' });
		} else {
			res.redirect('/');
		}
	});
});

module.exports = router;*/
