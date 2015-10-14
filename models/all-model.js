var DB = require('../controllers/db-controller').DB;

var Item = DB.Model.extend({
	tableName: 'item',
	idAttribute: 'id',
	giver_id: 'giver_id',
	taker_id: 'taker_id',
	belongsTo: function() {
		return this.belongsTo(User, Item.giver_id);
	},
	givenTo: function() {
		return this.belongsTo(User, Item.taker_id);
	},
	wantedBy: function() {
		return this.hasMany(Want, Want.item_id);
	}
});

var User = DB.Model.extend({
	tableName: 'user',
	idAttribute: 'id',
	owns: function() {
		return this.hasMany(Item, Item.giver_id);
	},
	takes: function() {
		return this.hasMany(Item, Item.taker_id);
	},
	wants: function() {
		return this.hasMany(Want, Want.user_id);
	}
});

var Want = DB.Model.extend({
	tableName: 'want',
	idAttribute: 'id',
	item_id: 'item_id',
	user_id: 'user_id',
	by: function() {
		return this.belongsTo(User, Want.user_id);
	},
	what: function() {
		return this.belongsTo(Item, Want.item_id);
	}
});

module.exports = {
	Item: Item,
	User: User,
	Want: Want
};