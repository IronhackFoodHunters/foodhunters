const express = require("express");
const router = express.Router();

const User = require("./../models/user.model");
const Recipe = require("./../models/recipe.model");
const Comments = require("./../models/comments.model");

const fileUploader = require("./../config/cloudinary");


// user profile

router.get("/profile", (req, res) => {
    //const { id } = req.params;
     res.render('user-profile/user-profile', { user: req.session.currentUser })
  });
  


// Food preferences upon signing up

router.route("/food-preferences").get((req, res) => {
  res.render("auth/foodpreferences");
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

router.get("/homepage", (req, res) => {
  Recipe.find()
    .populate("owner")
    .then((recipes) => {
      res.render("recipe/homepage", { recipes });
    })
    .catch((error) => {
      console.log(error);
    });
});

// recipe details

router
.route("/recipe-details/:id")
.get((req, res) => {
  const { id } = req.params;
  //res.send(id);

  Recipe.findById(id)
    .populate("owner")
    /*.populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })*/
    .populate('comments')
    .then((recipe) => {
      res.render("recipe/recipe-details", { recipe });
    })
    .catch((error) => {
      console.log(error);
    });
})
.post((req, res) => {
	//GET the values
	const recipeId = req.params.id;
	const { comment } = req.body;

	Comments.create({
		user: req.session.currentUser._id,
		comment // comment: req.body.comment
	})
		.then((newComment) => {
			console.log(newComment);

			Recipe.findByIdAndUpdate(recipeId, {
				$addToSet: { comments: newComment._id }
			})
				.then((updatedRecipe) => {
					console.log(updatedRecipe);
					res.redirect(`/homepage/${recipeId}`);
				})
				.catch((error) => {
					console.log(error);
				});
		})
		.catch((error) => {
			console.log(error);
		});
});


// create recipe
router
  .route("/private/create-recipe")
  .get((req, res) => {
    res.render("user-profile/private/create-recipe");
  })
  .post(fileUploader.single("imageUrl"), (req, res) => {
    const userId = req.session.currentUser._id;
    
    const { title, ingredients, instructions, category} = req.body;

   //let imageUrl = req.file.path;

    console.log(title, ingredients, instructions, category);

    Recipe.create({
      title,
      ingredients,
      instructions,
      category,
      //imageUrl,
      //likes,
      owner: userId,
    })
      .then((createdRecipe) => {
        console.log('CREATED RECIPE: ',createdRecipe);
        res.redirect(`/recipe-details/${createdRecipe._id}`);
      })
      .catch((error) => {
        console.log(error);
      });
  });

// edit recipe
router.get("/edit-recipe/:id", (req, res) => {
  const { id } = req.params;
  res.send(id);
  res.render("user-profile/private/edit-recipe");
});

router
  .route("/edit-recipe/:id")
  .get((req, res) => {
    const { id } = req.params;

    User.findById(id)
      .populate("foodPreferences")
      .then((user) => {
        Recipe.find().then((recipes) => {
          res.render("recipe/recipe-details", {
            user: user,
            recipes: { recipes },
          });
        });
      });
  })
  .post((req, res) => {
    const { id } = req.params;
    const {
      title,
      ingredients,
      instructions,
      category,
      imageUrl,
      likes,
      owner: userId,
    } = req.body;

    Recipe.findByIdAndUpdate(id, {
      title,
      ingredients,
      instructions,
      category,
      imageUrl,
      likes,
      owner: userId,
    })
      .then(() => res.redirect(`/recipe-details`))
      .catch((err) => console.log(err));
  });

// search recipe by category
router.get("/search", (req, res) => {
  res.render("recipe/search");
});

//favourite recipes

router.get("/favourites", (req, res) => {
  res.render("user-profile/private/liked-post");
});

module.exports = router;
