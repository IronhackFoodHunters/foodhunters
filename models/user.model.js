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
        required: true,
        maxlength: 280,
    },
    imageUrl: {
		type: String,
		default:
			'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=749&q=80'
	},
	foodPreferences:{
		enum: [ "omnivorous", "vegetarian", "vegan", "no carbs", "gluten free", "pescatarian", "sweets", 
		"drinks", "mediterranean", "asian", "african", "latinomerican" null ],
		required: true,
		description: "needs to be at least one of the values and is required"
	 },
    
	 recipesMade : [{Type: Schema.Types.ObjectId, ref: 'Recipe'}],

    recipesLiked : [{Type: Schema.Types.ObjectId, ref: 'Recipe'}]

});

const User = model('User', userSchema);

module.exports = User;