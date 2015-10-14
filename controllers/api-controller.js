module.exports = function(app) {
	app.get('/api/person/:id', function(req, res) {
		//get that data from database
	});

	app.post('/api/person', function(req, res) {
		//save to database
	});

	app.delete('/api/person/:id', function(req, res) {
		//delete from database
	});
}