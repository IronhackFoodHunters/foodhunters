const User = require("./../models/user.model");
const Recipe = require("./../models/recipe.model");
const Comment = require("./../models/comments.model");
const express = require("express");
const router = express.Router();


const fileUploader = require("./../config/cloudinary");
const { db } = require("./../models/user.model");


// user profile

router.get("/profile", (req, res) => {
    //const { id } = req.params;
    User.findById(req.session.currentUser._id)
    .then((findUser)=>{res.render('user-profile/user-profile', { user: findUser })
    
  })
     
  });
  


// Food preferences upon signing up

router.route("/food-preferences").get((req, res) => {
  res.render("auth/foodpreferences");
});

// homepage

router.get("/homepage", (req, res) => {
  Recipe.find()
    .populate("title")
    .then((recipes) => {
      const reversed = recipes.reverse();
      res.render("recipe/homepage", { reversed });
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
    .populate("comments")
    /*.populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })*/
    .then((recipe) => {
      res.render("recipe/recipe-details", recipe);
    })
    .catch((error) => {
      console.log(error);
    });
})
.post((req, res) => {
	const recipeId = req.params.id;
	const { comment } = req.body;

	Comment.create({
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

   let imageUrl = req.file.path;

    console.log(title, ingredients, instructions, category);

    Recipe.create({
      title,
      ingredients,
      instructions,
      category,
      imageUrl,
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

router
  .route("/edit-recipe/:id")
  .get((req, res) => {
    const { id } = req.params;

    Recipe.findById(id)
      .populate("foodPreferences")
      .then((user) => {
        Recipe.find().then((recipe) => {
          res.render("recipe/recipe-details", {
            user: user,
            recipes: { recipe },
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

  /* 
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
  */

// search recipe by category
router.get("/search", (req, res) => {
  res.render("recipe/search");
});
router.get("/search-results", (req, res) => {
  console.log(req.query)
  res.render("/recipe/searchresutls");
});
// recipe delete
router.post("/recipe-details/:id/delete", (req, res) => {
  const { id } = req.params;

  Recipe.findByIdAndRemove(id)
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

//favourite recipes

router.get("/favourites", (req, res) => {
  res.render("user-profile/private/liked-post");
});


//research results test - 13.15 TEST TEST TEST

router
  .route("/:id/edit")
  .get((req, res) => {
    const id = req.params.id;

    recipe.findById(id)
      .populate("recipe")
      .then((recipe) => {
        if (recipe.host._id != req.session.userId)
          res.redirect(`/recipe/${recipe._id}`);
        else res.render("recipes/recipe-edit", recipe);
      })
      .catch((error) => console.log(error));
  })
  .post((req, res) => {
    const { name} =
      req.body;
    const id = req.params.id;

    recipe.findByIdAndUpdate(id, {
      name
    })
      .then((recipe) => {
        res.redirect(`/recipe/${recipe._id}`);
      })
      .catch((error) => {
        res.render("recipes/recipe-edit");
      });
  });

router.post("/foodPreferences", (req, res, next) => {
  recipe.findById(req.params.id)
    .then((recipe) => {
      if (
        recipe.attendees.includes(req.session.userId) ||
        req.session.userId == recipe.host
      ) {
        res.redirect(`/recipes/${recipe._id}`);
      } else {
        recipe.findByIdAndUpdate(req.params.id, {
          $push: { attendees: req.session.userId },
        })
          .populate("foodPreferences")
          .then((recipe) => {
            User.findByIdAndUpdate(req.session.userId, {
              $push: { foodPreferences: req.params.id },
            }).then((user) => {
              res.redirect(`/foodPreferences`);
            });
          })
          .catch((error) => console.log(error));
      }
    })
    .catch((error) => console.log(error));
});


module.exports = router;
