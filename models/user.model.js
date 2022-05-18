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

});

const User = model('User', userSchema);

module.exports = User;