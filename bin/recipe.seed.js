
const mongoose = require("mongoose");
const Recipe = require("../models/recipe.model");
require("../db/index");

const recipes = [
  {title: "Pecan Pie", 
ingredients: `Pie Crust (Short Crust Pastry):
1 1/4 cups (175 grams) all-purpose flour
1/2 teaspoon salt
1 tablespoon (14 grams) granulated white sugar
1/2 cup (113 grams) unsalted butter, chilled, and cut into 1 inch (2.5 cm) pieces
1/8 to 1/4 cup (30 - 60 ml) ice water
Pecan Filling:
1 cup (210 grams) dark brown sugar
2/3 cup (160 ml) Lyle's Golden Syrup (or dark corn syrup)
1 tablespoon rum or bourbon
4 tablespoons (56 grams) unsalted butter
3 large eggs
1/4 cup (60 ml) cream
1/4 teaspoon salt
1 1/2 - 2 cups (150 - 200 grams) pecans, toasted and coarsely chopped`,
  instructions: `Pie Crust: In a food processor, place the flour, salt, and sugar and process until combined.
  Add the butter and process until the mixture resembles coarse meal (about 15 seconds).
  Pour 1/8 cup (30 ml) water in a slow, steady stream, through the feed tube until the dough just holds together when pinched.
  If necessary, add more water. Do not process more than 30 seconds. Turn the dough onto your work surface and gather into a ball.
  Flatten into a disk, cover with plastic wrap, and refrigerate for 30 minutes to one hour before using. This will chill the butter and relax the gluten in the flour.
  After the dough has chilled sufficiently, place on a lightly floured surface, and roll into a 13 inch (33 cm) circle.
  (To prevent the pastry from sticking to the counter and to ensure uniform thickness, keep lifting up and turning the pastry a quarter turn as you roll (always roll from the center of the pastry outwards).)
  Fold the dough in half and gently transfer to a 9 inch (23 cm) pie pan. Brush off any excess flour and tuck the overhanging pastry under itself.
  Use a fork to make a decorative border or else crimp the edges using your fingers. Refrigerate the pastry, covered with plastic wrap, for about 30 minutes before pouring in the filling.
  Preheat oven to 350 degrees F (180 degrees C). Place the oven rack in the bottom third of the oven.`,
  category:["sweets"], 
  imageUrl:"",
  likes:[],
owner:
},
];

Recipe.deleteMany()
.then(() =>{

    Recipe.create(recipes)
    .then((recipesObj) => {
        console.log(`${recipesObj.length} recipes have been added to the database`)
        mongoose.connection.close()
    })
})
.catch((err) => console.log("Opps there was an error: ", err))

