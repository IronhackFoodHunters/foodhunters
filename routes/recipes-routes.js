const express = require('express');
const router = express.Router();

const User = require('./../models/user.model');
const Recipe = require('./../models/recipe.model');
const Comments = require('./../models/comments.model');

const fileUploader = require('./../config/cloudinary')

// user profile

router.get("/profile", (req, res) => {
    res.render("user-profile/user-profile")
});



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
    
        //Get the form data from the body
        const { title, instructions, category, likes, owner } = req.body;
    
        //Get the image url from uploading
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

/*
// search recipe by category
router.get("/search", (req, res) => {
    res.render("recipe/search")
})


//favourite recipes
/*
router.get("/favourites", (req, res) =>{
    res.render("private/liked-post")
});
*/

module.exports = router;