FOOD HUNTERS

Description

Search and collaborative database platform for recipes in which users can create their own recipes and share them with other users.

User Stories

Landing page - Users are invited to login or sign up to enjoy the world of cooking.

Sign up - some basic information is required so users can create a profile. Later on they can edit the profile to make it more personal, add a profile picture and some further information.

Homepage - Users will see the collection of recipes that other users have been posting.

Navigation - For all the different sections, users will be able to navigate to their own profile, to the search feature, go back to the home page and create their own recipes.

Display recipes - In the homepage, users will have a display of all of the recipes other users have posted. Users can click on the recipe’s image and access the recipe’s details, instructions and tips. Also they can access the profile of the user owner of the post and check out all the recipes the user has posted including their favorite ones.

Interaction - In the recipe’s details, users make comments referring to the recipe and they can like  it, this will save it to their profile as their favorite one.

Search and display - Users can use the categories for searching for recipes they are interested in cooking. A search display will show the results where users can check the details of the recipes by clicking on them

User profile - Users can have their own profiles, where they will display a short description of themselves, also they will be able to edit their own profile, visit their favorites and create and edit their own recipes. From the user profile, they will be able to delete the profile and also logout.

Create recipe - In this part, users can create their own recipe. They will be able to add the instructions, category, photos and videos.

Edit recipe - From their profiles users can access the details of the recipe and have the option to edit it or delete the recipe.

404 - As users, we want to be politely warned that this page does not exist and it was our fault to search for it. ⚠️

500 - As users, we want to be politely warned that the amazing team behind the project screwed it up and it's not our fault.​ 💔

Server Routes (back-end)

METHOD   |   ROUTE   |   DESCRIPTION               |   REQUEST-BODY   |
---------|-----------|-----------------------------|------------------|
AUTHORIZATION
GET      |/          |Main page route. Renders home index view. Presents buttons to login and signup. | 
GET      |/login |Renders login form view.| 
POST| /login | Sends Login form data to the server.|{email, password}|
GET | /signup | Renders signup form view/ Create user's profile| |
POST | /signup | Sends Sign Up info to the server and creates user in the DB. | { username, email, password, [foodpreferences], [img]} |
GET | /foodpreferences | Requests the list of food preferences that each user has in termn  of recipes they might be interested
POST | /foodpreferences | Updates the food preferences of the user logged in in the data base |
GET	| /logout | Logges user out 
FEED
GET	|/homepage |	Renders all the recipe pictures uploaded by users. Including the user owner of the recipe and the likes buttons| |
GET	| /recipe-details/:id |	Renders the recipe details on the page. Here the user owner of the recipe can edit and also the comments section | { title, ingresdients, instructions, [category], [img]} |
POST | /recipe-details/:id | If the recipe is liked, or edited or comments are added this will be sent to the data base| |
GET	| /search |	Renders the view to search per category | |
GET |	/search-results | Renders the results of the search | |
USER PROFILE
GET	| /userprofile/:id | Renders the recipes posted/edit profile btn/ User's likes btn/recipe's details/createrecipe btn	|	{username, [img], description, [foodprefences]}
{title, [img/videos]} |
GET	| /profile/edit| Private route. Renders edit-profile form view. | {username, [img], description, [foodprefences]}, {title, [img/videos]|
POST | /profile/edit | Sends the changes made to the profile to the server and updates the DB | { email, password, [firstName], [lastName], [imageUrl] }
GET	| /favourites | Renders the recipes the user liked| |
POST | /favourites/:id | Updates the recipe in the data base adding the like of the user who made it and send the like recipe to the user profle favourites section| |
GET | /private/create-recipe | Renders the option to create a from view | |
POST | /private/create-recipe | Sends the new recipe to the server and it's created in the database | {Title, instructions, images, (videos), category}
GET | /edit-recipe/:id /Request from the server the form to edit an existing recipe. Only the owner of the recipe has access to this option
POST | /edit-recipe/:id | Updates the recipe in the data base with whatever changes the users make to their own recipes |
GET | /recipe-details/:id/delete | The user owner can delete a recipe they have created | |


MODELS

USER MODEL
````` javascript
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
    description: { 
        type: String,
        maxlength: 280,
    },
    imageUrl: {
		type: String,
		default:
			'https://easterntradelinks.com/front/images/default.png'
	},
	foodPreferences:{
		type: [String],
		enum: [ "omnivorous", "vegetarian", "vegan", "no carbs", "gluten free", "pescatarian", "sweets", 
		"drinks", "mediterranean", "asian", "african", "latinoamerican", null ],
		description: "needs to be at least one of the values and is required",
		required: true
	 },
    
	 recipesMade : [{type: Schema.Types.ObjectId, ref: 'Recipe'}],

    recipesLiked : [{type: Schema.Types.ObjectId, ref: 'Recipe'}]


`````

RECIPE MODEL

````` javascript
	title: {
		type: String,
		required: true,
	},

	ingredients: { 
		type: String,
		required: true
	},

	instructions: {
		type: String,
		required: true
	},
	category: [{
		type: String,
		enum: ["omnivorous", "vegetarian", "vegan", "no carbs", "gluten free", "pescatarian", "sweets",
			"drinks", "mediterranean", "asian", "african", "latinoamerican", null],
		//required: true,
		description: "needs to be at least one of the values and is required"
	}],
	imageUrl: {
		type: String,
		default:
			'https://easterntradelinks.com/front/images/default.png'
	},
	comments: [{type: Schema.Types.ObjectId, ref: 'Comment', default: []}],
	likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	owner: { type: Schema.Types.ObjectId, ref: 'User' },


`````
COMMENTS MODEL

````` javascript
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	message: { type: String, required: true, maxlength: 280 }

`````

For more information don't hesitate and visit our awesome presentation:

https://docs.google.com/presentation/d/1vpxiEZyIrjRlL_643H9PKdsojkwSHB0eBZ6PTIXN4wI/edit?usp=sharing

Let the hunt begin and Bon Appetite!!

