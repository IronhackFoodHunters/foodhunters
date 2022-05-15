const express = require('express');
const router = express.Router();

const User = require('./../models/user.model');
const Recipe = require('./../models/recipe.model');
const Comments = require('./../models/comments.model');

const fileUploader = require('./../config/cloudinary')

// Food preferences upon signing up

router
.route ("/food-preferences")
.get((req, res) => {
    res.render("auth/foodpreferences")
});


// user profile

router.get("/profile", (req, res) => {
    res.render("user-profile/user-profile")
});

// edit user profile
/*
router
.route("/profile/:id/edit")
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
*/

// homepage 

router.get("/homepage", (req, res) =>{
    Recipe.find()
		.populate('owner')
		.then((recipes) => {
			res.render("recipe/homepage", { recipes });
		})
		.catch((error) => {
			console.log(error);
		});
    
})

/*
// recipe details

router.get("/recipe-details/:id", (req, res) => {
    const { id } = req.params;
	
	Recipe.findById(id)
		.populate('owner')
		.populate({
			path: 'comments',
			populate: {
				path: 'user'
			}
		})
		.then((recipe) => {
			res.render("recipe/recipe-details", { recipe });
		})
		.catch((error) => {
			console.log(error);
		});
})
*/

// create recipe

router
.route("/create-recipe")
.get( (req, res) => {
    res.render("user-profile/private/create-recipe")})

.post(fileUploader.single('imageUrl'), (req, res) => {
        
        const userId = req.session.currentUser._id;
    
        const { title, instructions, category, likes, owner } = req.body;
    
        const imageUrl = req.file.path
    
        console.log(title, instructions, category, likes, owner, imageUrl);
    
        Recipe.create({
            title,
            ingredients,
            instructions,
            category,
            imageUrl,
            likes,
            owner: userId
        })
            .then((createdRecipe) => {
                console.log(createdRecipe);
                res.redirect('/recipe/recipe-details');
            })
            .catch((error) => {
                console.log(error);
            })
        
})


// search recipe by category
router.get("/search", (req, res) => {
    res.render("recipe/search")
})

/*
//favourite recipes

router.get("/favourites", (req, res) =>{
    res.render("user-profile/private/liked-post")
});
*/

module.exports = router;