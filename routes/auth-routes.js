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

const isLoggedIn = require("../middleware/isLoggedIn");
const isNotLoggedIn = require("../middleware/isNotLoggedin");

const fileUploader = require("../config/cloudinary");


// Sign up
router
  .route("/signup")
  .get(isNotLoggedIn, (req, res) => res.render("auth/signup"))
  // POST route ==> to process form data
  .post(isNotLoggedIn,(req, res, next) => {
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
		req.session.currentUser = userFromDB;
        res.redirect("/foodpreferences");
      })
      .catch((err) => res.render("auth/signup", { errorMessage: err.message }))
      .catch((error) => next(error));
  });

  //user login
router
  .route("/login")
  .get(isNotLoggedIn, (req, res) => res.render("auth/login", { section: "user" }))
  .post(isNotLoggedIn,(req, res) => {
    const { username, email, password } = req.body;
	//res.render('login');

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

            res.redirect("/homepage"); // redirect to wherever you want
            return;
          } else {
            res.render("auth/login", { errorMessage: "Wrong credentials" });
          }
        }
      })
      .catch((err) => console.log(err));
  });

//logout from user profile
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.render("error", { message: "Something went wrong! Yikes!" });
    } else {
      res.redirect("/");
    }
  });
});



// Edit profile

router
.route("/profile/edit")
.get((req, res) => {

    User.findById(req.session.currentUser._id)
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
.post(fileUploader.single("imageUrl"),(req, res) => {
	const id = req.session.currentUser._id;
	const { username, email, password,  description,foodPreferences,recipesMade } = req.body;
	let imageUrl = undefined
	if(req.file) imageUrl = req.file.path

	User.findByIdAndUpdate(id, { username, email, password,  description,
		imageUrl,foodPreferences,recipesMade  })
	.then(() => res.redirect('/profile'))
	.catch((err) => console.log(err))
})


module.exports = router;

