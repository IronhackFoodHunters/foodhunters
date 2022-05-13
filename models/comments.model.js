const { Schema, model } = require('mongoose');

const commentsSchema = new Schema({
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	comment: { type: String, required: true, maxlength: 280 }
});

const Comments = model('Comments', commentsSchema);

module.exports = Comments;