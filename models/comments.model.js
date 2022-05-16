const { Schema, model } = require('mongoose');

const commentsSchema = new Schema({
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	message: { type: String, required: true, maxlength: 280 }
});

const Comment = model('Comment', commentsSchema);

module.exports = Comment;