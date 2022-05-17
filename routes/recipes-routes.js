const User = require("./../models/user.model");
const Recipe = require("./../models/recipe.model");
const Comment = require("./../models/comments.model");
const express = require("express");
const router = express.Router();


const fileUploader = require("./../config/cloudinary");
const { db } = require("./../models/user.model");


// user profile

router.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let isOwner = false;
  if (id === req.session.currentUser._id) isOwner = true;

  User.findById(id)
  .then((user) => {
    res.render('user-profile/user-profile', {user, isOwner})
  });
})



router.get("/profile", (req, res) => {
    //const { id } = req.params;
    User.findById(req.session.currentUser._id)
    .then((findUser)=>{res.render('user-profile/user-profile', { user: findUser })
    
  })
  });
  



// Food preferences upon signing up

router.route("/foodpreferences")
.get((req, res) => {
  res.render("auth/foodpreferences");
})
.post((req, res) => {
  //console.log('REQUEST BODY BABY: ',req.body)
  //res.json(req.body)
  const checkboxArr = Object.keys(req.body);
  console.log(checkboxArr)

  User.findByIdAndUpdate(req.session.currentUser._id, {
   $push : {foodPreferences : checkboxArr}
  })
  .then((updatedUser) => res.redirect('/profile'))
  .catch(err => console.log(err));
})

// homepage

router.get("/homepage", (req, res) => {
  Recipe.find()
    .populate("title")
    .populate("owner")
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
  
  Recipe.findById(id)
  .populate("owner")
  .populate("comments")
  .populate({
    path: "comments",
    populate: {
      path: "owner",
    },
  })  
  .then((recipe) => {
      console.log("recipe", recipe)
      res.render("recipe/recipe-details", recipe);
    })
    .catch((error) => {
      console.log(error);
    });
})
.post((req, res) => {
	const recipeId = req.params.id;
	const { message } = req.body;

	Comment.create({
		owner: req.session.currentUser._id,
		message // comment: req.body.comment
	})
		.then((newComment) => {
			console.log(newComment);

			Recipe.findByIdAndUpdate(recipeId, {
				$push: { comments: newComment._id }
			})
				.then((updatedRecipe) => {
					console.log('UPDATES RECIPE', updatedRecipe);
					res.redirect(`/recipe-details/${recipeId}`);
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
    console.log("current user", req.session.currentUser)
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


  //edit recipe 
router
  .route("/edit-recipe/:id")
  .get((req, res) => {
    const { id } = req.params;

    Recipe.findById(id)
      .populate("category")
      .then((owner) => {
        Recipe.find().then((recipe) => {
          res.render(`/recipe-details/${recipe_id}`, {
            owner: owner,
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
      .then((recipe) => res.redirect(`/recipe-details/${recipe_id}`))
      .catch((err) => console.log(err));
  });

// search recipe by category
router.get("/search", (req, res) => {
  res.render("recipe/search");
});
router.get("/search-results", (req, res) => {
  console.log(req.query)
  res.render("/recipe/searchresutls");
});

// recipe delete
router
.route("/recipe-details/:id/delete")
.post((req, res) => {
  const { id } = req.params;

  Recipe.findByIdAndDelete(id)
    .then(() => res.redirect("/profile"))
    .catch((err)=> console.log(err));
});

//favourite recipes

router.get("/favourites", (req, res) => {
  User.findById(req.session.currentUser._id)
  .populate("recipesLiked")
  .then((user) => {
    const reversedLikes = user.recipesLiked.reverse();
   res.render("user-profile/liked-post", { user, reversedLikes });
  })
  .catch((error) => {
    console.log(error);
  });
});

router.post("/favourites/:id", (req, res) => {
  const {id} = req.params;
  Recipe.findByIdAndUpdate(id, {
    $push: { likes: req.session.currentUser._id }
  })
    .then((updatedRecipe) => {
      User.findByIdAndUpdate(req.session.currentUser._id, {
        $push: { recipesLiked: updatedRecipe._id }
      })
    .then(() => res.redirect(`/favourites`))
    })
    .catch((error) => {
      console.log(error);
    });
}) 


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

/*router.post("/foodPreferences", (req, res, next) => {
  Recipe.findById(req.params.id)
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
});*/


module.exports = router;
