const { Schema, model } = require('mongoose');

const userSchema = new Schema({
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
			'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=749&q=80'
	},
	foodPreferences:{
		type: [String],
		enum: [ "omnivorous", "vegetarian", "vegan", "no carbs", "gluten free", "pescatarian", "sweets", 
		"drinks", "mediterranean", "asian", "african", "latinomerican", null ],
		description: "needs to be at least one of the values and is required",
		required: true
	 },
    
	 recipesMade : [{type: Schema.Types.ObjectId, ref: 'Recipe'}],

    recipesLiked : [{type: Schema.Types.ObjectId, ref: 'Recipe'}]

});

const User = model('User', userSchema);

module.exports = User;