const { Schema, model } = require('mongoose');

const recipeSchema = new Schema({
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
	category: {
		type: String,
		enum: ["omnivorous", "vegetarian", "vegan", "no carbs", "gluten free", "pescatarian", "sweets",
			"drinks", "mediterranean", "asian", "african", "latinomerican", null],
		//required: true,
		description: "needs to be at least one of the values and is required"
	},
	imageUrl: {
		type: String,
		default:
			'https://easterntradelinks.com/front/images/default.png'
	},
	comments: [{type: Schema.Types.ObjectId, ref: 'Comment', default: []}],
	likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	owner: { type: Schema.Types.ObjectId, ref: 'User' },

});

const Recipe = model('Recipe', recipeSchema);

module.exports = Recipe;