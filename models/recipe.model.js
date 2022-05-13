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
		required: true,
		description: "needs to be at least one of the values and is required"
	},
	imageUrl: {
		type: String,
		default:
			'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=749&q=80'
	},
	likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	owner: { type: Schema.Types.ObjectId, ref: 'User' },

});

const Recipe = model('Recipe', recipeSchema);

module.exports = Recipe;