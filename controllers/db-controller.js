var knex = require('knex')({
  client: 'mysql',
  connection: {
   host: 'localhost',  // your host
   user: 'root', // your database user
   password: 'pat@ncsv27', // your database password
   database: 'freemie',
   charset: 'utf8'
	}
});

var Bookshelf = require('bookshelf')(knex);

module.exports.DB = Bookshelf;