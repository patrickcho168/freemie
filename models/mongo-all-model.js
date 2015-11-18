var mongoose = require('../controllers/mongo-controller').DB;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
	id: ObjectId,
	first_name: String,
	last_name: String,
	username: String,
	password: String,
	profile_pic: String,
	email: String,
	want: [{ itemId: {type: String, ref: 'Item'}, date: { type: Date, default: Date.now }}]
});

var ItemSchema = new Schema({
	id: ObjectId,
	time_posted: { type: Date, default: Date.now },
	title: String,
	giver_id: {type: ObjectId, ref: 'User', required: true},
	taker_id: {type: ObjectId, ref: 'User'},
	photo: String,
	description: String,
	wantedBy: [{ userId: {type: String, ref: 'User'}, date: { type: Date, default: Date.now }}]
});

var User = mongoose.model('User', UserSchema);
var Item = mongoose.model('Item', ItemSchema);

module.exports = {
	Item: Item,
	User: User
};